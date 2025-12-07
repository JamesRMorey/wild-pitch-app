import { normalise } from "../../utils/helpers";
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import { PointOfInterest } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";

type PropsType = { point: PointOfInterest, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function PointOfInterestCard ({ point, onPress, onOtherPress } : PropsType ) {

    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity 
                style={styles.leftContainer}
                onPress={onPress}
                disabled={!onPress}
                activeOpacity={0.8}
            >
                <View style={[styles.iconContainer, { backgroundColor: point.point_type?.colour }]}>
                    <Icon
                        icon={point.point_type?.icon}
                        colour={COLOUR.white}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{point.name}</Text>
                    {point.notes && (
                        <Text style={TEXT.sm}>{point.notes}</Text>
                    )}
                    <Text style={TEXT.xs}>{new Date(point.created_at).toDateString()}</Text>
                </View>
            </TouchableOpacity>
            {onOtherPress && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onOtherPress}
                    style={styles.ellipseButton}
                >
                    <Icon
                        icon='ellipsis'
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
        paddingLeft: normalise(20),
        paddingVertical: normalise(15),
        borderRadius: normalise(15),
        ...SHADOW.sm
    },
    iconContainer: {
        padding: normalise(10),
        paddingTop: normalise(9),
        aspectRatio: 1,
        borderRadius: normalise(50)
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: normalise(15),
        alignItems: 'center'
    },
    textContainer: {
        gap: normalise(3)
    },
    ellipseButton: { 
        height: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingLeft: normalise(10),
        paddingRight: normalise(20)
    }
})