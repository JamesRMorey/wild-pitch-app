import { StyleSheet, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useRef, useState } from "react";
import { normalise } from "../../functions/helpers";
import { ASSET, SETTING } from "../../consts";
import { COLOUR, TEXT } from "../../styles";
import UserPosition from "../../components/map/user-position";
import CompassButton from "../../components/buttons/compass-button";
import { useMapCameraControls } from "../../hooks/useMapCameraControls";
import { useMapSettings } from "../../hooks/useMapSettings";
import RouteLine from "../../components/routes/route-line";
import IconButton from "../../components/buttons/icon-button";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any, route: any }
export default function RouteNavigationScreen({ navigation, route: navRoute }: PropsType) {

	const { route } = navRoute.params;
	const { resetHeading, cameraRef, heading, setHeading } = useMapCameraControls();
	const { userPosition, updateUserPosition, loaded } = useMapSettings();
	const mapRef = useRef<Mapbox.MapView>(null);


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
					setHeading(heading);
				}}
            >
				<Mapbox.Images images={{arrow: ASSET.ROUTE_LINE_ARROW}} />
                <Mapbox.Camera
					ref={(ref) => {
						if (ref) cameraRef.current = ref;
					}}
                    centerCoordinate={[route.longitude, route.latitude]}
                    zoomLevel={SETTING.ROUTE_CLOSE_ZOOM}
					animationDuration={loaded ? 500 : 0}
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
				<View style={[styles.controlsContainer, { right: normalise(10), bottom: normalise(10) }]}>
					{heading > 0 && (
						<CompassButton
							onPress={resetHeading}
							disabled={!userPosition}
							shadow={true}
							heading={heading}
						/>
					)}
				</View>
				<View style={[styles.controlsContainer, { left: normalise(10), top: SETTING.TOP_PADDING }]}>
					<IconButton
						icon="chevron-back"
						onPress={() => navigation.goBack()}
						shadow={true}
						style={{ paddingRight: normalise(2) }}
					/>
				</View>
            </Mapbox.MapView>
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