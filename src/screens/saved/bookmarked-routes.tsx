import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { COLOUR, TEXT } from "../../styles"
import { delay, normalise } from "../../utils/helpers"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import NothingHere from "../../components/misc/nothing-here"
import RouteCard from "../../components/routes/route-card"
import { EventBus } from "../../services/event-bus"
import { Route } from "../../types"
import { SheetManager } from "react-native-actions-sheet"
import { SHEET } from "../../consts"
import OptionsSheet from "../../sheets/options-sheet"
import { useMapActions } from "../../contexts/map-context"
import { RouteService } from "../../services/route-service"
import { useBookmarkedRoutesActions, useBookmarkedRoutesState } from "../../contexts/bookmarked-routes-context"


export default function BookmarkedRoutesScreen({}) {

    const navigation = useNavigation();
    const { bookmarkedRoutes } = useBookmarkedRoutesState();
    const { remove: removeBookmark } = useBookmarkedRoutesActions();
    const { setActiveRoute, fitToRoute } = useMapActions();
    const [refresh, setRefresh] = useState<number>(0);
    const [selectedRoute, setSelectedRoute] = useState<Route>();
    
    const triggerReRender = () => {
        setRefresh(prev => prev + 1);
    }

    const openRouteOptions = ( route: Route ) => {
        setSelectedRoute(route);
        SheetManager.show(SHEET.ROUTES_EDIT_OPTIONS);
    }

    const inspectRoute = async () => {
        await closeRouteOptions();
        if (!selectedRoute) return;

        navigation.navigate('map');
        
        await delay(200);
        setActiveRoute(selectedRoute);
        fitToRoute(selectedRoute);
    }

    const viewRouteDetails = async ( route: Route ) => {
        await closeRouteOptions();
        navigation.navigate('route-details', { route: route });
    }

    const closeRouteOptions = async () => {
        await SheetManager.hide(SHEET.ROUTES_EDIT_OPTIONS);
    }

    const deleteRoute = async () => {
        if (selectedRoute?.id) {
            removeBookmark(selectedRoute.id);
        }
        closeRouteOptions();
    }

    const exportGPX = async () => {
        if (!selectedRoute) return;
        RouteService.export(selectedRoute)
    } 

    const shareGPX = async () => {
        if (!selectedRoute) return;
        RouteService.share(selectedRoute)
    }


    const SHEET_OPTIONS = [
        { label: 'Inspect', icon: 'eye', onPress: ()=>inspectRoute() },
        { label: 'Send GPX to a friend', icon: 'user-star', onPress: ()=>shareGPX() },
        { label: 'Export GPX', icon: 'save', onPress: ()=>exportGPX() },
        { label: 'Delete route', icon: 'trash', colour: COLOUR.red[500], onPress: ()=>openConfirmDeletePrompt() },
    ];

    const openConfirmDeletePrompt = () => {
        Alert.alert(
            'Delete this route?', 
            'Are you sure you want to delete this route permanently?',
            [
                { text: 'Keep', onPress: () => {}},
                { text: 'Delete', onPress: () => deleteRoute()},
            ],
        )
    }


    useEffect(() => {
        const refreshListener = EventBus.listen.routesRefresh(triggerReRender);

        return () => {
            refreshListener.remove();
        }
    }, []);


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {bookmarkedRoutes.length > 0 ? 
                <View>
                    <Text style={styles.title}>{`${bookmarkedRoutes.length} Route${bookmarkedRoutes.length > 1 ? 's' : ''} bookmarked`}</Text>
                    <View style={styles.cardContainer}>
                        {bookmarkedRoutes.map((route, i) => {
                            return (
                                <RouteCard
                                    route={route}
                                    key={`route-card-${i}-${route.id}-${refresh}`}
                                    onOtherPress={() => openRouteOptions(route)}
                                    onPress={() => viewRouteDetails(route)}
                                />
                            )
                        })}
                    </View>
                </View>
                :
                <NothingHere
                    title="No routes bookmarked"
                    text="Head to the map to explore section to find routes from the Wild Pitch community."
                    // onPress={navigateToBuilder}
                    // buttonText="Create new route"
                />
                }
            </ScrollView>
            <OptionsSheet
                id={SHEET.BOOKMARKED_ROUTES_EDIT_OPTIONS}
                options={SHEET_OPTIONS}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.wp_brown[100],
    },
    scrollContainer: {
        paddingVertical: normalise(20),
        paddingHorizontal: normalise(30)
    },
    title: {
        ...TEXT.h4,
        marginBottom: normalise(5)
    },
    cardContainer: {
        gap: normalise(10),
        marginTop: normalise(5)
    }
})