import { normalise } from "../../utils/helpers";
import { COLOUR, ROUNDED, TEXT } from "../../styles";
import { RouteSearchResult } from "../../types"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../misc/icon";
import { Format } from "../../services/formatter";
import { Image } from "react-native-animatable";
import { ASSET } from "../../consts";
import IconButton from "../buttons/icon-button";
import { useBookmarkedRoutesActions, useBookmarkedRoutesState } from "../../contexts/bookmarked-routes-context";
import { WildPitchApi } from "../../services/api/wild-pitch";
import { useMemo } from "react";
import { useGlobalActions, useGlobalState } from "../../contexts/global-context";

type PropsType = { route: RouteSearchResult, onPress?: ()=>void }
export default function RouteSearchCardLarge ({ route, onPress=()=>{} } : PropsType ) {

    const { user } = useGlobalState();
    const { verifyLogin } = useGlobalActions();
    const { create, isBookmarked } = useBookmarkedRoutesActions();
    const { bookmarkedRoutes } = useBookmarkedRoutesState();
    const bookmarked = useMemo<boolean>(() => isBookmarked(route.server_id), [bookmarkedRoutes]);

    const bookmark = async () => {
        if (!verifyLogin()) return;
        if (bookmarked) return;
        try {
            const data = await WildPitchApi.findRoute(route.server_id);
            await create(data);
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View>
                <Image
                    source={ASSET.BACKGROUND_WP_SMALL_BLURRED}
                    style={styles.image}
                />
                {(route.user?.id != user?.id && user) && 
                <View style={{ position: 'absolute', top: normalise(10), right: normalise(10) }}>
                    <IconButton
                        icon={bookmarked ? 'bookmark-check' : 'bookmark'}
                        small={true}
                        size={normalise(19)}
                        onPress={bookmark}
                    />
                </View>
                }
            </View>
            <View style={styles.bottomContainer}>
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
                    {route.type && (
                    <View style={styles.itemContainer}>
                        <Icon
                            icon='route'
                            size={'small'}
                            colour={COLOUR.gray[700]}
                        />
                        <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{Format.capitalise(route.type)}</Text>
                    </View>
                    )}
                    {route.difficulty && (
                    <View style={styles.itemContainer}>
                        <Icon
                            icon='smile'
                            size={'small'}
                            colour={COLOUR.gray[700]}
                        />
                        <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{Format.capitalise(route.difficulty)}</Text>
                    </View>
                    )}
                </View>
                {route.user?.name && 
                <View style={{ marginTop: normalise(8) }}>
                    <Text style={TEXT.xs}>Created by { route.user.name }</Text>
                </View>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: normalise(260),
        gap: normalise(15)
    },
    bottomContainer: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'center',
        marginTop: normalise(5),
        flexWrap: 'wrap',
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center'
    },
    belongsToUser: {
        marginTop: normalise(5),
        ...ROUNDED.full,
    },
    image: {
        aspectRatio: 4/3,
        height: 'auto',
        width: '100%',
        ...ROUNDED.xl,
        backgroundColor: COLOUR.wp_brown[100]
    }
})