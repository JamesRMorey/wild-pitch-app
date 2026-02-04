import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState } from "react";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { delay, normalise } from "../../utils/helpers";
import { useMapActions, useMapState } from "../../contexts/map-context";
import MapArea from "../../components/map/map-area";
import ActiveItemControls from "../../components/map/active-item-controls";
import { ASSET, SETTING, SHEET } from "../../consts";
import PointOfInterestMarker from "../../components/map/map-marker";
import { Place, PointOfInterest, RouteSearchResult } from "../../types";
import { Route } from "../../models/route";
import { SheetManager } from "react-native-actions-sheet";
import { Format } from "../../services/formatter";
import ThreeDMode from "../../components/map/three-d-mode";
import PointOfInterestSheet from "../../sheets/point-of-interest/point-of-interest-sheet";
import { EventBus } from "../../services/event-bus";
import { COLOUR } from "../../styles";
import useHaptic from "../../hooks/useHaptic";
import CompassButton from "../../components/buttons/compass-button";
import SearchSheet from "../../sheets/search-sheet";
import { useMapSettings } from "../../hooks/useMapSettings";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";
import MultiButtonControl from "../../components/map/multi-button-control";
import MapStyleSheet from "../../sheets/map-style-sheet";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import RouteLine from "../../components/routes/route-line";
import ActiveRouteInformation from "../../components/routes/active-route-information";
import Loader from "../../components/map/loader";
import { useGlobalActions, useGlobalState } from "../../contexts/global-context";
import { useRoutesState } from "../../contexts/routes-context";
import { usePointsOfInterestActions } from "../../contexts/pois-context";
import { WildPitchApi } from "../../services/api/wild-pitch";
import { useBookmarkedRoutesState } from "../../contexts/bookmarked-routes-context";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbWl3YjB1dzAwMHN5M2RzYm82NnZyaWdkIn0.y85WCj95c6ibCAuQ4REbIw");

