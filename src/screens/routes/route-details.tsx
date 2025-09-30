import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Share as RNShare, Linking } from "react-native"
import { normalise, stripHtml } from "../../functions/helpers"
import { COLOUR, TEXT } from "../../styles";
import { SETTING } from "../../consts";
import Icon from "../../components/misc/icon";
import { useRoutes } from "../../hooks/repositories/useRoutes";
import { useEffect, useState } from "react";
import { MapPack, Route } from "../../types";
import Button from "../../components/buttons/button";
import SectionItemCard from "../../components/cards/section-item-card";
import Mapbox from "@rnmapbox/maps";
import { MapPackService } from "../../services/map-pack-service";
import { RouteService } from "../../services/route-service";
import RNFS from "react-native-fs";
import { useMapPackDownload } from "../../hooks/useMapPackDownload";
import Share from 'react-native-share';

type PropsType = { navigation: any, route: any }
export default function RouteDetailsScreen({ navigation, route: navRoute } : PropsType) {

    const { route } = navRoute.params;
    const { create, findByLatLng } = useRoutes();
    const [savedRoute, setSavedRoute] = useState<Route|undefined>(findByLatLng(route.latitude, route.longitude));
    const pack: MapPack = {
        name: MapPackService.getPackName(route.name, Mapbox.StyleURL.Outdoors),
        styleURL: Mapbox.StyleURL.Outdoors,
        minZoom: SETTING.MAP_PACK_MIN_ZOOM,
        maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
        bounds: RouteService.getBounds(route.markers)
    };
    const { progress, errored, downloading, downloaded, checkDownloaded, setPack, download } = useMapPackDownload({ 
        mapPack: pack, 
        onSuccess: () => saveRoute() 
    });

    const goBack = () => {
        navigation.goBack();
    }

    const shareRoute = async () => {
        try {
            await RNShare.share({
                message: `Here\'s a location i've plotted on Wild Pitch Maps (${route.name}) - https://www.google.com/maps/search/?api=1&query=${route.latitude},${route.longitude}`,
            });
        } 
        catch (error: any) {
        }
    }

    const directionsToStart = async () => {
        const appleMapsUrl = `http://maps.apple.com?daddr=${route.latitude},${route.longitude}`;
        Linking.openURL(appleMapsUrl);
    }

    const saveRoute = async () => {
        try {
            if (savedRoute) throw new Error('Route already saved');

            const newRoute = await create(route);
            setSavedRoute(newRoute);
        }
        catch (err) {
            console.log(err);
        }
    }

    const startRoute = () => {
        navigation.navigate('route-navigation', { route: route });
    }

    const saveGPX = async () => {
        const gpx = RouteService.generateGPX(route);
        const fileName = RouteService.getFileName(route.name) + '.gpx';

        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.writeFile(path, gpx, 'utf8');

        await Share.open({
            title: "Export GPX",
            url: "file://" + path,
            type: "application/gpx+xml",
        });
    }

    useEffect(() => {
        checkDownloaded();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity 
                    style={styles.backContainer}
                    onPress={goBack}
                >
                    <Icon
                        icon='chevron-back'
                        size={normalise(18)}
                        colour={COLOUR.gray[700]}
                    />
                </TouchableOpacity>
                <View style={styles.rightIconsContainer}>
                    <TouchableOpacity
                        onPress={saveRoute}
                        disabled={!!savedRoute}
                        style={styles.bookmarkButton}
                    >
                        <Icon
                            icon={`${savedRoute ? 'bookmark' : 'bookmark-outline'}`}
                            size={normalise(18)}
                            colour={COLOUR.gray[700]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={shareRoute}
                        style={styles.shareButton}
                    >
                        <Icon
                            icon='share-social-outline'
                            size={normalise(18)}
                            colour={COLOUR.gray[700]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainerContent}
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{route.name}</Text>
                    <View style={styles.infoContainer}>
                        {route.distance && (
                            <View style={styles.itemContainer}>
                                <Icon
                                    icon='walk'
                                    size={'small'}
                                    colour={COLOUR.gray[700]}
                                />
                                <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.distance / 1000).toFixed(2)} km`}</Text>
                            </View>
                        )}
                        {route.elevation_gain !== undefined && (
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-up'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.elevation_gain).toFixed(2)} m`}</Text>
                        </View>
                        )}
                        {route.elevation_loss !== undefined && (
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-down'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>{`${(route.elevation_loss).toFixed(2)} m`}</Text>
                        </View>
                        )}
                    </View>
                </View>
                {route.notes && (
                <View style={styles.section}>
                    <Text style={TEXT.p}>{stripHtml(route.notes)}</Text>
                </View>
                )}
                <View style={[styles.section, { paddingTop: normalise(0), paddingBottom: normalise(15) }]}>
                    <SectionItemCard
                        title="Export GPX"
                        icon="save-outline"
                        onPress={saveGPX}
                        arrow={true}
                    />
                    <SectionItemCard
                        title="Directions to start"
                        icon="globe-outline"
                        onPress={directionsToStart}
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
                    icon="checkmark"
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
        paddingTop: SETTING.TOP_PADDING,
        backgroundColor: COLOUR.white,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: normalise(2),
        borderBottomColor: COLOUR.wp_brown[100],
        paddingBottom: normalise(20),
    },
    scrollContainer: {
        backgroundColor: COLOUR.wp_brown[100]
    },
    scrollContainerContent: {
        gap: normalise(10),
        backgroundColor: COLOUR.wp_brown[100],
        paddingVertical: normalise(8)
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
    },
    rightIconsContainer: {
        flexDirection: 'row',
        gap: normalise(5),
        alignItems: 'center',
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
    }
})