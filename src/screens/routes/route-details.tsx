import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Linking, Alert, ImageBackground } from "react-native"
import { normalise, stripHtml } from "../../utils/helpers"
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { ASSET, SETTING } from "../../consts";
import Icon from "../../components/misc/icon";
import { useCallback, useMemo, useState } from "react";
import { MapPack } from "../../types";
import Button from "../../components/buttons/button";
import SectionItemCard from "../../components/cards/section-item-card";
import Mapbox from "@rnmapbox/maps";
import { MapPackService } from "../../services/map-pack-service";
import { RouteService } from "../../services/route-service";
import { useMapPackDownload } from "../../hooks/useMapPackDownload";
import { useFocusEffect } from "@react-navigation/native";
import { WildPitchApi } from "../../services/api/wild-pitch";
import { useGlobalState } from "../../contexts/global-context";
import { useBookmarkedRoutesActions, useBookmarkedRoutesState } from "../../contexts/bookmarked-routes-context";
import { useRoutesActions } from "../../contexts/routes-context";
import { Route } from "../../classes/route";
import { Format } from "../../services/formatter";

type PropsType = { navigation: any, route: any }
export default function RouteDetailsScreen({ navigation, route: navRoute } : PropsType) {

    const { user } = useGlobalState();
    const [route, setRoute] = useState<Route>(navRoute.params.route);
    const { bookmarkedRoutes } = useBookmarkedRoutesState();
    const [sharing, setSharing] = useState<boolean>(false);
    const { create: createBookmarkedRoute } = useBookmarkedRoutesActions();
    const { makePublic, find } = useRoutesActions();
    const pack: MapPack = {
        name: MapPackService.getPackName(route.name, Mapbox.StyleURL.Outdoors),
        styleURL: Mapbox.StyleURL.Outdoors,
        minZoom: SETTING.MAP_PACK_MIN_ZOOM,
        maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
        bounds: RouteService.getBounds(route.markers)
    };
    const { progress, errored, downloading, downloaded, checkDownloaded, download, setPack } = useMapPackDownload({ 
        mapPack: pack, 
        onSuccess: () => bookmarkRoute()
    });
    const isBookmarked: boolean = useMemo(() => route.isBookmarked(bookmarkedRoutes), [bookmarkedRoutes, route]);

    const goBack = () => {
        navigation.goBack();
    }

    const shareRoute = async () => {
        RouteService.share(route.toJSON());
    }

    const directionsToStart = async () => {
        const appleMapsUrl = `http://maps.apple.com?daddr=${route.latitude},${route.longitude}`;
        Linking.openURL(appleMapsUrl);
    }

    const bookmarkRoute = async () => {
        try {
            await createBookmarkedRoute(route);
        }
        catch (err) {
            console.log(err);
        }
    }

    const startRoute = () => {
        navigation.navigate('route-navigation', { route: route });
    }

    const saveGPX = async () => {
        route.export();
    }

    const edit = () => {
        navigation.navigate('route-builder', { 
            route: route,
            initialCenter: { latitude: route.latitude, longitude: route.longitude } 
        })
    }

    const confirmPublic = async () => {
        try {
            setSharing(true);
            const uploaded = await makePublic(route);

            if (uploaded) {
                setRoute(new Route(uploaded))
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setSharing(false)
        }
    }

    const uploadRoute = async () => {
        Alert.alert(
            'Share this route',
            'Thanks for sharing this route, this route will be made available to other users once approved by our team.',
            [
                { text: 'Cancel', onPress: () => {}},
                { text: 'Confirm', onPress: () => confirmPublic()},
            ]
        )
    }

    const findRoute = async () => {
        const found = route.id ? find(route.id) : await WildPitchApi.findRoute(route.server_id);
        if (!found) return;
        
        setPack({
            name: MapPackService.getPackName(found.name, Mapbox.StyleURL.Outdoors),
            styleURL: Mapbox.StyleURL.Outdoors,
            minZoom: SETTING.MAP_PACK_MIN_ZOOM,
            maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
            bounds: RouteService.getBounds(found.markers)
        });
        
        setRoute(new Route(found));
        checkDownloaded();
    }

    useFocusEffect(
        useCallback(() => {
            findRoute();
        }, [])
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={ASSET.BACKGROUND_WP_SMALL_BLURRED}>
                <View style={styles.overlay}></View>
                <View style={styles.titleContainer}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity 
                            style={styles.backContainer}
                            onPress={goBack}
                        >
                            <Icon
                                icon='chevron-left'
                                size={normalise(18)}
                                colour={COLOUR.white}
                            />
                        </TouchableOpacity>
                        <View style={styles.rightIconsContainer}>
                            {route.isOwnedByUser(user.id) ? 
                                <View style={styles.belongsToUser}>
                                    <Text style={[TEXT.sm, { color: COLOUR.white }]}>Created by you</Text>
                                    <Icon
                                        icon="user-check"
                                        colour={COLOUR.white}
                                        size={normalise(18)}
                                    />
                                </View>
                            :
                            <TouchableOpacity
                                onPress={bookmarkRoute}
                                disabled={false}
                                style={styles.bookmarkButton}
                            >
                                <Icon
                                    icon={`${isBookmarked ? 'bookmark-check' : 'bookmark'}`}
                                    size={normalise(18)}
                                    colour={COLOUR.white}
                                />
                            </TouchableOpacity>
                            }
                            <TouchableOpacity
                                onPress={shareRoute}
                                style={styles.shareButton}
                            >
                                <Icon
                                    icon='share'
                                    size={normalise(18)}
                                    colour={COLOUR.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: normalise(20) }}>
                        <Text style={[TEXT.h3, { color: COLOUR.white }]}>{route.name.replaceAll('\n', '')}</Text>
                        <View style={styles.infoContainer}>
                            {route.distance &&
                                <View style={styles.itemContainer}>
                                    <Icon
                                        icon='footprints'
                                        size={'small'}
                                        colour={COLOUR.white}
                                    />
                                    <Text style={[TEXT.xs, { color: COLOUR.white }]}>{`${(route.distance / 1000).toFixed(2)} km`}</Text>
                                </View>
                            }
                            {route.elevation_gain &&
                            <View style={styles.itemContainer}>
                                <Icon
                                    icon='arrow-up'
                                    size={'small'}
                                    colour={COLOUR.white}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.white }]}>{`${route.elevation_gain.toFixed(2)} m`}</Text>
                            </View>
                            }
                            {route.elevation_loss && (
                            <View style={styles.itemContainer}>
                                <Icon
                                    icon='arrow-down'
                                    size={'small'}
                                    colour={COLOUR.white}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.white }]}>{`${route.elevation_loss.toFixed(2)} m`}</Text>
                            </View>
                            )}
                            {route.type &&
                                <View style={[styles.itemContainer]}>
                                    <Icon
                                        icon='route'
                                        size={'small'}
                                        colour={COLOUR.white}
                                    />
                                    <Text style={[TEXT.xs, { color: COLOUR.white }]}>{Format.capitalise(route.type)}</Text>
                                </View>
                            }
                            {route.difficulty &&
                                <View style={[styles.itemContainer]}>
                                    <Icon
                                        icon='smile'
                                        size={'small'}
                                        colour={COLOUR.white}
                                    />
                                    <Text style={[TEXT.xs, { color: COLOUR.white }]}>{Format.capitalise(route.difficulty)}</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <ScrollView
                contentContainerStyle={styles.scrollContainerContent}
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {route.notes && (
                <View style={styles.section}>
                    <Text style={TEXT.p}>{stripHtml(route.notes)}</Text>
                </View>
                )}
                {route.isOwnedByUser(user.id) && 
                <View>
                    {route.isPublic() ?
                    <View style={[styles.section]}>
                        <Text style={styles.sectionTitle}>Thanks for sharing</Text>
                        <Text style={[TEXT.p, { marginTop: normalise(10)}]}>This route is shared with others to enjoy.</Text>
                    </View>
                    :
                    <View style={[styles.section, { gap: normalise(15) }]}>
                        <Text style={styles.sectionTitle}>Share this route</Text>
                        <Text style={[TEXT.p]}>This route is currently private but we'd love if you would make it available for other users to discover.</Text>
                        <Button
                            title="Share with Wild Pitch"
                            icon="tent"
                            onPress={uploadRoute}
                            loading={sharing}
                        />
                    </View>
                    }
                </View>}
                <View style={[styles.section, { paddingTop: normalise(0), paddingBottom: normalise(15) }]}>
                    {route.isOwnedByUser(user.id) && 
                    <SectionItemCard
                        title="Edit this route"
                        icon="pencil"
                        onPress={edit}
                        arrow={true}
                    />
                    }
                    <SectionItemCard
                        title="Export GPX"
                        icon="save"
                        onPress={saveGPX}
                        arrow={true}
                    />
                    <SectionItemCard
                        title="Directions to start"
                        icon="globe"
                        onPress={directionsToStart}
                        arrow={true}
                        last={true}
                    />
                </View>
                <View style={[styles.section, { paddingTop: normalise(0), paddingBottom: normalise(15) }]}>
                    <SectionItemCard
                        title="Send GPX to a friend"
                        icon="user-star"
                        onPress={shareRoute}
                        arrow={true}
                        last={true}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttons}>
                {errored ?
                <Button
                    title="Retry"
                    onPress={download}
                    style='outline'
                    flex={true}
                />
                :downloading ?
                <Button
                    title={`${progress}%`}
                    style='outline'
                    flex={true}
                />
                :downloaded ?
                <Button
                    title="Downloaded"
                    style='outline'
                    flex={true}
                    icon="check"
                />
                :
                <Button
                    title="Download"
                    onPress={download}
                    style='outline'
                    flex={true}
                />
                }
                <Button
                    title="Start Route"
                    onPress={startRoute}
                    flex={true}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.white,
    },
    titleContainer: {
        paddingTop: SETTING.TOP_PADDING,
        paddingBottom: normalise(20),
        gap: normalise(70),
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scrollContainer: {
        backgroundColor: COLOUR.wp_brown[100],
        paddingTop: normalise(10)
    },
    scrollContainerContent: {
        gap: normalise(10),
        backgroundColor: COLOUR.wp_brown[100],
        paddingBottom: normalise(8)
    },
    sectionTitle: {
        ...TEXT.h3,
    },
    section: {
        backgroundColor: COLOUR.white,
        padding: normalise(20)
    },
    backContainer: {
        paddingLeft: normalise(20),
        paddingRight: normalise(10)
    },
    rightIconsContainer: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center'
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
    shareButton: {
        paddingRight: normalise(20),
    },
    bookmarkButton: {
        paddingRight: normalise(10),
    },
    buttons: {
        padding: normalise(20),
        backgroundColor: COLOUR.white,
        borderTopWidth: normalise(1),
        borderTopColor: COLOUR.gray[200],
        flexDirection: 'row',
        gap: normalise(10),
    },
    belongsToUser: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center',
        marginRight: normalise(10)
    },
    overlay: {
        backgroundColor: COLOUR.black + OPACITY[30], 
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})