import { normalise } from "../../utils/helpers";
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { Place } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";

type PropsType = { place: Place, onPress?: ()=>void, isLast?: boolean }
export default function PlaceCard ({ place, onPress=()=>{}, isLast=false } : PropsType ) {

    return (
        <TouchableOpacity 
            style={[
                styles.container,
                isLast && { borderBottomWidth: 0 }
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={[
                styles.iconContainer,
                place?.point_type?.colour && { backgroundColor: place.point_type.colour + OPACITY[100] }
            ]}>
                <Icon
                    icon={place?.point_type?.icon ?? 'flag'}
                    size={normalise(18)}
                    colour={COLOUR.white}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={TEXT.h4}>{place.name}</Text>
                <Text style={TEXT.xs}>{place.address.slice(0,80)}{place.address.length > 80 ? '...' : ''}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        flexDirection: 'row',
        gap: normalise(15),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomColor: COLOUR.gray[500] + OPACITY[20],
        borderBottomWidth: normalise(1),
        paddingVertical: normalise(15)
    },
    iconContainer: {
        padding: normalise(8),
        backgroundColor: COLOUR.wp_green[500] + OPACITY[30],
        borderRadius: normalise(50),
    },
    textContainer: {
        gap: normalise(3),
        flex: 1,
    }
})