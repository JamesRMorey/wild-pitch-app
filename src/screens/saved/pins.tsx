import { ScrollView, StyleSheet, Text, View } from "react-native"
import { delay, normalise } from "../../functions/helpers"
import { usePointsOfInterest } from "../../hooks/usePointsOfInterest"
import PointOfInterestCard from "../../components/cards/point-of-interest-card";
import { COLOUR, TEXT } from "../../styles";
import { PointOfInterest } from "../../types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import OptionsSheet from "../../sheets/options-sheet";
import { SHEET } from "../../consts";
import { SheetManager } from "react-native-actions-sheet";
import { EventBus } from "../../services/event-bus";
import { useCallback } from "react";


export default function PinsScreen() {

    const navigation = useNavigation();
    const { pointsOfInterest, get: getPoints } = usePointsOfInterest();


    const onPoiPress = async ( poi: PointOfInterest ) => {
        navigation.navigate('map');
        await delay(100);
        EventBus.emit.mapInspectPOI(poi);
    }

    const openEditSheet = ( poi: PointOfInterest ) => {
        SheetManager.show(SHEET.PINS_EDIT_OPTIONS)
    }

    const SHEET_OPTIONS = [
        { label: 'Edit', icon: 'pencil', onPress: ()=>{} }
    ];


    useFocusEffect(
        useCallback(() => {
            getPoints();
        }, [])
    )


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                <Text style={TEXT.h4}>{pointsOfInterest.length} Pins</Text>
                {pointsOfInterest?.map((poi, i) => {
                    return (
                        <PointOfInterestCard
                            key={i}
                            point={poi}
                            onOtherPress={() => openEditSheet(poi)}
                            onPress={() => onPoiPress(poi)}
                        />
                    )
                })}
            </ScrollView>
            <OptionsSheet
                id={SHEET.PINS_EDIT_OPTIONS}
                options={SHEET_OPTIONS}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.white
    },
    scrollContainer: {
        padding: normalise(20)
    },
})