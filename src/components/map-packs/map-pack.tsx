import Mapbox from "@rnmapbox/maps";
import type { MapPack } from "../../types";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { ASSET } from "../../consts";
import { normalise } from "../../functions/helpers";
import IconButton from "../buttons/icon-button";
import { COLOUR, OPACITY } from "../../styles";
import { Format } from "../../services/formatter";
import { EventBus } from "../../services/event-bus";
import { MapPackService } from "../../services/map-pack-service";

export default function MapPack({ pack, size } : { pack: MapPack, size: number }) {

    const [progress, setProgress] = useState<number>(0);
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [errored, setErrored] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    const onDownloadProgress = (offlineRegion: any, status: { percentage: number }) => {
        setProgress(status.percentage);
        setDownloaded(status.percentage == 100 ? true : false);
        if (status.percentage == 100) {
            EventBus.emit.mapPackDownload(pack.name);
            setDownloading(true)
        }
    }

    const onDownloadError = (offlineRegion: any, err: any) => {
        setErrored(true);
        setDownloading(false);
    }

    const downloadPack = () => {
        setErrored(false);
        setDownloading(true);
        setProgress(0);
        MapPackService.download(pack, onDownloadProgress, onDownloadError);
    }

    const checkOfflinePacks = async () => {
        const offlinePacks = await Mapbox.offlineManager.getPacks();
        setDownloaded(offlinePacks.some((p) => p?.name == pack.name));
    }


    useEffect(() => {
        checkOfflinePacks();
    }, [])
    console.log(pack)

    return (
        <View style={styles.container}>
            <ImageBackground
                style={{ flex: 1 }}
                source={
                    pack.styleURL == Mapbox.StyleURL.Outdoors ? ASSET.ICON_OUTDOORS_MAP :
                    pack.styleURL == Mapbox.StyleURL.SatelliteStreet ? ASSET.ICON_SATELLITE_MAP :
                    pack.styleURL == Mapbox.StyleURL.Street ? ASSET.ICON_STREET_MAP : 
                    null
                }
            >
                <View style={[
                    styles.box,
                    downloaded && styles.boxDownloaded,
                    errored && styles.boxErrored
                ]}>
                    {downloaded ?
                    <IconButton
                        icon={'check'}
                        onPress={() => {}}
                        active={downloaded}
                        disabled={true}
                    />
                    :(progress > 0 || downloading) && progress < 100 ?
                    <View style={styles.progress}>
                        <Text style={styles.progressText}>{ Format.percent(progress) }</Text>
                    </View>
                    :
                    <IconButton
                        icon={errored ? 'exclamation' : 'cloud-download'}
                        onPress={() => downloadPack()}
                    />
                    }
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1,
        flex: 1,
        overflow: 'hidden',
        borderRadius: normalise(10)
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxDownloaded: {
        backgroundColor: COLOUR.green[500] + OPACITY[60]
    },
    boxErrored: {
        backgroundColor: COLOUR.red[500] + OPACITY[60]
    },
    progress: {
        height: 50,
        width: 50,
        backgroundColor: COLOUR.white,
        borderRadius: normalise(50),
        justifyContent: 'center',
        alignContent: 'center'
    },
    progressText: {
        textAlign: 'center'
    }
})