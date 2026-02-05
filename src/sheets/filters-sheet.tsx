import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { SHEET } from "../consts";
import { COLOUR, SHADOW, TEXT } from "../styles";
import { normalise } from "../utils/helpers";
import TextInput from "../components/inputs/text-input";
import React, { useState } from 'react';
import { Filters, Option } from "../types";
import PillSelectInput from "../components/inputs/pill-select-input";
import { ROUTE_DIFFICULTY, ROUTE_TYPE } from "../consts/enums";
import SliderInput from "../components/inputs/slider-input";
import Button from "../components/buttons/button";
import { useExploreMapActions, useExploreMapState } from "../contexts/explore-map-context";

type PropsType = { id?: string, onSearch:()=>void }
export default function FiltersSheet ({ id=SHEET.EXPLORE_FILTERS, onSearch } : PropsType) {

    const { filters } = useExploreMapState();
    const { setFilters } = useExploreMapActions();
    const TYPE_FILTERS: Array<Option> = [
        { label: 'Any', value: undefined },
        { label: 'Circular', value: ROUTE_TYPE.CIRCULAR },
        { label: 'Point to point', value: ROUTE_TYPE.POINT_TO_POINT },
        { label: 'Out and back', value: ROUTE_TYPE.OUT_AND_BACK },
    ];
    const DIFFICULTY_FILTERS: Array<Option> = [
        { label: 'Any', value: undefined },
        { label: 'Easy', value: ROUTE_DIFFICULTY.EASY },
        { label: 'Moderate', value: ROUTE_DIFFICULTY.MODERATE },
        { label: 'Challenging', value: ROUTE_DIFFICULTY.CHALLENGING },
        { label: 'Difficult', value: ROUTE_DIFFICULTY.DIFFICULT },
    ];

    const search = async () => {
        onSearch();
        close();
    }

    const close = () => {
        SheetManager.hide(id);
    }

    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.searchBar}>
                        <TextInput
                            icon="search"
                            placeHolder={'Search for things...'}
                            onChangeText={(text) => setFilters(prev => ({...prev, query: text }))}
                            value={filters.query}
                            onClear={() => setFilters(prev => ({...prev, query: '' }))}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={close}
                        style={styles.cancelButton}
                    >
                        <Text>close</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}>Refine your routes</Text>
                <View style={styles.filtersContainer}>
                    <PillSelectInput
                        label="Type"
                        options={TYPE_FILTERS}
                        value={filters.type}
                        onChange={(value) => setFilters(prev => ({...prev, type: value}))}
                    />
                    <PillSelectInput
                        label="Difficulty"
                        options={DIFFICULTY_FILTERS}
                        value={filters.difficulty}
                        onChange={(value) => setFilters(prev => ({...prev, difficulty: value}))}
                    />
                    <SliderInput
                        label="Distance"
                        valueLabel={`< ${filters.max_distance} km`}
                        value={filters.max_distance ?? 0}
                        onChange={(value) => setFilters(prev => ({...prev, max_distance: value }))}
                        min={1}
                        max={50}
                        step={5}
                    />
                </View>
                <View>
                    <Button
                        title="Search"
                        onPress={search}
                        icon="search"
                    />
                </View>
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
    cancelButton: {
        paddingVertical: normalise(10)
    },
    filtersContainer: {
        paddingVertical: normalise(15),
        gap: normalise(20)
    }
});