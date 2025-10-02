import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";
import { MapSetting, MapStyle } from "../types";
import { ASSET, SHEET } from "../consts";
import Mapbox from "@rnmapbox/maps";
import { COLOUR, OPACITY, TEXT } from "../styles";
import { useMapActions, useMapState } from "../contexts/map-context";
import { normalise } from "../functions/helpers";
import Switch from "../components/buttons/switch";


export default function MapStyleSheet ({ id=SHEET.MAP_STYLES } : { id?: string }) {

    const { styleURL, enable3DMode, showPointsOfInterest, showRoutes } = useMapState();
    const { setStyleURL, setEnable3DMode, setShowPointsOfInterest, setShowRoutes } = useMapActions();

    const STYLES: Array<MapStyle> = [
        {
            styleURL: Mapbox.StyleURL.Outdoors,
            image: ASSET.ICON_OUTDOORS_MAP,
            name: 'Terrain'
        },
        {
            styleURL: Mapbox.StyleURL.SatelliteStreet,
            image: ASSET.ICON_SATELLITE_MAP,
            name: 'Satellite'
        },
        {
            styleURL: Mapbox.StyleURL.Street,
            image: ASSET.ICON_STREET_MAP,
            name: 'Street'
        }
    ];

    const updateStyleURL = (url: Mapbox.StyleURL) => {
        setStyleURL(url);
        close();
    }

    const close = () => {
        SheetManager.hide(id);
    }


    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            <View style={styles.container}>
                <View style={styles.packContainer}>
                    {STYLES.map((style, i) => {
                        return (
                            <View 
                                key={i}
                                style={styles.mapStyleContainer}
                            >
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => updateStyleURL(style.styleURL)}
                                    style={[
                                        styles.mapStyle,
                                        styleURL == style.styleURL && styles.active
                                    ]}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={style.image}
                                        style={styles.mapStyleImage}
                                    />
                                </TouchableOpacity>
                                <Text style={TEXT.sm}>{style.name}</Text>
                            </View>
                        )
                    })}
                </View>
                <View style={styles.settingsContainer}>
                    <View 
                        style={styles.settingContainer}
                    >
                        <Text>3D mode</Text>
                        <Switch
                            active={enable3DMode}
                            onPress={() => setEnable3DMode(!enable3DMode)}
                        />
                    </View>
                    <View 
                        style={styles.settingContainer}
                    >
                        <Text>Show map pins</Text>
                        <Switch
                            active={showPointsOfInterest}
                            onPress={() => setShowPointsOfInterest(!showPointsOfInterest)}
                        />
                    </View>
                    <View 
                        style={styles.settingContainer}
                    >
                        <Text>Show routes</Text>
                        <Switch
                            active={showRoutes}
                            onPress={() => setShowRoutes(!showRoutes)}
                        />
                    </View>
                </View>
            </View>
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
    },
    container: {
    },
    packContainer: {
        flexDirection: 'row',
        gap: normalise(15),
        borderRadius: normalise(15),
        padding: normalise(20)
    },
    iconButton: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        overflow: 'hidden',
    },
    mapStyleContainer: {
        flex: 1,
        gap: normalise(5)
    },
    mapStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLOUR.wp_brown[100]
    },
    mapStyleImage: {
        aspectRatio: 1,
        width: '100%',
        height: 'auto'
    },
    active: {
        borderColor: COLOUR.green[500]
    },
    settingsContainer: {
        backgroundColor: COLOUR.wp_brown[100],
        paddingHorizontal: normalise(20),
        paddingTop: normalise(5),
        paddingBottom: normalise(35)
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: normalise(20),
        alignItems: 'center',
        paddingVertical: normalise(15),
        borderBottomWidth: normalise(1),
        borderBottomColor: COLOUR.black + OPACITY[20]
    }
});