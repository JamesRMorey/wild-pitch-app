import { StyleSheet, TouchableOpacity, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState } from "react";
import { normalise } from "../../functions/helpers";
import { ASSET, SETTING } from "../../consts";
import { Coordinate, PointOfInterest, Route } from "../../types";
import { COLOUR, TEXT } from "../../styles";
import useHaptic from "../../hooks/useHaptic";
import UserPosition from "../../components/map/user-position";
import CompassButton from "../../components/buttons/compass-button";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";
import { useMapSettings } from "../../hooks/useMapSettings";
import { RouteService } from "../../services/route-service";
import PointOfInterestMarker from "../../components/map/map-marker";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any, route: any }
export default function RouteNavigationScreen({ navigation, route: navRoute }: PropsType) {

	const { route } = navRoute.params;
	const { resetHeading, cameraRef } = useMapCameraControls();
	const { initialRegion, userPosition, updateUserPosition, loaded } = useMapSettings();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const [mapHeading, setMapHeading] = useState<number>(0);
	const [line, setLine] = useState<any>(getLine(route.markers || []));
	const [routeStart, setRouteStart] = useState<Coordinate>();
	const [routeEnd, setRouteEnd] = useState<Coordinate>();

	function getLine(markers: Array<Coordinate>) {
		return {
			type: 'FeatureCollection',
			features: [{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: markers.map(m => [m.longitude, m.latitude])
				}
			}]
		};
	}

	const init = ( route: Route ) => {
		setRouteStart(route.markers[0]);
		setRouteEnd(route.markers[route.markers.length - 1]);
	}

	
	useEffect(() => {
		init(route);
	}, [route]);


    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={Mapbox.StyleURL.Outdoors}
				pitchEnabled={false}
				attributionEnabled={false}
				ref={mapRef}
				onMapIdle={(event) => {
					const heading = event.properties?.heading;
					setMapHeading(heading);
				}}
            >
				<Mapbox.Images images={{arrow: ASSET.ROUTE_LINE_ARROW}} />
				{initialRegion && (
                <Mapbox.Camera
					ref={(ref) => {
						if (ref) cameraRef.current = ref;
					}}
                    centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
                    zoomLevel={SETTING.ROUTE_CLOSE_ZOOM}
					animationDuration={loaded ? 500 : 0}
                />
				)}
				{(routeStart && routeEnd && route) && (
					<>
						<PointOfInterestMarker
							coordinate={[routeStart.longitude, routeStart.latitude]}
							icon={'location'}
							colour={COLOUR.blue[500]}
							disabled={true}
						/>
						<PointOfInterestMarker
							coordinate={[routeEnd.longitude, routeEnd.latitude]}
							icon={'flag'}
							colour={COLOUR.blue[500]}
							disabled={true}
						/>
					</>
				)}
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
					<Mapbox.SymbolLayer
						id="arrowLayer"
						style={{
							symbolPlacement: "line",
							iconImage: "arrow",
							iconSize: 0.4,
							iconAllowOverlap: true,
							iconIgnorePlacement: true,
							symbolSpacing: 50,
						}}
					/>
				</Mapbox.ShapeSource>
				<UserPosition
					onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
				/>
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
            </Mapbox.MapView>
			{/* <View style={styles.bottomBar}>
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
				<TouchableOpacity 
					style={[styles.undo, { opacity: markers.length === 0 ? 0.5 : 1 }]}
					onPress={saveRoute}
					disabled={markers.length === 0}
				>
					<Text style={styles.saveText}>Save</Text>
				</TouchableOpacity>
			</View> */}
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