import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { TouchableOpacity, View, StyleSheet, Text, ScrollView } from "react-native";
import { SHEET } from "../consts";
import { COLOUR, SHADOW, TEXT } from "../styles";
import { getPointType, normalise } from "../functions/helpers";
import TextInput from "../components/inputs/text-input";
import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { PlaceSearch } from "../services/place-search";
import { Place, RouteSearchResult } from "../types";
import PlaceCard from "../components/cards/place-card";
import Loader from "../components/map/loader";
import NothingHere from "../components/misc/nothing-here";
import { usePointTypes } from "../hooks/repositories/usePointType";
import RouteSearchCard from "../components/cards/route-search-card";
import { RouteProvider } from "../services/route-provider";
import { useGlobalState } from "../contexts/global-context";

type PropsType = { id?: string, onPlaceResultPress: (place: Place) => void, onRouteResultPress: (route: RouteSearchResult) => void }
export default function SearchSheet ({ id=SHEET.MAP_SEARCH, onPlaceResultPress, onRouteResultPress } : PropsType) {

    const { user } = useGlobalState();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [results, setResults] = useState<Array<Place>>();
    const [loading, setLoading] = useState<boolean>(false);
    const requestRef = useRef(0);
    const { pointTypes } = usePointTypes();
    const [searchType, setSearchType] = useState<'place'|'route'>('place');
    const [routeResults, setRouteResults] = useState<Array<any>>();
    const routeProvider = useMemo(() => new RouteProvider(user), [user]);

    const close = () => {
        SheetManager.hide(id);
    }

    const performRoutesSearch = useCallback(async () => {
        setLoading(true);
        const currentRequest = ++requestRef.current;
        try {
            const res = await routeProvider.search(searchTerm);

            if (currentRequest === requestRef.current) {
                setRouteResults(res);
            }
        }
        catch (err) {
            console.log(err)
            setRouteResults([]);
        }
        finally {
            if (currentRequest === requestRef.current) {
                setLoading(false);
            }
        }
    }, [searchTerm]);

    const performSearch = useCallback(async () => {
        setLoading(true);
        const currentRequest = ++requestRef.current;
        try {
            const res = await PlaceSearch.search(searchTerm);

            if (currentRequest === requestRef.current) {
                setResults(res);
            }
        }
        catch (err) {
            console.error(err)
            setResults([]);
        }
        finally {
            if (currentRequest === requestRef.current) {
                setLoading(false);
            }
        }
    }, [searchTerm]);


    useEffect(() => {
        if (searchTerm.length < 3) return;
        const handler = setTimeout(() => {
            if (searchType === 'route') {
                performRoutesSearch();
            }
            else {
                performSearch();
            }
        }, 600);
        return () => clearTimeout(handler);
    }, [searchTerm, performSearch]);

    useEffect(() => {
        if (searchTerm.length < 3) return;
        if (searchType === 'route') {
            performRoutesSearch();
        }
        else {
            performSearch();
        }
    }, [searchType]);


    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.searchBar}>
                        <TextInput
                            icon="search-outline"
                            placeHolder="Search for places..."
                            onChangeText={(text) => setSearchTerm(text)}
                            value={searchTerm}
                            onClear={() => setSearchTerm('')}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={close}
                    >
                        <Text>cancel</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.selectorContainer}>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={() => setSearchType('place')}
                        style={[styles.selctor, searchType === 'place' ? styles.active : {}]}
                    >
                        <Text style={styles.selectorText}>Places</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSearchType('route')}
                        style={[styles.selctor, searchType === 'route' ? styles.active : {}]}
                    >
                        <Text style={styles.selectorText}>Route</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}>Results</Text>
                {loading ?
                <View style={styles.loader}>
                    <Loader />
                </View>
                :routeResults && routeResults.length > 0 && searchType == 'route' ?
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    {routeResults.map((route, i) => {
                        return (
                            <RouteSearchCard
                                key={i}
                                route={route}
                                onPress={() => onRouteResultPress(route)}
                            />
                        )
                    })}
                </ScrollView>
                :results && results.length > 0 ?
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    {results.map((place, i) => {
                        const p: Place = { ...place, point_type: getPointType(place.category, pointTypes)}
                        return (
                            <PlaceCard
                                key={i}
                                place={p}
                                onPress={() => onPlaceResultPress(p)}
                            />
                        )
                    })}
                </ScrollView>
                :
                <NothingHere
                    title={searchTerm.length > 3 && results !== undefined ?  "No Results" : null}
                    text={searchTerm.length < 3 && results !== undefined ? `Start typing to search for ${searchType == 'place' ? 'places' : 'routes'}.` : `No ${searchType == 'place' ? 'places' : 'routes'} found, try a different search term.`}
                />
                }
            </View>
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
        padding: normalise(20),
        flex: 1,
        paddingTop: normalise(30)
    },
    container: {
        height: '100%',
    },
    scrollView: {
    },
    headerContainer: {
        flexDirection: 'row',
        gap: normalise(20),
        alignItems: 'center',
        marginBottom: normalise(15),
        width: '100%'
    },
    searchInput: {
        flex: 1,
    },
    searchBar: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    heading: {
        ...TEXT.h4,
        paddingVertical: normalise(10),
        borderBottomWidth: normalise(1),
        borderColor: COLOUR.gray[300]
    },
    loader: {
        paddingVertical: normalise(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectorContainer: {
        flexDirection: 'row', 
        alignItems: 'flex-start',
        padding: normalise(5),
        backgroundColor: COLOUR.gray[100],
        borderRadius: normalise(50),
        gap: normalise(1)
    },
    selctor: {
        paddingHorizontal: normalise(20),
        paddingVertical: normalise(10),
        flex: 1,
        borderRadius: normalise(50),
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectorText: {
        ...TEXT.p,
        textAlign: 'center',
        ...TEXT.medium
    },
    active: {
        backgroundColor: COLOUR.white,
        ...SHADOW.sm
    }
});