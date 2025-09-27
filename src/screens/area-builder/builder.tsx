import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from "react";
import UserPosition from "../../components/map/user-position";
import IconButton from "../../components/buttons/icon-button";
import { normalise } from "../../functions/helpers";
import MapArea from "../../components/map/map-area";
import { SETTING } from "../../consts";
import { MapMarker as MapMarkerType, PositionArray } from "../../types";
import MapPointAnnotation from "../../components/map/map-point-annotation";
import useHaptic from "../../hooks/useHaptic";
import { useMapSettings } from "../../hooks/useMapSettings";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any, route: any }
export default function AreaBuilderScreen({ navigation, route } : PropsType) {

	const resetTo = route.params?.resetTo ?? "saved";
	const initialCenter = route.params?.initialCenter;
	console.log(initialCenter)

	const { cameraRef } = useMapCameraControls();
	const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const [markers, setMarkers] = useState<Array<MapMarkerType>>([]);
	const [areaBounds, setAreaBounds] = useState<PositionArray>();
	const { tick } = useHaptic();

	const goBack = () => {
		navigation.goBack();
	}

	const addMarkerFromLongPress = ( e: any ) => {
		if (markers.length >= 2) return;
		const marker: MapMarkerType = {
			coordinate: e.geometry.coordinates,
			type: 'area'
		}
		
		tick();
		setMarkers([...markers, marker]);
	}

	const updateAreaBounds = ( bounds: PositionArray ) => {
		setAreaBounds(bounds)
	}

	const onPointDrag = (e: any, point: MapMarkerType) => {
		// console.log(e, point)
	}

	const onPointDragStart = (e: any, point: MapMarkerType) => {
		tick();
	}

	const saveArea = () => {
		navigation.navigate('area-builder-save-area', { bounds: areaBounds, resetTo: resetTo })
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
		else {
			updateAreaBounds(undefined);
		}
	}, [markers]);



    return (
        <View style={styles.container}>
            <Mapbox.MapView 
                style={styles.map}
                styleURL={Mapbox.StyleURL.Outdoors}
				onLongPress={addMarkerFromLongPress}
				attributionEnabled={false}
            >
                {initialCenter || initialRegion && (
					<Mapbox.Camera
						ref={(ref) => {
							if (ref) cameraRef.current = ref;
						}}
						centerCoordinate={initialCenter ? initialCenter : [initialRegion.longitude, initialRegion.latitude]}
						zoomLevel={SETTING.MAP_CLOSEST_ZOOM}
						animationDuration={loaded ? 500 : 0}
					/>
				)}
                {markers.map((marker, i) => {
					return (
						<MapPointAnnotation
							key={i}
							id={i.toString()}
							coordinate={marker.coordinate}
							draggable={true}
							onDrag={(e) => onPointDrag(e, marker)}
							onDragEnd={(e) => onPointDragEnd(e, marker)}
							onDragStart={(e) => onPointDragStart(e, marker)}
						/>
					)
				})}
				<UserPosition
					onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
				/>
				{(areaBounds && areaBounds.length == 2) && (
					<MapArea
						id="map-create-area"
						bounds={areaBounds}
					/>
				)}
            </Mapbox.MapView>
			<View style={[styles.controlsContainer, {left: normalise(10), right: 'auto'}]}>
				<IconButton
					icon={'chevron-down'}
					onPress={goBack}
					shadow={true}
				/>
			</View>
			<View style={styles.controlsContainer}>
				<View style={styles.controls}>
					<IconButton
						icon={'cloud-download-outline'}
						onPress={() => saveArea()}
						disabled={!areaBounds || areaBounds.length != 2}
						shadow={true}
					/>
				</View>
			</View>
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