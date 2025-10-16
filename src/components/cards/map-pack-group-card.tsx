import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import { MapPackGroup } from "../../types"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { useEffect, useState } from "react";
import { MapPackService } from "../../services/map-pack-service";
import ProgressBar from "../misc/progress-bar";
import { EventBus } from "../../services/event-bus";
import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack";
import { Format } from "../../services/formatter";
import { ASSET } from "../../consts";
import { useGlobalState } from "../../contexts/global-context";

type PropsType = { mapPackGroup: MapPackGroup, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function MapPackGroupCard ({ mapPackGroup, onPress=()=>{}, onOtherPress } : PropsType ) {

    const { user } = useGlobalState();
    const [progress, setProgress] = useState<number>(0);
    const [downloaded, setDownloaded] = useState<boolean>();
    const [errored, setErrored] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const pack = mapPackGroup.packs[0];
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
        console.log('error', err)
        setErrored(true);
        setDownloading(false);
        setProgress(0);
    }

    const download = () => {
        setErrored(false);
        setProgress(0);

        MapPackService.download({ 
            name: pack.name, 
            styleURL: pack.styleURL, 
            minZoom: mapPackGroup.minZoom, 
            maxZoom: mapPackGroup.maxZoom, 
            bounds: mapPackGroup.bounds 
        }, user.id, mapPackGroup, onDownloadProgress, onDownloadError);

        setDownloading(true);
    }


    useEffect(() => {
        checkDownloaded();
    }, [])

    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity 
                style={styles.leftContainer}
                onPress={checkDownloaded}
                activeOpacity={0.8}
            >
                <View style={styles.iconContainer}>
                    <Image
                        source={ASSET.ICON_OUTDOORS_MAP}
                        style={styles.image}
                    />
                    <View style={styles.iconImageOverlay}>
                        <Icon
                            icon="map"
                            colour={COLOUR.wp_green[700]}
                        />
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{mapPackGroup.name}</Text>
                    <Text style={TEXT.xs}>{mapPackGroup.description.slice(0,5)}{mapPackGroup.description.length > 50 ? '...' : ''}</Text>
                    <Text style={[TEXT.xs, TEXT.medium]}>Outdoor Terrain  
                        {downloading ? 
                        <Text> • {Math.ceil(progress)}%</Text>
                        :downloaded && offlinePack?.pack?.completedResourceSize ?
                        <Text> • {Format.byteToMegaByte(offlinePack?.pack?.completedResourceSize)} MB</Text>
                        :
                        null}
                    </Text>
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
                        <TouchableOpacity 
                            style={[
                                styles.downloadButton,
                                downloaded === undefined && { opacity: 0 }
                            ]} 
                            onPress={download}
                        >
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        flexDirection: 'row',
        gap: normalise(20),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: COLOUR.gray[500] + OPACITY[20],
        paddingLeft: normalise(20),
        paddingVertical: normalise(15),
        borderRadius: normalise(15),
        ...SHADOW.sm
    },
    iconContainer: {
        paddingTop: normalise(2),
    },
    leftContainer: {
        flexDirection: 'row',
        gap: normalise(15),
        flex: 1
    },
    textContainer: {
        gap: normalise(3),
        flex: 1
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
        marginTop: normalise(2)
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
    iconImageOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: COLOUR.wp_green[500] + OPACITY[50],
        borderRadius: normalise(15),
        marginTop: normalise(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: normalise(1),
        borderColor: COLOUR.wp_green[500]
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