import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import { MapPack, Route } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { MapPackService } from "../../services/map-pack-service";
import { SETTING } from "../../consts";
import ProgressBar from "../misc/progress-bar";
import { EventBus } from "../../services/event-bus";
import Mapbox from "@rnmapbox/maps";
import { RouteService } from "../../services/route-service";
import { useEffect, useState } from "react";
import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack";
import { Format } from "../../services/formatter";

type PropsType = { route: Route, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function RouteCard ({ route, onPress=()=>{}, onOtherPress } : PropsType ) {

    const [progress, setProgress] = useState<number>(0);
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [errored, setErrored] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const pack: MapPack = {
        name: MapPackService.getPackName(route.name, Mapbox.StyleURL.Outdoors),
        styleURL: Mapbox.StyleURL.Outdoors,
        minZoom: SETTING.MAP_PACK_MIN_ZOOM,
        maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
        bounds: RouteService.getBounds(route.markers)
    };
    const [offlinePack, setOfflinePack] = useState<OfflinePack>();

    const checkDownloaded = async () => {
        fetchPack();
    }

    const fetchPack = async () => {
        const p = await MapPackService.getPack(pack.name);
        
        if (!p) {
            setProgress(0);
            setDownloaded(false);
            setOfflinePack(undefined);
            return;
        }

        setOfflinePack(p);
        setDownloaded(p.pack.state == "complete");
        setProgress(p.pack.percentage);
    }

    const onDownloadProgress = (offlineRegion: any, status: { percentage: number }) => {
        setProgress(status.percentage);
        setDownloaded(status.percentage == 100 ? true : false);

        if (status.percentage == 100) {
            EventBus.emit.mapPackDownload(pack.name);
            setDownloading(false);
            setDownloaded(true);
            checkDownloaded();
        }
    }

    const onDownloadError = (offlineRegion: any, err: any) => {
        setErrored(true);
        setDownloading(false);
        setProgress(0);
    }

    const download = () => {
        setErrored(false);
        setProgress(0);

        MapPackService.downloadRoute({
            name: pack.name, 
            styleURL: pack.styleURL, 
            minZoom: SETTING.MAP_PACK_MIN_ZOOM, 
            maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
            bounds: pack.bounds 
        }, onDownloadProgress, onDownloadError);

        setDownloading(true);
    } 

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
            <View style={styles.iconContainer}>
                <Icon
                    icon='walk'
                    colour={COLOUR.blue[700]}
                />
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{route.name}</Text>
                    {route.notes && (
                        <Text style={TEXT.xs}>{route.notes.slice(0,80)}{route.notes.length > 80 ? '...' : ''}</Text>
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
                        <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${route.elevation_gain} m`}</Text>
                    </View>
                    )}
                    {route.elevation_loss !== undefined && (
                    <View style={styles.itemContainer}>
                        <Icon
                            icon='arrow-down'
                            size={'small'}
                            colour={COLOUR.gray[700]}
                        />
                        <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${route.elevation_loss} m`}</Text>
                    </View>
                    )}
                    <Text style={[TEXT.xs, TEXT.medium]}>
                        {downloading ? 
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
                    :downloading ?
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
                    <TouchableOpacity style={styles.downloadButton} onPress={download}>
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
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        flexDirection: 'row',
        gap: normalise(20),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomColor: COLOUR.gray[500] + OPACITY[20],
        paddingHorizontal: normalise(20),
        paddingVertical: normalise(15),
        borderRadius: normalise(15),
        ...SHADOW.sm
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