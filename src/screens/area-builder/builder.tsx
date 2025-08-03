import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from "react";
import MapStyleControls from "../../components/map/map-style-controls";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { delay, normalise } from "../../functions/helpers";
import { useMapActions, useMapState } from "../../contexts/map-context";
import MapArea from "../../components/map/map-area";
import ActiveItemControls from "../../components/map/active-item-controls";
import MapSearchControls from "../../components/map/map-search-controls";
import { useMapPackContext } from "../../contexts/map-pack-context";
import MapPackSheet from "../../components/sheets/map-pack-sheet";
import { SETTING, SHEET } from "../../consts";
import MapMarker from "../../components/map/map-marker";
import { MapMarker as MapMarkerType, MapPack, MapPackGroup, PositionArray } from "../../types";
import MapMarkerSheet from "../../components/sheets/map-marker-sheet";
import { SheetManager } from "react-native-actions-sheet";
import MapPointAnnotation from "../../components/map/map-point-annotation";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { MapService } from "../../services/map-service";
import BuilderAreaCreateEditSheet from "../../components/sheets/builder/builder-area-create-edit-sheet";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

const MARKER: MapMarkerType = {
	coordinate: [-1.865014, 53.450585],
	type: 'area'
}

export default function AreaBuilderScreen({ navigation }) {

	const { styleURL, center, cameraRef, enable3DMode, followUserLocation } = useMapState();
	const { clearActivePackGroup, flyTo, setFollowUserLocation } = useMapActions();
	const [markers, setMarkers] = useState<Array<MapMarkerType>>([]);
	const [activeMarker, setActiveMarker] = useState<MapMarkerType>();
	const [areaBounds, setAreaBounds] = useState<PositionArray>();
	const [activePackGroup, setActivePackGroup] = useState<MapPackGroup>();

	const back = () => {
		navigation.goBack();
	}

	const addMarkerFromLongPress = ( e: any ) => {
		if (markers.length >= 2) return;
		const marker: MapMarkerType = {
			coordinate: e.geometry.coordinates,
			type: 'area'
		}
		setMarkers([...markers, marker]);
		setActiveMarker(marker);
	}

	const updateAreaBounds = ( bounds: PositionArray ) => {
		setAreaBounds(bounds)
	}

	const onPointDrag = (e: any, point: MapMarkerType) => {
		// console.log(e, point)
	}

	const createPackGroup = async( packGroup: MapPackGroup ) => {
		setActivePackGroup(packGroup);
		await delay(500);
		SheetManager.show(SHEET.BUILDER_MAP_PACKS)
	}

	const openCreateEditSheet = () => {
		SheetManager.show(SHEET.BUILDER_AREA_CREATE_EDIT);
	}

	const onPointDragEnd = (e: any, point: MapMarkerType) => {
		const pointIndex = markers.indexOf(point);
		const newMarkers = markers.map((marker, index) => {
			if (index === pointIndex) {
				return {
					...marker,
					coordinate: e.geometry.coordinates
				};
			}
			return marker;
		});
		setMarkers(newMarkers);
	}


	useEffect(() => {
		if (markers.length == 2) {
			updateAreaBounds([markers[0].coordinate, markers[1].coordinate])
		}
	}, [markers]);



    return (
        <View style={styles.container}>
            <Mapbox.MapView 
                style={styles.map}
                styleURL={Mapbox.StyleURL.Outdoors}
				onLongPress={addMarkerFromLongPress}
            >
                <Mapbox.Camera
					ref={cameraRef}
                    centerCoordinate={center}
                    zoomLevel={SETTING.MAP_DEFAULT_ZOOM}
					followUserLocation={followUserLocation}
                />
                {markers.map((marker, i) => {
					return (
						<MapPointAnnotation
							key={i}
							id={i.toString()}
							coordinate={marker.coordinate}
							draggable={true}
							onDrag={(e) => onPointDrag(e, marker)}
							// onDragStart={(e) => onPointDrag(e, marker)}
							onDragEnd={(e) => onPointDragEnd(e, marker)}
						/>
					)
				})}
				<UserPosition />
				{(areaBounds && areaBounds.length == 2) && (
					<MapArea
						id="map-create-area"
						bounds={areaBounds}
					/>
				)}
            </Mapbox.MapView>
			<View style={styles.back}>
				<IconButton
					icon={'close'}
					small={true}
					onPress={() => back()}
					active={true}
				/>
			</View>
			<View style={styles.controlsContainer}>
				<View style={styles.controls}>
					<IconButton
						icon={'plus'}
						onPress={() => {}}
					/>
					<IconButton
						icon={'cloud-download'}
						onPress={() => openCreateEditSheet()}
						disabled={!areaBounds || areaBounds.length != 2}
					/>
				</View>
			</View>
			<BuilderAreaCreateEditSheet 
				bounds={areaBounds} 
				onSave={(group: MapPackGroup) => createPackGroup(group)}
			/>
			<MapPackSheet id={SHEET.BUILDER_MAP_PACKS} packGroup={activePackGroup} />
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
	back: {
		position: 'absolute',
		left: normalise(10),
		top: normalise(50),
	}
});