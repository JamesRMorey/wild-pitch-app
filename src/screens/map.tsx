import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from "react";
import MapStyleControls from "../components/map/map-style-controls";
import UserPosition from "../components/map/user-position";
import IconButton from "../components/buttons/icon-button";
import { delay, normalise } from "../functions/helpers";
import { useMapActions, useMapState } from "../contexts/map-context";
import MapArea from "../components/map/map-area";
import ActiveItemControls from "../components/map/active-item-controls";
import MapSearchControls from "../components/map/map-search-controls";
import { useMapPackContext } from "../contexts/map-pack-context";
import MapPackSheet from "../components/sheets/map-pack-sheet";
import { SETTING, SHEET } from "../consts";
import PointOfInterestMarker from "../components/map/map-marker";
import { PointOfInterest } from "../types";
import MapPointOfInterestSheet from "../components/sheets/map-point-of-interest/map-point-of-interest-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { Format } from "../services/formatter";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

export default function MapScreen({}) {

	const { styleURL, center, activePackGroup, cameraRef, enable3DMode, followUserLocation, pointsOfInterest } = useMapState();
	const { clearActivePackGroup, flyTo, setFollowUserLocation, resetHeading, createPointOfInterest, updatePointOfInterest, deletePointOfInterest } = useMapActions();
	const { selectedPackGroup } = useMapPackContext();
	const [showUserLocation, setShowUserLocation] = useState<boolean>(false);
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

		if (!poi) return;

		flyTo([poi.longitude, poi.latitude], SETTING.MAP_MARKER_ZOOM);

		setActivePOI(poi);
		openMarkerSheet();
	}

	const closeMarkerSheet = () => {
		SheetManager.hide(SHEET.MAP_MARKER);
	}

	const openMarkerSheet = () => {
		SheetManager.show(SHEET.MAP_MARKER);
	}

	const openActivePackGroupSheet = () => {
		if (!activePackGroup) return;
		flyTo(activePackGroup.center)
		SheetManager.show(SHEET.MAP_PACKS);
	}

	useEffect(() => {
		if (!showUserLocation) {
			setTimeout(() => setShowUserLocation(true), 5000);
		}
	}, []);


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
					<>
						<Mapbox.Terrain
							exaggeration={3}
							sourceID="mapbox-dem"
						/>
						<Mapbox.RasterDemSource
							id="mapbox-dem"
							url="mapbox://mapbox.mapbox-terrain-dem-v1"
							tileSize={512}
						/>
					</>
				)}
                <Mapbox.Camera
					ref={(ref) => {
						if (ref) cameraRef.current = ref;
					}}
                    centerCoordinate={center}
                    zoomLevel={SETTING.MAP_DEFAULT_ZOOM}
					followUserLocation={followUserLocation}
                />
                {pointsOfInterest.map((point, i) => {
					return (
						<PointOfInterestMarker
							key={point.id}
							coordinate={[point.longitude, point.latitude]}
							icon={point.point_type?.icon ?? 'flag'}
							colour={point.point_type?.colour}
							onPress={() => {
								setActivePOI(point);
								flyTo([point.longitude, point.latitude], SETTING.MAP_MARKER_ZOOM)
								openMarkerSheet();
							}}
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
                {showUserLocation && (
					<UserPosition />
				)}
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
					<MapSearchControls />
				</View>
			</View>
			<View style={styles.bottomRightControls}>
				<IconButton
					icon={'navigate-outline'}
					onPress={() => reCenter()}
					disabled={followUserLocation}
					active={followUserLocation}
					shadow={true}
				/>
				<IconButton
					icon={'compass'}
					onPress={() => resetHeading()}
					shadow={true}
				/>
			</View>
			<MapPackSheet 
				id={SHEET.MAP_PACKS} 
				packGroup={selectedPackGroup}
			/>
			<MapPointOfInterestSheet 
				id={SHEET.MAP_MARKER} 
				pointOfInterest={activePOI}
				onSave={(point: PointOfInterest) => {
					const newPoint = createPointOfInterest(point);

					if (!newPoint) {
						setActivePOI(undefined);
						closeMarkerSheet();
						return;
					}

					setActivePOI(newPoint);
				}}
				onUpdate={(point: PointOfInterest) => {
					const updated = updatePointOfInterest(point);

					if (!updated) {
						setActivePOI(undefined);
						closeMarkerSheet();
						return;
					}
					
					setActivePOI(updated);
				}}
				onDelete={(point: PointOfInterest) => {
					if (!point.id) return;

					deletePointOfInterest(point.id);
					closeMarkerSheet();
					setActivePOI(undefined);
				}}
				onClose={() => setActivePOI(undefined)}
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
		top: normalise(50),
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