import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import { MapPack, Route } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { MapPackService } from "../../services/map-pack-service";
import { SETTING } from "../../consts";
import ProgressBar from "../misc/progress-bar";
import Mapbox from "@rnmapbox/maps";
import { RouteService } from "../../services/route-service";
import { useEffect } from "react";
import { Format } from "../../services/formatter";
import { useMapPackDownload } from "../../hooks/useMapPackDownload";

type PropsType = { route: Route, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function RouteCard ({ route, onPress=()=>{}, onOtherPress=()=>{} } : PropsType ) {

    const pack: MapPack = {
        name: MapPackService.getPackName(route.name, Mapbox.StyleURL.Outdoors),
        styleURL: Mapbox.StyleURL.Outdoors,
        minZoom: SETTING.MAP_PACK_MIN_ZOOM,
        maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
        bounds: RouteService.getBounds(route.markers)
    };
    const { progress, errored, downloading, downloaded, offlinePack, checkDownloaded, download } = useMapPackDownload({ 
        mapPack: pack
    });

    useEffect(() => {
        checkDownloaded();
    }, []);

    return (
        <TouchableOpacity 
            style={styles.container}
            activeOpacity={0.8}
            disabled={!onPress}
            onPress={onPress}
        >
            <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                    <Icon
                        icon='walk'
                        colour={COLOUR.blue[700]}
                    />
                </View>
                <View style={styles.rightContainer}>
                    <View style={styles.textContainer}>
                        <Text style={TEXT.h4}>{route.name.replaceAll('\n', '')}</Text>
                        {route.notes && (
                            <Text style={TEXT.xs}>{route.notes.replaceAll('\n', '').slice(0,80)}{route.notes.length > 80 ? '...' : ''}</Text>
                        )}
                    </View>
                    <View style={styles.infoContainer}>
                        {route.distance && (
                            <View style={styles.itemContainer}>
                                <Icon
                                    icon='walk'
                                    size={'small'}
                                    colour={COLOUR.gray[700]}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.distance / 1000).toFixed(2)} km`}</Text>
                            </View>
                        )}
                        {route.elevation_gain !== undefined && (
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-up'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${route.elevation_gain.toFixed(2)} m`}</Text>
                        </View>
                        )}
                        {route.elevation_loss !== undefined && (
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-down'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${route.elevation_loss.toFixed(2)} m`}</Text>
                        </View>
                        )}
                        <Text style={[TEXT.xs, TEXT.medium]}>
                            {downloading && progress !== undefined ? 
                            <Text>{Math.ceil(progress)}%</Text>
                            :downloaded && offlinePack?.pack?.completedResourceSize ?
                            <Text>{Format.byteToMegaByte(offlinePack?.pack?.completedResourceSize)} MB</Text>
                            :
                            null}
                        </Text>
                    </View>
                    <View style={styles.downloadContainer}>
                        {errored ?
                        <TouchableOpacity style={styles.downloadButton} onPress={download}>
                            <Icon
                                icon='cloud-download-outline'
                                size={normalise(12)}
                                colour={COLOUR.red[500]}
                            />
                            <Text style={styles.errorText}>Error</Text>
                        </TouchableOpacity>
                        :downloading && progress !== undefined ?
                        <ProgressBar
                            step={Math.ceil(progress)}
                            steps={100}
                            height={normalise(5)}
                            colour={COLOUR.green[500]}
                        />
                        :downloaded ?
                        <View style={styles.downloadedContainer}>
                            <Icon
                                icon='checkmark-circle-outline'
                                size={normalise(12)}
                                colour={COLOUR.green[500]}
                            />
                            <Text style={styles.downloadedText}>Downloaded</Text>
                        </View>
                        :
                        <TouchableOpacity style={styles.downloadButton} onPress={() => download(false)}>
                            <Icon
                                icon='cloud-download-outline'
                                size={normalise(12)}
                                colour={COLOUR.wp_orange[500]}
                            />
                            <Text style={styles.downloadButtonText}>Download</Text>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
            {onOtherPress && (
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={onOtherPress}
                style={styles.ellipseButton}
            >
                <Icon
                    icon='ellipsis-horizontal-outline'
                    size={'small'}
                />
            </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLOUR.white,
        paddingVertical: normalise(15),
        borderRadius: normalise(15),
        ...SHADOW.sm,
        flex: 1
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: normalise(15),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: normalise(20),
    },
    textContainer: {
        gap: normalise(3),
        flex: 1
    },
    iconContainer: {
        backgroundColor: COLOUR.blue[500] + OPACITY[30],
        padding: normalise(8),
        borderRadius: normalise(50),
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        borderWidth: normalise(1),
        borderColor: COLOUR.blue[500]
    },
    rightContainer: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'center',
        marginTop: normalise(5),
    },
    itemContainer: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center'
    },
    downloadedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalise(5)
    },
    downloadedText: {
        ...TEXT.xs,
        color: COLOUR.green[500],
        ...TEXT.medium
    },
    downloadContainer: {
        marginTop: normalise(5),
        height: normalise(12)
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalise(5),
    },
    downloadButtonText: {
        ...TEXT.xs,
        ...TEXT.medium,
        color: COLOUR.wp_orange[500],
    },
    image: {
        aspectRatio: 1,
        width: normalise(70),
        height: 'auto',
        borderRadius: normalise(15),
    },
    ellipseButton: { 
        height: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingLeft: normalise(10),
        paddingRight: normalise(20)
    },
    errorText: {
        ...TEXT.xs,
        color: COLOUR.red[500],
        ...TEXT.medium
    }
})