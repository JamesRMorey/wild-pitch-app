import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { MapPackGroup, PointOfInterest } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";

type PropsType = { mapPackGroup: MapPackGroup, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function MapPackGroupCard ({ mapPackGroup, onPress=()=>{}, onOtherPress } : PropsType ) {

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
                        colour={COLOUR.white}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{mapPackGroup.name}</Text>
                    <Text style={TEXT.sm}>{mapPackGroup.description.slice(0,80)}...</Text>
                    {/* <Text style={TEXT.sm}>{mapPackGroup.packs.length}/2 Downloaded</Text> */}
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
        paddingVertical: normalise(15),
        flexDirection: 'row',
        gap: normalise(20),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: COLOUR.gray[500] + OPACITY[20],
        borderBottomWidth: normalise(1)
    },
    iconContainer: {
        padding: normalise(15),
        aspectRatio: 1,
        borderRadius: normalise(12),
        backgroundColor: COLOUR.wp_orange[500]
    },
    leftContainer: {
        flexDirection: 'row',
        gap: normalise(15),
        alignItems: 'center',
        flex: 1
    },
    textContainer: {
        gap: normalise(3),
        flex: 1
    }
})