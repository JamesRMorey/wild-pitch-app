import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { act, useState } from "react";
import MapStyleControls from "../../components/map/map-style-controls";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { delay, normalise } from "../../functions/helpers";
import { useMapActions, useMapState } from "../../contexts/map-context";
import MapArea from "../../components/map/map-area";
import ActiveItemControls from "../../components/map/active-item-controls";
import { SETTING, SHEET } from "../../consts";
import PointOfInterestMarker from "../../components/map/map-marker";
import { PointOfInterest } from "../../types";
import { SheetManager } from "react-native-actions-sheet";
import { Format } from "../../services/formatter";
import ThreeDMode from "../../components/map/three-d-mode";
import PointOfInterestSheet from "../../sheets/point-of-interest/point-of-interest-sheet";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any }
export default function MapScreen({ navigation } : PropsType) {

	const { styleURL, center, activePackGroup, cameraRef, enable3DMode, followUserLocation, pointsOfInterest, showPointsOfInterest } = useMapState();
	const { clearActivePackGroup, flyTo, flyToLow, setFollowUserLocation, resetHeading, createPointOfInterest, updatePointOfInterest, deletePointOfInterest } = useMapActions();
	const [activePOI, setActivePOI] = useState<PointOfInterest>();

	const reCenter = async () => {
		setFollowUserLocation(true);
		await delay(4000);
		setFollowUserLocation(false)
	}

	const addMarkerFromLongPress = ( e: any ) => {
		const now = new Date();
		const poi: PointOfInterest = {
			name: `New Location - ${Format.dateToDateTime(now)}`,
			latitude: e.geometry.coordinates[1],
			longitude: e.geometry.coordinates[0]
		};

		pointOfInterestPress(poi);
	}

	const openActivePackGroupSheet = () => {
		if (!activePackGroup) return;
		flyTo(activePackGroup.center)
		SheetManager.show(SHEET.MAP_PACKS);
	}

	const pointOfInterestPress = ( point: PointOfInterest ) => {
		setActivePOI(point);
		flyToLow([point.longitude, point.latitude], SETTING.MAP_MARKER_ZOOM)
		navigateToPOI(point);
	}

	const navigateToPOI = ( point: PointOfInterest ) => {
		SheetManager.show(SHEET.MAP_POI_SHEET)
		// navigation.navigate({ name: 'map-point-of-interest-overview', params: { point: point }})
	}


    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={styleURL}
				onLongPress={(e) => addMarkerFromLongPress(e)}
				pitchEnabled={enable3DMode}
				attributionEnabled={false}
            >
				{enable3DMode && (
					<ThreeDMode />
				)}
                <Mapbox.Camera
					ref={(ref) => {
						if (ref) cameraRef.current = ref;
					}}
                    centerCoordinate={center}
                    zoomLevel={SETTING.MAP_DEFAULT_ZOOM}
					followUserLocation={followUserLocation}
					animationDuration={0}
					animationMode="none"
                />
                {pointsOfInterest.map((point, i) => {
					if (!showPointsOfInterest) return;
					return (
						<PointOfInterestMarker
							key={point.id}
							coordinate={[point.longitude, point.latitude]}
							icon={point.point_type?.icon ?? 'flag'}
							colour={point.point_type?.colour}
							onPress={() => pointOfInterestPress(point)}
						/>
					)
				})}
				{(activePOI && !activePOI.id) && (
					<PointOfInterestMarker
						coordinate={[activePOI.longitude, activePOI.latitude]}
						type={'poi'}
					/>
				)}
				{activePackGroup && (
					<MapArea 
						id='test'
						bounds={activePackGroup.bounds}
						onPress={() => openActivePackGroupSheet()}
					/>
				)}
				<UserPosition />
            </Mapbox.MapView>
			<View style={styles.controlsContainer}>
				{activePackGroup && (
					<ActiveItemControls
						name={activePackGroup.name}
						onPress={() => clearActivePackGroup()}
					/>
				)}
				<View style={styles.controls}>
					<MapStyleControls/>
					<IconButton
						icon={'navigate-outline'}
						onPress={() => reCenter()}
						disabled={followUserLocation}
						active={followUserLocation}
						shadow={true}
					/>
				</View>
			</View>
			<PointOfInterestSheet
				id={SHEET.MAP_POI_SHEET}
				point={activePOI}
			/>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1
	},
	controlsContainer: {
		position: 'absolute',
		right: normalise(10),
		top: SETTING.TOP_PADDING,
		gap: normalise(8),
		flexDirection: 'row',
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