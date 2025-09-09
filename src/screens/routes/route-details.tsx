import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Share } from "react-native"
import { normalise } from "../../functions/helpers"
import { COLOUR, TEXT } from "../../styles";
import { SETTING } from "../../consts";
import Icon from "../../components/misc/icon";
import { useRoutes } from "../../hooks/repositories/useRoutes";
import { useState } from "react";
import { Route } from "../../types";
import Button from "../../components/buttons/button";

type PropsType = { navigation: any, route: any }
export default function RouteDetailsScreen({ navigation, route: navRoute } : PropsType) {

    const { route } = navRoute.params;
    const { create, findByLatLng } = useRoutes();
    const [savedRoute, setSavedRoute] = useState<Route|undefined>(findByLatLng(route.latitude, route.longitude));

    const goBack = () => {
        navigation.goBack();
    }

    const shareRoute = async () => {
        try {
            await Share.share({
                message: `Here\'s a location i've plotted on Wild Pitch Maps (${route.name}) - https://www.google.com/maps/search/?api=1&query=${route.latitude},${route.longitude}`,
            });
        } 
        catch (error: any) {
        }
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

    const downloadRoute = () => {
    }

    const startRoute = () => {
        navigation.navigate('routes', { screen: 'route-navigation', params: { route: route } });
    }

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
                {/* <Text style={styles.sectionTitle}>{route.name}</Text> */}
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
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-up'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>+1000 m</Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Icon
                                icon='arrow-down'
                                size={'small'}
                                colour={COLOUR.gray[700]}
                            />
                            <Text style={[TEXT.xs, { color: COLOUR.gray[700] }]}>-1000 m</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttons}>
                <Button
                    title="Download"
                    onPress={downloadRoute}
                    style='outline'
                    flex={true}
                />
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
        paddingTop: normalise(8)
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