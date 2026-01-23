import { normalise } from "../../utils/helpers";
import { COLOUR, OPACITY, ROUNDED, TEXT } from "../../styles";
import { RouteSearchResult } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";

type PropsType = { route: RouteSearchResult, onPress?: ()=>void, belongsToUser: boolean }
export default function RouteSearchCard ({ route, onPress=()=>{}, belongsToUser } : PropsType ) {


    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View>
                <View style={styles.iconContainer}>
                    <Icon
                        icon='route'
                        colour={COLOUR.blue[700]}
                    />
                </View>
            </View>
            <View style={styles.rightContainer}>
                <View><Text style={TEXT.h4}>{route.name.replaceAll('\n', '')}</Text></View>
                <View style={styles.infoContainer}>
                    {route.distance && (
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='route'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.distance / 1000).toFixed(2)} km`}</Text>
                        </View>
                    )}
                    {route.elevation_gain && (
                    <View style={styles.itemContainer}>
                        <Icon
                            icon='arrow-up'
                            size={'small'}
                            colour={COLOUR.gray[700]}
                        />
                        <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${route.elevation_gain.toFixed(2)} m`}</Text>
                    </View>
                    )}
                    {route.elevation_loss && (
                    <View style={styles.itemContainer}>
                        <Icon
                            icon='arrow-down'
                            size={'small'}
                            colour={COLOUR.gray[700]}
                        />
                        <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${route.elevation_loss.toFixed(2)} m`}</Text>
                    </View>
                    )}
                </View>
            </View>
            {belongsToUser && 
                <View style={styles.belongsToUser}>
                    <Icon
                        icon="user-check"
                        colour={COLOUR.green[500]}
                    />
                </View>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderBottomColor: COLOUR.gray[500] + OPACITY[20],
        paddingVertical: normalise(15),
        borderBottomWidth: normalise(1),
    },
    iconContainer: {
        backgroundColor: COLOUR.blue[500] + OPACITY[30],
        padding: normalise(8),
        borderRadius: normalise(50),
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1
    },
    rightContainer: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'center',
        marginTop: normalise(5),
    },
    itemContainer: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center'
    },
    belongsToUser: {
        marginTop: normalise(5),
        ...ROUNDED.full,
    }
})