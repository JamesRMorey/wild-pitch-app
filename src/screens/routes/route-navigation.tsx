import { StyleSheet, Text, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState } from "react";
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
	const [distanceAlongRoute, setDistanceAlongRoute] = useState<{ distance: number, index: number }>();
	const [paused, setPaused] = useState<boolean | undefined>(undefined);

	const centerOnRoute = () => {
		if (route.markers.length < 2) return;
		const bounds = RouteService.getBounds(route.markers);
		fitToBounds(bounds[1], bounds[0]);
	}

	useEffect(() => {
		if (!userPosition || paused !== false) return;
		const point = RouteService.getPreviouslyPassedPointOnRoute(userPosition, route.markers);

		if (point.distancePast > 1000) {
			setDistanceAlongRoute(undefined);
			return;
		}

		const distanceAlong = RouteService.getRouteDistanceToPoint(point.index, route.markers);
		if (!distanceAlong) return;

		setDistanceAlongRoute({ distance: distanceAlong + point.distancePast, index: point.index });
	}, [userPosition])

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
				<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(112) }]}>
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
			<View style={styles.bottomBar}>
				<View style={styles.buttons}>
					<View style={styles.infoItem}>
						<Text style={styles.infoText}>Est Distance Walked</Text>
						<View style={styles.info}>
							<Icon
								icon="walk-outline"
								size={normalise(18)}
							/>
							<Text style={TEXT.md}>{distanceAlongRoute?.distance ? (distanceAlongRoute.distance/1000).toFixed(2) : 0}/{(route.distance/1000).toFixed(2)} km</Text>
						</View>
					</View>
					{paused === undefined ?
					<Button
						title="Start"
						flex={true}
						icon="play"
						onPress={() => setPaused(false)}
					/>
					:paused ?
					<Button
						title="Resume"
						flex={true}
						icon="play-outline"
						onPress={() => setPaused(false)}
					/>
					:
					<Button
						title="Pause"
						flex={true}
						icon="pause-outline"
						style="outline"
						onPress={() => setPaused(true)}
					/>}
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
        paddingVertical: normalise(20),
        paddingHorizontal: normalise(20),
		alignItems: 'center',
		borderRadius: normalise(30),
		gap: normalise(10),
		...SHADOW.xl,
		paddingBottom: normalise(30),
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
		gap: normalise(15)
	},
	infoContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: normalise(5),
	},
	infoItem: {
		flex: 1,
		alignItems: 'center',
	},
	info: {
		flex: 1,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoText: {
		...TEXT.md,
		...TEXT.medium,
		marginBottom: normalise(5),
	}
});