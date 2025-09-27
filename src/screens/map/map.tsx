import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState } from "react";
import MapStyleControls from "../../components/map/map-style-controls";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { delay, normalise } from "../../functions/helpers";
import { useMapActions, useMapState } from "../../contexts/map-context";
import MapArea from "../../components/map/map-area";
import ActiveItemControls from "../../components/map/active-item-controls";
import { ASSET, SETTING, SHEET } from "../../consts";
import PointOfInterestMarker from "../../components/map/map-marker";
import { Place, PointOfInterest, RouteSearchResult } from "../../types";
import { SheetManager } from "react-native-actions-sheet";
import { Format } from "../../services/formatter";
import ThreeDMode from "../../components/map/three-d-mode";
import PointOfInterestSheet from "../../sheets/point-of-interest/point-of-interest-sheet";
import { EventBus } from "../../services/event-bus";
import { COLOUR } from "../../styles";
import useHaptic from "../../hooks/useHaptic";
import CompassButton from "../../components/buttons/compass-button";
import SearchSheet from "../../sheets/search-sheet";
import { usePointsOfInterest } from "../../hooks/repositories/usePointsOfInterest";
import { useMapSettings } from "../../hooks/useMapSettings";
import { OSMaps } from "../../services/os-maps";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";
import MultiButtonControl from "../../components/map/multi-button-control";
import MapStyleSheet from "../../sheets/map-style-sheet";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { useRoutesActions } from "../../contexts/routes-context";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any }
export default function MapScreen({ navigation } : PropsType) {

	const { styleURL, activePackGroup, cameraRef, enable3DMode, pointsOfInterest, showPointsOfInterest } = useMapState();
	const { clearActivePackGroup, flyTo, flyToLow, setCenter, resetHeading, reCenter } = useMapActions();
	const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const { heading, setHeading, followUserPosition, setFollowUserPosition } = useMapCameraControls();
	const { setActiveRoute, fitToRoute } = useRoutesActions();
	const [activePOI, setActivePOI] = useState<PointOfInterest>();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const { findByLatLng: findPointOfInterest } = usePointsOfInterest();
	const [mapCenter, setMapCenter] = useState<Position>();

	const addMarkerFromLongPress = async ( e: any ) => {
		const now = new Date();
		const poi: PointOfInterest = {
			name: `New Location - ${Format.dateToDateTime(now)}`,
			latitude: e.geometry.coordinates[1],
			longitude: e.geometry.coordinates[0]
		};

		pointOfInterestPress(poi);
	}

	const pointOfInterestPress = ( point: PointOfInterest ) => {
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

	const handleRouteSearchPress = async ( route: RouteSearchResult ) => {
		try {
			await SheetManager.hide(SHEET.MAP_SEARCH);
			const data = await OSMaps.fetchRoute(route.id, route.slug);

			navigation.navigate('routes', { screen: 'routes-map' });
			await delay(200);

			setActiveRoute(data);
			fitToRoute(data);
		}
		catch(err) {
			console.log(err);
		}
	}

	const navigateToAreaBuilder = () => {
		navigation.navigate('area-builder', { resetTo: 'map', initialCenter: mapCenter });
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
				attributionEnabled={false}
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
                {initialRegion && (
					<Mapbox.Camera
						ref={(ref) => {
							if (ref) cameraRef.current = ref;
						}}
						centerCoordinate={(!activePOI) && [initialRegion.longitude, initialRegion.latitude]}
						zoomLevel={SETTING.MAP_CLOSEST_ZOOM}
						animationDuration={loaded ? 500 : 0}
						followUserLocation={followUserPosition}
					/>
				)}
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
				{(activePOI && !activePOI.id) && (
					<PointOfInterestMarker
						coordinate={[activePOI.longitude, activePOI.latitude]}
						icon={activePOI.point_type?.icon ?? 'flag'}
						colour={activePOI?.point_type?.colour ?? COLOUR.red[500]}
						onPress={() => pointOfInterestPress(activePOI)}
					/>
				)}
				{activePackGroup && (
					<MapArea 
						id='test'
						bounds={activePackGroup.bounds}
					/>
				)}
				<UserPosition
					onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
				/>
            </Mapbox.MapView>
			<View style={[styles.controlsContainer, { left: normalise(10), top: SETTING.TOP_PADDING }]}>
				<IconButton
					icon={'search-outline'}
					onPress={openSearch}
					shadow={true}
				/>
			</View>
			<View style={[styles.controlsContainer, { right: normalise(10), top: SETTING.TOP_PADDING }]}>
				<IconButton
					icon={'compass-outline'}
					onPress={openSearch}
					shadow={true}
				/>
				<IconButton
					icon={'cloud-download-outline'}
					onPress={navigateToAreaBuilder}
					shadow={true}
				/>
			</View>
			<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(10) }]}>
				{heading > 0 && (
					<CompassButton
						onPress={resetHeading}
						disabled={!userPosition}
						shadow={true}
						heading={heading}
					/>
				)}
				<MultiButtonControl
					items={[
						{ icon: 'layers-outline', onPress: () => openStyleSheet() },
						{ icon: 'location-outline', onPress: () => reCenter([userPosition?.longitude, userPosition?.latitude]) },
						{ icon: followUserPosition ? 'navigate' : 'navigate-outline', onPress: () => setFollowUserPosition(!followUserPosition) },
					]}
				/>
			</View>
			<View style={[styles.controlsContainer, { bottom: normalise(20), width: '100%', alignItems: 'center' }]}>
				{activePackGroup && (
					<ActiveItemControls
						name={activePackGroup.name}
						onPress={() => clearActivePackGroup()}
					/>
				)}
			</View>
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
	}
});