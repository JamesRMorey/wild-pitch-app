import { StyleSheet, TouchableOpacity, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState } from "react";
import { normalise } from "../../../functions/helpers";
import { SETTING } from "../../../consts";
import { Coordinate, PointOfInterest } from "../../../types";
import { COLOUR, TEXT } from "../../../styles";
import useHaptic from "../../../hooks/useHaptic";
import UserPosition from "../../../components/map/user-position";
import CompassButton from "../../../components/buttons/compass-button";
import RouteMarker from "../../../components/routes/route-marker";
import { Text } from "react-native-animatable";
import Icon from "../../../components/misc/icon";
import { useMapCameraControls } from "../../../hooks/useMapCameraControls";
import { useMapSettings } from "../../../hooks/useMapSettings";
import IconButton from "../../../components/buttons/icon-button";
import PointOfInterestMarker from "../../../components/map/map-marker";
import { RouteService } from "../../../services/route-service";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any, route: any }
export default function RouteBuilderScreen({ navigation, route } : PropsType) {

	const initialPoint: Coordinate | undefined = route.params?.initialPoint;
	const initialCenter: Coordinate | undefined = route.params?.initialCenter;
	const activePOI: PointOfInterest | undefined = route.params?.activePOI;
	
	const { resetHeading, cameraRef } = useMapCameraControls();
	const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const [mapHeading, setMapHeading] = useState<number>(0);
	const [markers, setMarkers] = useState<Array<Coordinate>>(initialPoint ? [initialPoint] : []);
	const [line, setLine] = useState<any>({
		type: 'FeatureCollection',
		features: [{
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: markers.map(marker => [marker.longitude, marker.latitude])
			}
		}]
	});
	const [distance, setDistance] = useState<number>(0);

	const addMarker = async ( e: any ) => {
		const marker = {
			latitude: e.geometry.coordinates[1],
			longitude: e.geometry.coordinates[0]
		};
		setMarkers([...markers, marker]);
		updateLine([...markers, marker]);
	}

	const onMarkerDragEnd = ( e: any, index: number ) => {
		const marker = { latitude: e.geometry.coordinates[1], longitude: e.geometry.coordinates[0] };
		const updatedMarkers = markers.map((m, i) => i === index ? marker : m);

		setMarkers(updatedMarkers);
		updateLine(updatedMarkers);
	}

	const updateLine = ( markers: Array<Coordinate> ) => {
		setLine({
			type: 'FeatureCollection',
			features: [{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: markers.map(m => [m.longitude, m.latitude])
				}
			}]
		});
	}

	const saveRoute = () => {
		if (markers.length === 0) return;
		navigation.navigate('route-save', {
			route: {
				name: null, 
				notes: null, 
				markers: markers,
				latitude: markers[0].latitude,
				longitude: markers[0].longitude,
				distance: null,
				elevation_gain: null,
				elevation_loss: null
			}
		});
	}

	const undo = () => {
		tick();
		const updatedMarkers = markers.slice(0, -1);
		setMarkers(updatedMarkers);
		updateLine(updatedMarkers);
	}


	useEffect(() => {
		if (markers.length < 2) return;
		const dist = RouteService.calculateDistance(markers);
		setDistance(dist);
	}, [markers])


    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
				<Mapbox.MapView
					style={styles.map}
					styleURL={Mapbox.StyleURL.Outdoors}
					pitchEnabled={false}
					attributionEnabled={false}
					ref={mapRef}
					onPress={(e) => addMarker(e)}
					onMapIdle={(event) => {
						const heading = event.properties?.heading;
						setMapHeading(heading);
					}}
				>
					{(initialPoint || initialCenter || initialRegion) && (
					<Mapbox.Camera
						ref={(ref) => {
							if (ref) cameraRef.current = ref;
						}}
						centerCoordinate={
						initialPoint ?
							[initialPoint.longitude, initialPoint.latitude]
						:initialCenter ?
							[initialCenter.longitude, initialCenter.latitude]
						:initialRegion &&
							[initialRegion.longitude, initialRegion.latitude]
						}
						zoomLevel={SETTING.ROUTE_CLOSE_ZOOM}
						animationDuration={loaded ? 500 : 0}
					/>
					)}
					{markers.map((marker, index) => {
						return (
							<RouteMarker
								key={`route-marker-${marker.latitude}-${marker.longitude}-${index}`}
								coordinate={[marker.longitude, marker.latitude]}
								colour={SETTING.ROUTE_LINE_COLOUR}
								onPress={() => {}}
								onDragEnd={(e: any) => onMarkerDragEnd(e, index)}
							/>
						)
					})}
					<Mapbox.ShapeSource id="lineSource" shape={line}>
						<Mapbox.LineLayer
							id="lineLayer"
							style={{
								lineColor: SETTING.ROUTE_LINE_COLOUR,
								lineWidth: 4,
								lineOpacity: 0.7,
								lineCap: 'round',
								lineJoin: 'round'
							}}
						/>
					</Mapbox.ShapeSource>
					<UserPosition
						onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
					/>
					{activePOI && (
						<PointOfInterestMarker
							coordinate={[activePOI.longitude, activePOI.latitude]}
							icon={activePOI.point_type?.icon ?? 'flag'}
							colour={activePOI?.point_type?.colour ?? COLOUR.red[500]}
						/>
					)}
				</Mapbox.MapView>
				<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(10) }]}>
					{mapHeading > 0 && (
						<CompassButton
							onPress={resetHeading}
							disabled={!userPosition}
							shadow={true}
							heading={mapHeading}
						/>
					)}
				</View>
				<View style={[styles.controlsContainer, { left: normalise(10), top: SETTING.TOP_PADDING }]}>
					<IconButton
						icon={'chevron-back-outline'}
						onPress={() => navigation.goBack()}
						shadow={true}
						style={{paddingRight: normalise(2)}}
					/>
				</View>
			</View>
			<View style={styles.bottomBar}>
				<TouchableOpacity 
					style={[styles.undo, { opacity: markers.length === 0 ? 0.5 : 1 }]}
					onPress={undo}
					disabled={markers.length === 0}
				>
					<Icon
						icon={'return-up-back-outline'}
					/>
					<Text style={[TEXT.sm]}>Undo</Text>
				</TouchableOpacity>
				{distance > 0 && (
					<View>
						<Text>{distance > 1000 ? `${(distance/1000).toFixed(2)} km` : `${distance.toFixed(0)} meters`}</Text>
					</View>
				)}
				<TouchableOpacity 
					style={[styles.undo, { opacity: markers.length === 0 ? 0.5 : 1 }]}
					onPress={saveRoute}
					disabled={markers.length === 0}
				>
					<Text style={styles.saveText}>Save</Text>
				</TouchableOpacity>
			</View>
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
        paddingVertical: normalise(20),
        paddingHorizontal: normalise(20),
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	undo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: normalise(10),
   	},
   	saveText: {
		...TEXT.md,
		...TEXT.semiBold,
		color: COLOUR.wp_orange[500],
   	}
});