import { ScrollView, StyleSheet, Text, View } from "react-native"
import { COLOUR, TEXT } from "../../styles"
import { delay, normalise } from "../../functions/helpers"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import NothingHere from "../../components/misc/nothing-here"
import { useRoutes } from "../../hooks/repositories/useRoutes"
import RouteCard from "../../components/cards/route-card"
import { EventBus } from "../../services/event-bus"
import { Route } from "../../types"
import { useRoutesActions } from "../../contexts/routes-context"
import { SheetManager } from "react-native-actions-sheet"
import { SHEET } from "../../consts"
import OptionsSheet from "../../sheets/options-sheet"


export default function RoutesScreen({}) {

    const navigation = useNavigation();
    const { routes, get: getPackGroups, remove: removePackGroup } = useRoutes();
    const { setActiveRoute, fitToRoute } = useRoutesActions();
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

        navigation.navigate('routes', { screen: 'routes-map' });
        
        await delay(200);
        setActiveRoute(selectedRoute);
        fitToRoute(selectedRoute);
    }

    const viewRouteDetails = async () => {
        await closeRouteOptions();
        if (!selectedRoute) return;
        navigation.navigate('route-details', { route: selectedRoute });
    }

    const closeRouteOptions = async () => {
        await SheetManager.hide(SHEET.ROUTES_EDIT_OPTIONS);
    }

    const SHEET_OPTIONS = [
        { label: 'Inspect', icon: 'eye-outline', onPress: ()=>inspectRoute() },
        { label: 'View Details', icon: 'walk-outline', onPress: ()=>viewRouteDetails() },
    ];

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
                                />
                            )
                        })}
                    </View>
                </View>
                :
                <NothingHere
                    title="No routes saved"
                    text="Head to the routes tab to find and creates routes"
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