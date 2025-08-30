import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from "react";
import UserPosition from "../../../components/map/user-position";
import IconButton from "../../../components/buttons/icon-button";
import { normalise } from "../../../functions/helpers";
import { useMapState } from "../../../contexts/map-context";
import MapArea from "../../../components/map/map-area";
import { SETTING } from "../../../consts";
import { MapMarker as MapMarkerType, PositionArray } from "../../../types";
import MapPointAnnotation from "../../../components/map/map-point-annotation";
import useHaptic from "../../../hooks/useHaptic";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any }
export default function AreaBuilderScreen({ navigation } : PropsType) {

	const { center, cameraRef, followUserLocation } = useMapState();
	const [markers, setMarkers] = useState<Array<MapMarkerType>>([]);
	const [areaBounds, setAreaBounds] = useState<PositionArray>();
	const { tick } = useHaptic();

	const back = () => {
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

	const saveArea = () => {
		navigation.navigate('area-builder-save-area', { bounds: areaBounds })
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
                <Mapbox.Camera
					ref={cameraRef}
                    centerCoordinate={center}
                    zoomLevel={SETTING.MAP_DEFAULT_ZOOM}
					followUserLocation={followUserLocation}
					animationDuration={0}
					animationMode="none"
                />
                {markers.map((marker, i) => {
					return (
						<MapPointAnnotation
							key={i}
							id={i.toString()}
							coordinate={marker.coordinate}
							draggable={true}
							onDrag={(e) => onPointDrag(e, marker)}
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