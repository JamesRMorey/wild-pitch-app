import { StyleSheet, Text, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useRef, useState } from "react";
import { normalise } from "../../functions/helpers";
import { ASSET, SETTING, SHEET } from "../../consts";
import { COLOUR, SHADOW, TEXT } from "../../styles";
import UserPosition from "../../components/map/user-position";
import CompassButton from "../../components/buttons/compass-button";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";
import { useMapSettings } from "../../hooks/useMapSettings";
import RouteLine from "../../components/routes/route-line";
import IconButton from "../../components/buttons/icon-button";
import MultiButtonControl from "../../components/map/multi-button-control";
import MapStyleSheet from "../../sheets/map-style-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { RouteService } from "../../services/route-service";
import Icon from "../../components/misc/icon";
import Button from "../../components/buttons/button";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any, route: any }
export default function RouteNavigationScreen({ navigation, route: navRoute }: PropsType) {

	const { route } = navRoute.params;
	const { resetHeading, cameraRef, heading, setHeading, followUserPosition, setFollowUserPosition, fitToBounds, reCenter } = useMapCameraControls();
	const { userPosition, updateUserPosition, loaded } = useMapSettings();
	const mapRef = useRef<Mapbox.MapView>(null);

	const centerOnRoute = () => {
		if (route.markers.length < 2) return;
		const bounds = RouteService.getBounds(route.markers);
		fitToBounds(bounds[1], bounds[0]);
	}

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
				<Mapbox.MapView
					style={styles.map}
					styleURL={Mapbox.StyleURL.Outdoors}
					pitchEnabled={false}
					attributionEnabled={false}
					ref={mapRef}
					onMapIdle={(event) => {
						const heading = event.properties?.heading;
						setHeading(heading);
					}}
					onTouchStart={() => {
						if (followUserPosition) setFollowUserPosition(false);
					}}
				>
					<Mapbox.Images images={{arrow: ASSET.ROUTE_LINE_ARROW, flag: ASSET.ROUTE_FLAG}} />
					<Mapbox.Camera
						ref={(ref) => {
							if (ref) cameraRef.current = ref;
						}}
						centerCoordinate={[route.longitude, route.latitude]}
						zoomLevel={SETTING.ROUTE_CLOSE_ZOOM}
						animationDuration={loaded ? 500 : 0}
						followUserLocation={followUserPosition}
					/>
					{route && (
						<RouteLine
							key={`line-${route.id}`}
							start={{ latitude: route.latitude, longitude: route.longitude }}
							end={route.markers[route.markers.length - 1]}
							markers={route.markers}
							lineKey={1}
						/>
					)}
					<UserPosition
						onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
					/>
				</Mapbox.MapView>
				<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(90) }]}>
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
							{ icon: 'expand-outline', onPress: () => centerOnRoute() },
							{ icon: 'location-outline', onPress: () => reCenter([userPosition?.longitude, userPosition?.latitude]) },
							{ icon: followUserPosition ? 'navigate' : 'navigate-outline', onPress: () => setFollowUserPosition(!followUserPosition) },
						]}
					/>
				</View>
				<View style={[styles.controlsContainer, { left: normalise(10), top: SETTING.TOP_PADDING }]}>
					<IconButton
						icon="chevron-down"
						onPress={() => navigation.goBack()}
						shadow={true}
						style={{ paddingRight: normalise(2) }}
					/>
				</View>
			</View>
			{/* <View style={[styles.controlsContainer, { right: normalise(65), bottom: normalise(30) }]}>
				<View style={styles.bottomBar}>
					<Icon
						icon="walk-outline"
						size={normalise(15)}
					/>
					<Text style={TEXT.sm}>{(route.distance/1000).toFixed(2)} km</Text>
				</View>
			</View> */}
			<View style={styles.bottomBar}>
				<View style={styles.buttons}>
					<Button
						title="Cancel"
						flex={true}
						style="secondary"
						onPress={() => navigation.goBack()}
					/>
					<Button
						title="Complete"
						flex={true}
					/>
				</View>
			</View>
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
    bottomBar: {
        width: '100%',
        backgroundColor: COLOUR.white,
        paddingVertical: normalise(10),
        paddingHorizontal: normalise(10),
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: normalise(30),
		gap: normalise(5),
		...SHADOW.xl,
		paddingBottom: normalise(20),
		position: 'absolute',
		bottom: 0,
		left: 0,
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
   	},
	buttons: {
		flexDirection: 'row',
		gap: normalise(10)
	}
});