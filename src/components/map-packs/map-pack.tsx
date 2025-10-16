import Mapbox from "@rnmapbox/maps";
import type { MapPack, MapPackGroup } from "../../types";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { ASSET } from "../../consts";
import { normalise } from "../../functions/helpers";
import IconButton from "../buttons/icon-button";
import { COLOUR, OPACITY } from "../../styles";
import { Format } from "../../services/formatter";
import { EventBus } from "../../services/event-bus";
import { MapPackService } from "../../services/map-pack-service";
import Icon from "../misc/icon";
import useModals from "../../hooks/useModals";
import ConfirmModal from "../../modals/confirm";
import { useGlobalState } from "../../contexts/global-context";


type PropsType = { pack: MapPack, group: MapPackGroup, size: number, onDelete?: Function }
export default function MapPack({ pack, group, size, onDelete } : PropsType) {

    const { user } = useGlobalState();
    const [progress, setProgress] = useState<number>(0);
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [errored, setErrored] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const { modals, close: closeModals, open: openModal } = useModals({ delete: false })

    const onDownloadProgress = (offlineRegion: any, status: { percentage: number }) => {
        setProgress(status.percentage);
        setDownloaded(status.percentage == 100 ? true : false);
        if (status.percentage == 100) {
            EventBus.emit.mapPackDownload(pack.name);
            setDownloading(true)
        }
    }


    const deletePack = async () => {
        await Mapbox.offlineManager.deletePack(pack.name);
        closeModals();
        checkOfflinePacks();
    }

    const onDownloadError = (offlineRegion: any, err: any) => {
        setErrored(true);
        setDownloading(false);
        setProgress(0)
    }

    const downloadPack = () => {
        setErrored(false);
        setDownloading(true);
        setProgress(0);
        MapPackService.download(pack, user.id, group, onDownloadProgress, onDownloadError);
    }

    const checkOfflinePacks = async () => {
        const offlinePacks = await Mapbox.offlineManager.getPacks();
        setDownloaded(offlinePacks.some((p) => p?.name == pack.name));
    }


    useEffect(() => {
        checkOfflinePacks();
    }, [])
    

    return (
        <View style={{ flex: 1, aspectRatio: 1.5 }}>
            {downloaded && onDelete && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => openModal('delete')}
                >
                    <Icon
                        icon="close-outline"
                        colour={COLOUR.white}
                        size={normalise(18)}
                    />
                </TouchableOpacity>
            )}
            <View style={styles.container}>
                <ImageBackground
                    style={{ flex: 1 }}
                    source={
                        pack.styleURL == Mapbox.StyleURL.Outdoors ? ASSET.ICON_OUTDOORS_MAP :
                        pack.styleURL == Mapbox.StyleURL.SatelliteStreet ? ASSET.ICON_SATELLITE_MAP :
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
                            icon={'checkmark-outline'}
                            onPress={() => {}}
                            active={true}
                            blocked={true}
                        />
                        :(progress > 0 || downloading) && progress < 100 && !errored ?
                        <View style={styles.progress}>
                            <Text style={styles.progressText}>{ Format.percent(progress) }</Text>
                        </View>
                        :
                        <IconButton
                            icon={errored ? 'alert-outline' : 'cloud-download-outline'}
                            onPress={() => downloadPack()}
                        />
                        }
                    </View>
                </ImageBackground>
            </View>
            {modals.delete && (
                <ConfirmModal
                    onClose={closeModals}
                    onConfirm={deletePack}
                    text="Are you sure you want to delete this map permanently?"
                    title="Delete Map?"
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1.5,
        flex: 1,
        borderRadius: normalise(10),
        overflow: 'hidden'
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
        height: normalise(50),
        width: normalise(50),
        backgroundColor: COLOUR.white,
        borderRadius: normalise(50),
        justifyContent: 'center',
        alignContent: 'center'
    },
    progressText: {
        textAlign: 'center'
    },
    deleteButton: {
        backgroundColor: COLOUR.red[500],
        position: 'absolute',
        right: normalise(-5),
        top: normalise(-5),
        borderRadius: normalise(30),
        zIndex: 1,
        padding: normalise(3)
    }
})