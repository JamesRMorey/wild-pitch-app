import { ScrollView, StyleSheet, Text, View } from "react-native"
import { delay, normalise } from "../../functions/helpers"
import { usePointsOfInterest } from "../../hooks/repositories/usePointsOfInterest"
import PointOfInterestCard from "../../components/cards/point-of-interest-card";
import { COLOUR, TEXT } from "../../styles";
import { PointOfInterest } from "../../types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import OptionsSheet from "../../sheets/options-sheet";
import { SHEET } from "../../consts";
import { SheetManager } from "react-native-actions-sheet";
import { useCallback, useState } from "react";
import { EventBus } from "../../services/event-bus";
import NothingHere from "../../components/misc/nothing-here";

type PropsType = { navigation: any }
export default function PinsScreen({  } : PropsType) {

    const navigation: any = useNavigation();
    const { pointsOfInterest, get: getPoints, remove: removePoint } = usePointsOfInterest();
    const [selectedPOI, setSelectedPOI] = useState<PointOfInterest>();


    const onPoiPress = async ( poi?: PointOfInterest ) => {
        navigation.navigate('map');
        await delay(500);
        
        if (poi) {
            EventBus.emit.mapInspectPOI(poi);
        }
    }

    const openOptionsSheet = ( poi: PointOfInterest ) => {
        setSelectedPOI(poi);
        SheetManager.show(SHEET.PINS_EDIT_OPTIONS);
    }

    const viewSelectedPOI = async () => {
        await SheetManager.hide(SHEET.PINS_EDIT_OPTIONS);
        if (selectedPOI) {
            onPoiPress(selectedPOI);
        }
    }

    const editSelectedPOI = async () => {
        await SheetManager.hide(SHEET.PINS_EDIT_OPTIONS);
        if (selectedPOI) {
            onPoiPress(selectedPOI);
        }
    }

    const deleteSelectedPOI = async () => {
        if (selectedPOI?.id) removePoint(selectedPOI.id);
        await SheetManager.hide(SHEET.PINS_EDIT_OPTIONS);
    }

    const SHEET_OPTIONS = [
        { label: 'View', icon: 'eye-outline', onPress: ()=>viewSelectedPOI() },
        { label: 'Edit', icon: 'pencil-outline', onPress: ()=>editSelectedPOI() },
        { label: 'Delete', icon: 'trash-outline', colour: COLOUR.red[500], onPress: ()=>deleteSelectedPOI() },
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
                {pointsOfInterest.length > 0 ?
                <View>
                    <Text style={styles.title}>{pointsOfInterest.length} Pins</Text>
                    <View style={styles.cardContainer}>
                        {pointsOfInterest?.map((poi, i) => {
                            return (
                                <PointOfInterestCard
                                    key={i}
                                    point={poi}
                                    onOtherPress={() => openOptionsSheet(poi)}
                                    onPress={() => openOptionsSheet(poi)}
                                />
                            )
                        })}
                    </View>
                </View>
                :
                <NothingHere
                    title="No Point of Interest yet?"
                    text="Head to the map and add some pins to your map"
                    onPress={() => onPoiPress()}
                />
                }
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
});