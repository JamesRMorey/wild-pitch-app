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


export default function RoutesScreen({}) {

    const navigation = useNavigation();
    const { routes, get: getPackGroups, remove: removePackGroup } = useRoutes();
    const { setActiveRoute, fitToRoute } = useRoutesActions();
    const [refresh, setRefresh] = useState<number>(0);
    
    
    const triggerReRender = () => {
        setRefresh(prev => prev + 1);
    }

    const inspectRoute = async ( route: Route ) => {
        navigation.navigate('routes', { screen: 'routes-map' });
        
        await delay(200);
        setActiveRoute(route);
        fitToRoute(route)
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
                                    onPress={() => inspectRoute(route)}
                                />
                            )
                        })}
                    </View>
                </View>
                :
                <NothingHere
                    title="No offline maps downloaded"
                    text="Press the button below to download an offline map area"
                    // onPress={navigateToBuilder}
                    buttonText="Create new area"
                />
                }
            </ScrollView>
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