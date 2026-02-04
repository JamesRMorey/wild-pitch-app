import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { delay, normalise } from "../../utils/helpers"
import PointOfInterestCard from "../../components/cards/point-of-interest-card";
import { COLOUR, TEXT } from "../../styles";
import { PointOfInterest } from "../../types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import OptionsSheet from "../../sheets/options-sheet";
import { SHEET } from "../../consts";
import { SheetManager } from "react-native-actions-sheet";
import { useState } from "react";
import { EventBus } from "../../services/event-bus";
import NothingHere from "../../components/misc/nothing-here";
import { usePointsOfInterestActions, usePointsOfInterestState } from "../../contexts/pois-context";

type PropsType = { navigation: any }
export default function PinsScreen({  } : PropsType) {

    const navigation: any = useNavigation();
    const { pointsOfInterest } = usePointsOfInterestState();
    const { remove: removePoint } = usePointsOfInterestActions();
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
        try {
            if (selectedPOI?.id) removePoint(selectedPOI.id);
        }
        catch (error) {
            console.error(error)
        }
        finally {
            await SheetManager.hide(SHEET.PINS_EDIT_OPTIONS);
        }
    }

    const SHEET_OPTIONS = [
        { label: 'View', icon: 'eye', onPress: ()=>viewSelectedPOI() },
        { label: 'Edit', icon: 'pencil', onPress: ()=>editSelectedPOI() },
        { label: 'Delete pin', icon: 'trash', colour: COLOUR.red[500], onPress: ()=>openConfirmDeletePrompt() },
    ];

    const openConfirmDeletePrompt = () => {
        Alert.alert(
            'Delete this point?', 
            'Are you sure you want to delete this point permanently?',
            [
                { text: 'Keep', onPress: () => {}},
                { text: 'Delete', onPress: () => deleteSelectedPOI()},
            ],
        )
    }


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
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
                    title="No pins"
                    text="Head to the map and add some pins. You can use the search on the map to find places around the UK."
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
});