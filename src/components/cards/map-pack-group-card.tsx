import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { MapPackGroup } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { useEffect, useState } from "react";
import { MapPackService } from "../../services/map-pack-service";

type PropsType = { mapPackGroup: MapPackGroup, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function MapPackGroupCard ({ mapPackGroup, onPress=()=>{}, onOtherPress } : PropsType ) {

    const [numDownloaded, setNumDownloaded] = useState<number>();

    const checkDownloaded = async () => {
        const offlinePacks = await MapPackService.getOfflinePacks();
        const downloaded = offlinePacks.filter((op) => mapPackGroup.packs.find(p => p.name == op.name));
        setNumDownloaded(downloaded.length);
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
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={styles.iconContainer}>
                    <Icon
                        icon={'map-outline'}
                        colour={COLOUR.wp_green[500]}
                        size={normalise(20)}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{mapPackGroup.name}</Text>
                    <Text style={TEXT.sm}>{mapPackGroup.description.slice(0,80)}...</Text>
                    {numDownloaded != undefined && numDownloaded >= 0 && (
                        <Text style={styles.downloadedText}>{numDownloaded}/2 Downloaded</Text>
                    )}
                </View>
            </TouchableOpacity>
            {onOtherPress && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onOtherPress}
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
        paddingHorizontal: normalise(20),
        paddingVertical: normalise(15)
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
    downloadedText: {
        ...TEXT.xs,
        marginTop: normalise(5)
    }
})