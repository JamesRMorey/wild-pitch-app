import { normalise } from "../../utils/helpers";
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { Route } from "../../models/route";
import { Format } from "../../services/formatter";

type PropsType = { route: Route, onPress?: ()=>void, onClose?: ()=>void, belongsToUser: boolean }
export default function ActiveRouteInformation ({ route, onPress=()=>{}, onClose, belongsToUser } : PropsType ) {

    
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
                <View style={styles.textContainer}>
                    <Text style={TEXT.h4}>{route.name.replaceAll('\n', '')}</Text>
                    {route.notes && (
                        <Text style={TEXT.xs}>{route.notes.replaceAll('\n', '').slice(0,80)}{route.notes.length > 80 ? '...' : ''}</Text>
                    )}
                    <View style={styles.infoContainer}>
                        {route.distance &&
                            <View style={styles.itemContainer}>
                                <Icon
                                    icon='footprints'
                                    size={'small'}
                                    colour={COLOUR.gray[700]}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.distance / 1000).toFixed(2)} km`}</Text>
                            </View>
                        }
                        {route.elevation_gain &&
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-up'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.elevation_gain).toFixed(2)} m`}</Text>
                        </View>
                        }
                        {route.elevation_loss &&
                            <View style={[styles.itemContainer]}>
                                <Icon
                                    icon='arrow-down'
                                    size={'small'}
                                    colour={COLOUR.gray[700]}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.elevation_loss).toFixed(2)} m`}</Text>
                            </View>
                        }
                        {route.type &&
                            <View style={[styles.itemContainer]}>
                                <Icon
                                    icon='route'
                                    size={'small'}
                                    colour={COLOUR.gray[700]}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{Format.capitalise(route.type)}</Text>
                            </View>
                        }
                        {route.difficulty &&
                            <View style={[styles.itemContainer]}>
                                <Icon
                                    icon='smile'
                                    size={'small'}
                                    colour={COLOUR.gray[700]}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{Format.capitalise(route.difficulty)}</Text>
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
            {onClose && (
                <View style={{ height: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Icon
                            icon="x"
                            size={normalise(16)}
                        />
                    </TouchableOpacity>
                    {belongsToUser && 
                        <View style={styles.belongsToUser}>
                            <Icon
                                icon="user-check"
                                colour={COLOUR.green[500]}
                                size={'small'}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.green[500] }]}>Created by you</Text>
                        </View>
                    }
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        flexDirection: 'row',
        gap: normalise(20),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomColor: COLOUR.gray[500] + OPACITY[20],
        paddingLeft: normalise(20),
        paddingVertical: normalise(15),
        borderRadius: normalise(15),
        ...SHADOW.md
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
    closeButton: {
        flexDirection: 'row', 
        alignItems: 'flex-start',
        paddingLeft: normalise(20),
        paddingRight: normalise(15),
        paddingBottom: normalise(10),
    },
    infoContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'center',
        marginTop: normalise(10)
    },
    itemContainer: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center'
    },
    belongsToUser: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingRight: normalise(15),
    }
})