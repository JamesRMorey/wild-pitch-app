import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from "react";
import MapStyleControls from "../components/map/map-style-controls";
import UserPosition from "../components/map/user-position";
import IconButton from "../components/buttons/icon-button";
import { delay, normalise } from "../functions/helpers";
import { useMapContext } from "../contexts/map-context";
import MapArea from "../components/map/map-area";
import ActiveItemControls from "../components/map/active-item-controls";
import MapSearchControls from "../components/map/map-search-controls";
import { useMapPackContext } from "../contexts/map-pack-context";
import MapPackSheet from "../components/sheets/map-pack-sheet";
import { SETTING, SHEET } from "../consts";
import MapMarker from "../components/map/map-marker";
import { MapMarker as MapMarkerType } from "../types";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

const MARKER: MapMarkerType = {
	coordinate: [-1.865014, 53.450585],
	type: 'area'
}

export default function MapScreen({}) {

	const { styleURL, center, activePackGroup, clearActivePackGroup, cameraRef, enable3DMode } = useMapContext();
	const { selectedPackGroup } = useMapPackContext();
	const [showUserLocation, setShowUserLocation] = useState<boolean>(false);
	const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);
	const [markers, setMarkers] = useState<Array<MapMarkerType>>([MARKER])


	const reCenter = async () => {
		setFollowUserLocation(true);
		await delay(3000);
		setFollowUserLocation(false)
	}

	const addMarkerFromLongPress = ( e: any ) => {
		const marker: MapMarkerType = {
			coordinate: e.geometry.coordinates,
			type: 'area'
		}
		setMarkers([...markers, marker]);
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
                {markers.map((marker, i) => {
					return (
						<MapMarker
							key={i}
							coordinate={marker.coordinate}
							type={marker.type}
						/>
					)
				})}
				{activePackGroup && (
					<MapArea 
						id='test'
						bounds={activePackGroup.bounds}
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
					<IconButton
						icon={'location-pin'}
						onPress={() => reCenter()}
						disabled={followUserLocation}
						active={followUserLocation}
					/>
				</View>
			</View>
			<MapPackSheet id={SHEET.MAP_PACKS_SEARCH} packGroup={selectedPackGroup}/>
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
	}
});