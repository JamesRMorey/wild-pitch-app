import { normalise } from "../../utils/helpers";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { RouteSearchResult } from "../../types";
import { useEffect, useState } from "react";
import { WildPitchApi } from "../../services/api/wild-pitch";
import RouteSearchCardLarge from "./route-search-card-large";
import { Route } from "../../models/route";
import { COLOUR, TEXT } from "../../styles";

type PropsType = { onRouteSelected: (route: Route)=>void, title: string, subTitle: string }
export default function FeaturedRoutes ({ onRouteSelected, title, subTitle } : PropsType ) {

    const [routes, setRoutes] = useState<Array<RouteSearchResult>>();

    const fetchRoutes = async () => {
       try {
            const results = await WildPitchApi.searchFeaturedRoutes();
            setRoutes(results);
        }
        catch (error) {
            console.error(error);
            setRoutes([])
        }
    }

    const goToRoute = async ( searchResult: RouteSearchResult ) => {
        const route = await WildPitchApi.findRoute(searchResult.server_id);
        onRouteSelected(new Route(route))
    }

    useEffect(() => {
        if (!routes || routes?.length == 0) fetchRoutes();
    }, []);
    
    if (!routes || routes?.length == 0) return;
    return (
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionTitleContainer}>
                <Text style={[styles.sectionTitle, { paddingLeft: normalise(20) }]}>{ title }</Text>
                <Text style={[TEXT.p, { paddingHorizontal: normalise(20) }]}>{ subTitle }</Text>
            </View>
            <ScrollView 
                contentContainerStyle={styles.sectionScroll} 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
            >
                <View 
                    style={[
                        styles.container, 
                        routes?.length == 0 && { width: '70%' }
                    ]}
                >
                    {routes.length == 0 ?
                    <Text>We couldn't load any routes, head over to the map to find routes</Text>
                    :
                    <>
                    {routes?.map((route, i) => {
                        return (
                            <RouteSearchCardLarge
                                key={i}
                                route={route}
                                onPress={() => goToRoute(route)}
                            />
                        )
                    })} 
                    </>
                    }  
                </View>
            </ScrollView>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        gap: normalise(15),
        flexDirection: 'row'
    },
    sectionTitle: {
        ...TEXT.h3,
    },
    section: {
        padding: normalise(20),
        backgroundColor: COLOUR.white,
        gap: normalise(15)
    },
    sectionScroll: {
        gap: normalise(15),
        paddingHorizontal: normalise(20)
    },
    sectionTitleContainer: {
		gap: normalise(5)
	},
})