type PropsType = { navigation: any }
export default function MapScreen({ navigation } : PropsType) {

	const { verifyLogin } = useGlobalActions();
	const { styleURL, activePackGroup, cameraRef, enable3DMode, pointsOfInterest, showPointsOfInterest, activeRoute, showRoutes } = useMapState();
	const { clearActivePackGroup, flyToLow, resetHeading, reCenter, setActiveRoute, fitToRoute } = useMapActions();
	const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const { heading, setHeading, followUserPosition, setFollowUserPosition } = useMapCameraControls();
	const { findByLatLng: findPointOfInterest } = usePointsOfInterestActions();
	const { routes } = useRoutesState();
	const { bookmarkedRoutes } = useBookmarkedRoutesState();
	const [activePOI, setActivePOI] = useState<PointOfInterest>();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const [mapCenter, setMapCenter] = useState<Position>();
	const [lineKey, setLineKey] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	const addMarkerFromLongPress = async ( e: any ) => {
		setFollowUserPosition(false);
		const now = new Date();
		const poi: PointOfInterest = {
			name: `New Location - ${Format.dateToDateTime(now)}`,
			latitude: e.geometry.coordinates[1],
			longitude: e.geometry.coordinates[0]
		};

		pointOfInterestPress(poi);
	}

	const pointOfInterestPress = ( point: PointOfInterest ) => {
		setFollowUserPosition(false);
		tick();
		setActivePOI(point);
		flyToLow([point.longitude, point.latitude], SETTING.MAP_MARKER_ZOOM)
		navigateToPOI(point);
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

		await delay(100);
		pointOfInterestPress(poi);
	}

	const navigateToPOI = ( point: PointOfInterest ) => {
		SheetManager.show(SHEET.MAP_POI_SHEET)
	}

	const openSearch = () => {
		SheetManager.show(SHEET.MAP_SEARCH);
	}

	const openStyleSheet = () => {
        SheetManager.show(SHEET.MAP_STYLES)
    }

	const handleRouteSearchPress = async ( route: RouteSearchResult, fit:boolean=true ) => {
		try {
			setLoading(true);
			await SheetManager.hide(SHEET.MAP_SEARCH);
			const data = await WildPitchApi.findRoute(route.server_id);

			if (!data) return;

			updateActiveRoute(new Route(data), fit);
		}
		catch(err) {
			console.log(err);
		}
		finally {
			setTimeout(() => setLoading(false), 300);
		}
	}

	const navigateToAreaBuilder = () => {
		if (!verifyLogin()) return;
		navigation.navigate('area-builder', { initialCenter: mapCenter });
	}

	const handleRoutePress = ( route: Route ) => {
		tick();
		updateActiveRoute(route);
	}

	const updateActiveRoute = ( route: Route, fit:boolean=true ) => {
		setFollowUserPosition(false);
		setActiveRoute(route);
		reDrawRoute();

		if (fit) {
			fitToRoute(route);
		}
	}

	const reDrawRoute = () => {
		setLineKey((prev) => prev + 1);
	}

	const clearActiveRoute = () => {
		setFollowUserPosition(false);
		setActiveRoute(undefined);
	}

	const navigateToRoute = ( route: Route ) => {
		if (!verifyLogin()) return;
		navigation.navigate('route-details', { route: route });
	}


	useEffect(() => {
		const flyToMarkerListener = EventBus.listen.mapInspectPOI((poi: PointOfInterest) => pointOfInterestPress(poi));

		return () => {
			flyToMarkerListener.remove();
		}
	}, [])


    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={styleURL}
				onLongPress={(e) => addMarkerFromLongPress(e)}
				pitchEnabled={enable3DMode}
				attributionEnabled={true}
				attributionPosition={{ bottom: 6, left: 90 }}
				scaleBarPosition={{ bottom: 40,left: 15 }}
				ref={mapRef}
				onMapIdle={(event) => {
					const heading = event.properties?.heading;
					setHeading(heading);
					setMapCenter(event.properties.center);
				}}
				onTouchStart={() => {
					if (followUserPosition) setFollowUserPosition(false);
				}}
            >
				<Mapbox.Images images={{arrow: ASSET.ROUTE_LINE_ARROW, flag: ASSET.ROUTE_FLAG}} />
				{enable3DMode && (
					<ThreeDMode />
				)}
                {(initialRegion && userPosition) &&
					<Mapbox.Camera
						ref={(ref) => {
							if (ref) cameraRef.current = ref;
						}}
						centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
						zoomLevel={SETTING.MAP_CLOSEST_ZOOM}
						animationDuration={loaded ? 500 : 0}
						followUserLocation={followUserPosition}
					/>
				}
                {pointsOfInterest.map((point, i) => {
					if (!showPointsOfInterest) return;
					return (
						<PointOfInterestMarker
							key={point.id}
							coordinate={[point.longitude, point.latitude]}
							icon={point.point_type?.icon ?? 'flag'}
							colour={point.point_type?.colour ?? COLOUR.red[500]}
							onPress={() => pointOfInterestPress(point)}
						/>
					)
				})}
				{routes.map((route, i) => {
					if (!showRoutes) return;
					return (
						<PointOfInterestMarker
							key={i}
							coordinate={[route.longitude, route.latitude]}
							icon={'route'}
							colour={COLOUR.blue[500]}
							onPress={() => handleRoutePress(route)}
						/>
					)
				})}
				{bookmarkedRoutes.map((route, i) => {
					if (!showRoutes) return;
					return (
						<PointOfInterestMarker
							key={i}
							coordinate={[route.longitude, route.latitude]}
							icon={'route'}
							colour={COLOUR.blue[500]}
							onPress={() => handleRoutePress(route)}
							isBookmarked={true}
						/>
					)
				})}
				{activeRoute &&
					<RouteLine
						key={`line-${lineKey}`}
						start={{ latitude: activeRoute.latitude, longitude: activeRoute.longitude }}
						end={activeRoute.markers[activeRoute.markers.length - 1]}
						markers={activeRoute.markers}
						lineKey={lineKey}
					/>
				}
				{(activePOI && !activePOI.id) && 
					<PointOfInterestMarker
						coordinate={[activePOI.longitude, activePOI.latitude]}
						icon={activePOI.point_type?.icon ?? 'flag'}
						colour={activePOI?.point_type?.colour ?? COLOUR.red[500]}
						onPress={() => pointOfInterestPress(activePOI)}
					/>
				}
				{activePackGroup &&
					<MapArea 
						id='test'
						bounds={activePackGroup.bounds}
					/>
				}
				<UserPosition
					onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
				/>
            </Mapbox.MapView>
			{loading &&
				<View style={[styles.controlsContainer, { left: '50%', top: SETTING.TOP_PADDING + normalise(30), transform: [{ translateX: '-50%' }]}]}>
					<Loader />
				</View>
			}
			<View style={[styles.controlsContainer, { left: normalise(10), top: SETTING.TOP_PADDING }]}>
				<IconButton
					icon={'search'}
					onPress={openSearch}
					shadow={true}
				/>
			</View>
			<View style={[styles.controlsContainer, { right: normalise(10), top: SETTING.TOP_PADDING }]}>
				<IconButton
					icon={'cloud-download'}
					onPress={navigateToAreaBuilder}
					shadow={true}
				/>
			</View>
			<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(10) }]}>
				{(heading > 0 && !activeRoute) &&
					<CompassButton
						onPress={resetHeading}
						disabled={!userPosition}
						shadow={true}
						heading={heading}
					/>
				}
				{!activeRoute &&
					<MultiButtonControl
						items={[
							{ icon: 'layers', onPress: () => openStyleSheet() },
							{ icon: 'crosshair', onPress: () => reCenter([userPosition?.longitude, userPosition?.latitude]), disabled: followUserPosition },
							{ icon: followUserPosition ? 'navigation-2-off' : 'navigation-2', onPress: () => setFollowUserPosition(!followUserPosition) },
						]}
					/>
				}
			</View>
			{activeRoute ?
				<View style={styles.activeRouteContainer}>
					<ActiveRouteInformation
						route={activeRoute}
						onPress={() => navigateToRoute(activeRoute)}
						onClose={() => clearActiveRoute()}
					/>
				</View>
			:activePackGroup ?
				<View style={[styles.controlsContainer, { bottom: normalise(20), width: '100%', alignItems: 'center' }]}>
					<ActiveItemControls
						name={activePackGroup.name}
						onPress={() => clearActivePackGroup()}
					/>
				</View>
			:null}
			<PointOfInterestSheet
				id={SHEET.MAP_POI_SHEET}
				point={activePOI}
			/>
			<SearchSheet
				id={SHEET.MAP_SEARCH}
				onPlaceResultPress={(place) => handlePlaceResultPress(place)}
				onRouteResultPress={(route: RouteSearchResult) => handleRouteSearchPress(route)}
			/>
			<MapStyleSheet/>
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
	bottomRightControls: {
		position: 'absolute',
		bottom: normalise(10),
		right: normalise(10),
		gap: normalise(8),
	},
	activeRouteContainer: {
		position: 'absolute',
		bottom: normalise(20),
		left: 0,
		borderRadius: normalise(15),
		paddingHorizontal: normalise(20),
		width: '100%',
	}
});