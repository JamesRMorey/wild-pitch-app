import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { COLOUR, TEXT } from "../../styles"
import { normalise } from "../../functions/helpers"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { SHEET } from "../../consts"
import { useCallback, useState } from "react"
import { MapPackGroup } from "../../types"
import Mapbox from "@rnmapbox/maps"
import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack"
import { useMapPackGroups } from "../../hooks/useMapPackGroups"
import MapPackSheet from "../../sheets/map-pack-sheet"
import { SheetManager } from "react-native-actions-sheet"
import MapPackGroupCard from "../../components/cards/map-pack-group-card"
import OptionsSheet from "../../sheets/options-sheet"
import NothingHere from "../../components/misc/nothing-here"


export default function PacksScreen({}) {

    const navigation = useNavigation();
    const [offlinePacks, setOfflinePacks] = useState<Array<OfflinePack>>([]);
    const { mapPackGroups, get: getPackGroups, remove: removePackGroup } = useMapPackGroups();
    const [activeMapPackGroup, setActiveMapPackGroup] = useState<MapPackGroup>();
    
    const navigateToBuilder = () => {
        navigation.navigate('area-builder')
    }

    const updateOfflinePacks =  async() => {
        const offline = await Mapbox.offlineManager.getPacks();
        setOfflinePacks(offline);
    }

    const onPackGroupPress = (packGroup: MapPackGroup) => {
        setActiveMapPackGroup(packGroup);
        SheetManager.show(SHEET.MAP_PACKS_SAVED_PACKS)
    }

    const openPackGroupOptionsSheet = (packGroup: MapPackGroup) => {
        setActiveMapPackGroup(packGroup);
        SheetManager.show(SHEET.MAP_PACK_GROUP_OPTIONS)
    }

    const deletePackGroup = (packGroup: MapPackGroup) => {
        removePackGroup(packGroup.id);
        SheetManager.hide(SHEET.MAP_PACK_GROUP_OPTIONS);
    }

    const OPTIONS = [
        { label: 'Delete area', icon: 'trash-outline', colour: COLOUR.red[500], onPress: () => deletePackGroup(activeMapPackGroup) }
    ];


    useFocusEffect(
        useCallback(() => {
            updateOfflinePacks();
        }, [])
    );


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                {mapPackGroups.length > 0 ? 
                <>
                    <Text style={styles.title}>{mapPackGroups.length} Areas created</Text>
                    {mapPackGroups.map((packGroup, i) => {
                        return (
                            <MapPackGroupCard
                                key={i}
                                mapPackGroup={packGroup}
                                onPress={() => onPackGroupPress(packGroup)}
                                onOtherPress={() => openPackGroupOptionsSheet(packGroup)}
                            />
                        )
                    })}
                </>
                :
                <NothingHere
                    title="No areas yet?"
                    text="Press the button below to create your own area"
                    onPress={navigateToBuilder}
                    buttonText="Create new area"
                />
                }
                
            </ScrollView>
            <MapPackSheet
                id={SHEET.MAP_PACKS_SAVED_PACKS}
                packGroup={activeMapPackGroup}
            />
            <OptionsSheet
                id={SHEET.MAP_PACK_GROUP_OPTIONS}
                options={OPTIONS}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.wp_brown[100],
        borderWidth: normalise(1),
        borderColor: COLOUR.wp_brown[200]
    },
    scrollContainer: {
        paddingVertical: normalise(20),
        gap: normalise(5),
    },
    title: {
        ...TEXT.h4,
        paddingHorizontal: normalise(20),
        marginBottom: normalise(5)
    }
})