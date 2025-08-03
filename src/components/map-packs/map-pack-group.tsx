import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MapPackGroup as MapPackGroupType } from "../../types";
import { normalise } from "../../functions/helpers";
import { COLOUR, TEXT } from "../../styles";
import IconBadge from "../misc/icon-badge";


export default function MapPackGroup({ group, onPress } : { group: MapPackGroupType, onPress: Function }) {
    
    return (
        <TouchableOpacity 
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => onPress()}
        >
            <View>
                <IconBadge
                    icon="flag"
                    size="small"
                />
            </View>
            <View style={styles.infoContainer}> 
                <Text style={TEXT.h3}>{ group.name }</Text>
                <Text style={TEXT.p}>{ group.description.slice(0,45) }...</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: normalise(20),
        borderBottomWidth: normalise(1),
        borderBottomColor: COLOUR.gray[300],
        justifyContent: 'space-between',
        gap: normalise(10)
    },
    infoContainer: {
        flex: 1
    }
})