import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { act, useEffect, useRef, useState } from "react";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { delay, normalise } from "../../functions/helpers";
import { ASSET, SETTING, SHEET } from "../../consts";
import PointOfInterestMarker from "../../components/map/map-marker";
import { Coordinate, Place, PointOfInterest, Route, RouteSearchResult } from "../../types";
import { SheetManager } from "react-native-actions-sheet";
import { COLOUR } from "../../styles";
import useHaptic from "../../hooks/useHaptic";
import CompassButton from "../../components/buttons/compass-button";
import SearchSheet from "../../sheets/search-sheet";
import Button from "../../components/buttons/button";
import { useRoutesActions, useRoutesState } from "../../contexts/routes-context";
import { useMapSettings } from "../../hooks/useMapSettings";
import { useRoutes } from "../../hooks/repositories/useRoutes";
import ActiveRouteInformation from "../../components/routes/active-route-information";
import { OSMaps } from "../../services/os-maps";
import { RouteService } from "../../services/route-service";
import { EventBus } from "../../services/event-bus";
import { usePointsOfInterest } from "../../hooks/repositories/usePointsOfInterest";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any , route: any }
export default function RoutesScreen({ navigation, route: navRoute } : PropsType) {

	const { styleURL, cameraRef, enable3DMode } = useRoutesState();
	const { flyTo, setCenter, resetHeading, fitToBounds } = useRoutesActions();
    const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const { findByLatLng: findPointOfInterest } = usePointsOfInterest();
	const { routes } = useRoutes();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const [mapHeading, setMapHeading] = useState<number>(0);
	const [activeRoute, setActiveRoute] = useState<Route>();
	const [activeRouteLine, setActiveRouteLine] = useState<any>();
	const [activeRouteStart, setActiveRouteStart] = useState<Coordinate>();
	const [activeRouteEnd, setActiveRouteEnd] = useState<Coordinate>();
	const [lineKey, setLineKey] = useState<number>(0);
	

	const reCenter = async () => {
		if (!userPosition) return;

		setCenter([userPosition?.longitude + 0.0001, userPosition?.latitude + 0.0001]);
		await delay(100);
		flyTo([userPosition?.longitude + 0.0001, userPosition?.latitude + 0.0001], SETTING.MAP_CLOSEST_ZOOM);
	}

	const openSearch = () => {
		SheetManager.show(SHEET.MAP_SEARCH);
	}

	const resetMapHeading = () => {
		setMapHeading(0)
		resetHeading();
	}

    const navigateToBuilder = () => {
        navigation.navigate('route-builder', { onGoBack: (params: any) => navigation.navigate('routes') });
    }

	const handleRoutePress = ( route: Route ) => {
		tick();
		updateActiveRoute(route);
	}

	const updateActiveRoute = ( route: Route ) => {
		setActiveRoute(route);
		updateActiveRouteLine(route.markers);
		setActiveRouteStart(route.markers[0]);
		setActiveRouteEnd(route.markers[route.markers.length - 1]);

		const boundingBox = RouteService.calculateBoundingBox(route.markers);
		if (boundingBox) {
			fitToBounds(boundingBox.ne, boundingBox.sw);
		}
	}

	const clearActiveRoute = () => {
		setActiveRoute(undefined);
		setActiveRouteLine(undefined);
		setActiveRouteStart(undefined);
		setActiveRouteEnd(undefined);
	}

	const navigateToRoute = ( route: Route ) => {
		navigation.navigate('route-details', { route: route });
	}

	const updateActiveRouteLine = ( markers: Array<Coordinate> ) => {
		console.log(markers.length)
		setActiveRouteLine({
			type: 'FeatureCollection',
			features: [{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: markers.map(m => [m.longitude, m.latitude])
				}
			}]
		});
		setLineKey((prev) => prev + 1);
	}

	const handlePlaceResultPress = async (place: Place) => {
		await SheetManager.hide(SHEET.MAP_SEARCH);
		const existingPOI = findPointOfInterest(place.latitude, place.longitude);
		
		const poi = existingPOI ?? {
			name: place.name,
			latitude: place.latitude,
			longitude: place.longitude,
			point_type_id: place?.point_type?.id ?? undefined,
			point_type: place?.point_type ?? undefined
		};

		navigation.navigate('map', { screen: 'map' });
		await delay(700);

		EventBus.emit.mapInspectPOI(poi);
	}

	const handleRouteSearchPress = async ( route: RouteSearchResult ) => {
		try {
			SheetManager.hide(SHEET.MAP_SEARCH);
			const data = await OSMaps.fetchRoute(route.id, route.slug);

			updateActiveRoute(data);
		}
		catch(err) {
			console.log(err);
		}
	}

	// Activate route if passed in navigation params
	useEffect(() => {
		console.log(navRoute?.params?.route);
		if (navRoute?.params?.route) {
			setTimeout(() => updateActiveRoute(navRoute.params.route), 500);
			navigation.setParams({ route: undefined });
		}
	}, [navRoute?.params]);


    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={styleURL}
				pitchEnabled={enable3DMode}
				attributionEnabled={false}
				ref={mapRef}
				onMapIdle={(event) => {
					const heading = event.properties?.heading;
					setMapHeading(heading);
				}}
            >
				<Mapbox.Images images={{arrow: ASSET.ROUTE_LINE_ARROW}} />
                {initialRegion && (
                    <Mapbox.Camera
                        ref={(ref) => {
                            if (ref) cameraRef.current = ref;
                        }}
                        centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
                        zoomLevel={SETTING.ROUTE_DEFAULT_ZOOM}
                        animationDuration={loaded ? 500 : 0}
                    />
                )}
				{routes.map((route, i) => {
					return (
						<PointOfInterestMarker
							key={i}
							coordinate={[route.longitude, route.latitude]}
							icon={'location'}
							colour={COLOUR.blue[500]}
							onPress={() => handleRoutePress(route)}
						/>
					)
				})}
				{(activeRouteStart && activeRouteEnd && activeRoute) && (
					<>
						<PointOfInterestMarker
							coordinate={[activeRouteStart.longitude, activeRouteStart.latitude]}
							icon={'location'}
							colour={COLOUR.blue[500]}
							disabled={true}
						/>
						<PointOfInterestMarker
							coordinate={[activeRouteEnd.longitude, activeRouteEnd.latitude]}
							icon={'flag'}
							colour={COLOUR.blue[500]}
							disabled={true}
						/>
					</>
				)}
				{activeRouteLine && (
					<Mapbox.ShapeSource id={`lineSource-${lineKey}`} shape={activeRouteLine}>
						<Mapbox.LineLayer
							id={`lineLayer`}
							style={{
								lineColor: SETTING.ROUTE_LINE_COLOUR,
								lineWidth: 12,
								lineOpacity: 0.9,
								lineCap: 'round',
								lineJoin: 'round'

							}}
						/>
						<Mapbox.SymbolLayer
							id={`arrowLayer`}
							style={{
								symbolPlacement: "line",
								iconImage: "arrow",
								iconSize: 0.4,
								iconAllowOverlap: true,
								iconIgnorePlacement: true,
								symbolSpacing: 50,
							}}
						/>
					</Mapbox.ShapeSource>
				)}
				<UserPosition
					onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
				/>
				{activeRoute && (
					<View style={styles.activeRouteContainer}>
						<ActiveRouteInformation
							route={activeRoute}
							onPress={() => navigateToRoute(activeRoute)}
							onClose={() => clearActiveRoute()}
						/>
					</View>
				)}
            </Mapbox.MapView>
			<View style={[styles.controlsContainer, { right: normalise(10), top: SETTING.TOP_PADDING }]}>
				<IconButton
					icon={'navigate-outline'}
					onPress={reCenter}
					disabled={!userPosition}
					shadow={true}
					style={{ paddingRight: normalise(2), paddingTop: normalise(2) }}
				/>
			</View>
			<View style={[styles.controlsContainer, { left: normalise(10), top: SETTING.TOP_PADDING }]}>
				<IconButton
					icon={'search-outline'}
					onPress={openSearch}
					shadow={true}
				/>
			</View>
			<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(10) }]}>
				{mapHeading > 0 && (
					<CompassButton
						onPress={resetMapHeading}
						disabled={!userPosition}
						shadow={true}
						heading={mapHeading}
					/>
				)}
			</View>
            <View style={styles.bottomBar}>
                <Button
                    title="Create new route"
                    onPress={navigateToBuilder}
                />
            </View>
			<SearchSheet
				id={SHEET.MAP_SEARCH}
				onPlaceResultPress={(place) => handlePlaceResultPress(place)}
				onRouteResultPress={(route: RouteSearchResult) => handleRouteSearchPress(route)}
			/>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOUR.wp_brown[100]
	},
	map: {
		flex: 1
	},
	controlsContainer: {
		position: 'absolute',
		gap: normalise(8),
		alignItems: 'flex-start'
	},
	controls: {
		gap: normalise(8),
	},
    bottomBar: {
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: COLOUR.white,
        paddingVertical: normalise(15),
        paddingHorizontal: normalise(15),
	},
	activeRouteContainer: {
		position: 'absolute',
		bottom: normalise(10),
		left: 0,
		borderRadius: normalise(15),
		padding: normalise(10),
		width: '100%',
	}
});