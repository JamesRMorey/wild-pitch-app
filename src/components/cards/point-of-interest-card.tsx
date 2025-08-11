import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { PointOfInterest } from "../../types"
import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { Format } from "../../services/formatter";

type PropsType = { point: PointOfInterest, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function PointOfInterestCard ({ point, onPress=()=>{}, onOtherPress } : PropsType ) {

    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity 
                style={styles.leftContainer}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View 
                    style={[styles.iconContainer, { backgroundColor: point.point_type?.colour }]}>
                    <Icon
                        icon={point.point_type?.icon}
                        colour={COLOUR.white}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{point.name}</Text>
                    <Text style={TEXT.sm}>{point.notes}</Text>
                    <Text style={TEXT.sm}>{new Date(point.created_at).toDateString()}</Text>
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
        borderRadius: normalise(12)
    },
    leftContainer: {
        flexDirection: 'row',
        gap: normalise(15),
        alignItems: 'center'
    },
    textContainer: {
        gap: normalise(3)
    }
})