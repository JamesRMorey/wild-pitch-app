import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useRef, useState } from "react";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { delay, getDistanceBetweenPoints, normalise } from "../../functions/helpers";
import { SETTING, SHEET } from "../../consts";
import PointOfInterestMarker from "../../components/map/map-marker";
import { Bounds, Coordinate, Place, PointOfInterest, PositionArray, Route, RouteSearchResult } from "../../types";
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
import { usePointsOfInterest } from "../../hooks/repositories/usePointsOfInterest";
import RouteLine from "../../components/routes/route-line";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";
import { RouteService } from "../../services/route-service";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import Loader from "../../components/map/loader";
import RouteClusterMap from "../../components/routes/route-cluster-map";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any , route: any }
export default function RoutesScreen({ navigation } : PropsType) {

	const { styleURL, cameraRef, enable3DMode, activeRoute } = useRoutesState();
	const { flyTo, setCenter, fitToRoute, fitToBounds, setActiveRoute } = useRoutesActions();
    const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const { findByLatLng: findPointOfInterest } = usePointsOfInterest();
	const { routes } = useRoutes();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const [lineKey, setLineKey] = useState<number>(0);
	const [activePOI, setActivePOI] = useState<PointOfInterest>();
	const [routesInMap, setRoutesInMap] = useState<any>({
		type: 'FeatureCollection',
		features: []
	});
	const { debounce, cancel: cancelDebounce } = useDebouncedCallback();
	const [loading, setLoading] = useState<boolean>(false);
	const [currentBounds, setCurrentBounds] = useState<{ bounds: Bounds, zoom: number }>();
	const mapSearchEnabled = useRef<boolean>(true);
	

	const reCenter = async () => {
		if (!userPosition) return;

		setCenter([userPosition?.longitude + 0.0001, userPosition?.latitude + 0.0001]);
		await delay(100);
		flyTo([userPosition?.longitude + 0.0001, userPosition?.latitude + 0.0001], SETTING.MAP_CLOSEST_ZOOM);
	}

	const openSearch = () => {
		SheetManager.show(SHEET.MAP_SEARCH);
	}

    const navigateToBuilder = () => {
        navigation.navigate('route-builder', { 
			onGoBack: (params: any) => navigation.navigate('routes') 
		});
    }

	const handleRoutePress = ( route: Route ) => {
		tick();
		updateActiveRoute(route);
	}

	const updateActiveRoute = ( route: Route ) => {
		setActiveRoute(route);
		reDrawRoute();

		fitToRoute(route);
	}

	const clearActiveRoute = () => {
		setActiveRoute(undefined);
	}

	const navigateToRoute = ( route: Route ) => {
		navigation.navigate('route-details', { route: route });
	}

	const reDrawRoute = () => {
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
		
		pointOfInterestPress(poi);
	}

	const pointOfInterestPress = ( point: PointOfInterest ) => {
		tick();
		setActivePOI(point);
		flyTo([point.longitude, point.latitude], SETTING.MAP_MARKER_ZOOM)
	}

	const handleRouteSearchPress = async ( route: RouteSearchResult ) => {
		try {
			mapSearchEnabled.current = false;
			setLoading(true);
			SheetManager.hide(SHEET.MAP_SEARCH);
			const data = await OSMaps.fetchRoute(route.id, route.slug);

			updateActiveRoute(data);
		}
		catch(err) {
			console.log(err);
		}
		finally {
			setTimeout(() => setLoading(false), 300);
			setTimeout(() => mapSearchEnabled.current = true, 1000);
		}
	}

	const updateClusters = ( routesSearchResults: Array<RouteSearchResult> ) => {
		const clustered = routesSearchResults.map(r => {
			return {
				id: r.id,
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [r.longitude, r.latitude]
				},
				properties: {
					slug: r.slug,
					id: r.id,
				}
			}
		});
		
		setRoutesInMap({
			type: 'FeatureCollection',
			features: clustered
		});
	}
	
	const handleMapRegionChange = async ( bounds: Bounds, zoom: number ) => {
		try {
			if (!mapSearchEnabled.current) return;

			const { ne, sw } = bounds;
			if (currentBounds && RouteService.boundsInsideBounds({ ne: ne, sw: sw }, currentBounds.bounds) && zoom < (currentBounds.zoom + 2)) return;

			setLoading(true);
			const rts = await RouteService.getForMapArea({ latitude: ne[1], longitude: ne[0] }, { latitude: sw[1], longitude: sw[0] });
			updateClusters(rts);

			setCurrentBounds({ bounds: { ne: ne, sw: sw }, zoom: zoom });
		}
		catch (err) {
			console.log(err);
		}
		finally {
			setTimeout(() => setLoading(false), 300);
		}
	}

	const debouncedHandleMapRegionChange = debounce(handleMapRegionChange, 300);

	const handleClusterPress = ( points: Array<Position> ) => {
		if (points.length == 1) {
			flyTo([points[0][0], points[0][1]], SETTING.MAP_MARKER_ZOOM);
			return;
		}

		const bounds = RouteService.calculateBoundingBox(points.map(pt => ({ latitude: pt[1], longitude: pt[0] })));
		if (!bounds) return;

		fitToBounds(bounds.ne, bounds.sw, 100);
	}

    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={styleURL}
				pitchEnabled={enable3DMode}
				attributionEnabled={false}
				ref={mapRef}
				onRegionIsChanging={(e) => {
					if (!mapSearchEnabled.current) {
						cancelDebounce();
						return;
					};
					debouncedHandleMapRegionChange({ ne: e.properties.visibleBounds[0], sw: e.properties.visibleBounds[1] }, e.properties.zoomLevel);
				}}

            >
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
				{routes && !activeRoute && (
					<RouteClusterMap
						id="routes-cluster"
						routes={routesInMap}
						onRoutePress={(result: RouteSearchResult) => handleRouteSearchPress(result)}
						onClusterPress={(points: PositionArray) => handleClusterPress(points)}
					/>
				)}
				{activeRoute && (
					<RouteLine
						key={`line-${lineKey}`}
						start={{ latitude: activeRoute.latitude, longitude: activeRoute.longitude }}
						end={activeRoute.markers[activeRoute.markers.length - 1]}
						markers={activeRoute.markers}
						lineKey={lineKey}
					/>
				)}
				{activePOI && (
					<PointOfInterestMarker
						coordinate={[activePOI.longitude, activePOI.latitude]}
						icon={activePOI.point_type?.icon ?? 'flag'}
						colour={activePOI?.point_type?.colour ?? COLOUR.red[500]}
						onPress={() => pointOfInterestPress(activePOI)}
					/>
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
				{loading && (
					<View style={[styles.controlsContainer, { left: '50%', top: SETTING.TOP_PADDING + normalise(30), transform: [{ translateX: '-50%' }]}]}>
						<Loader />
					</View>
				)}
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
            </Mapbox.MapView>
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
		alignItems: 'flex-start',
		zIndex: 10,
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