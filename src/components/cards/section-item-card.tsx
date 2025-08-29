import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { MapPackGroup, PointOfInterest } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";

type PropsType = { title: string, icon: string, onPress?: ()=>void, onOtherPress?: ()=>void }
export default function SectionItemCard ({ title, icon, onPress=()=>{} } : PropsType ) {

    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity 
                style={styles.leftContainer}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Icon
                    icon={icon}
                    colour={COLOUR.black}
                    size={normalise(30)}
                />
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{title}</Text>
                </View>
            </TouchableOpacity>
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
        backgroundColor: COLOUR.wp_green[500]
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