import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { COLOUR, TEXT } from "../../styles"
import { delay, normalise } from "../../utils/helpers"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import NothingHere from "../../components/misc/nothing-here"
import RouteCard from "../../components/cards/route-card"
import { EventBus } from "../../services/event-bus"
import { Route } from "../../types"
import { SheetManager } from "react-native-actions-sheet"
import { SHEET } from "../../consts"
import OptionsSheet from "../../sheets/options-sheet"
import { useMapActions } from "../../contexts/map-context"
import { useRoutesActions, useRoutesState } from "../../contexts/routes-context"
import { RouteService } from "../../services/route-service"


export default function RoutesScreen({}) {

    const navigation = useNavigation();
    const { routes } = useRoutesState();
    const { remove: removeRoute } = useRoutesActions();
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
        try {
            if (selectedRoute?.id) removeRoute(selectedRoute.id);
        }
        catch (error) {
            console.error(error)
        }
        finally {
            closeRouteOptions();
        }
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
                { text: 'Delete', onPress: () => deleteRoute()},
                { text: 'Keep', onPress: () => {}},
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
                {routes.length > 0 ? 
                <View>
                    <Text style={styles.title}>{`${routes.length} Route${routes.length > 1 ? 's' : ''}`}</Text>
                    <View style={styles.cardContainer}>
                        {routes.map((route, i) => {
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
                    title="No routes saved"
                    text="Head to the map to find and creates routes"
                    // onPress={navigateToBuilder}
                    // buttonText="Create new route"
                />
                }
            </ScrollView>
            <OptionsSheet
                id={SHEET.ROUTES_EDIT_OPTIONS}
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
        paddingHorizontal: normalise(20)
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