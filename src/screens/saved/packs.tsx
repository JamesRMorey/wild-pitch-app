import { ScrollView, StyleSheet, Text, View } from "react-native"
import { COLOUR, TEXT } from "../../styles"
import { normalise } from "../../functions/helpers"
import { useNavigation } from "@react-navigation/native"
import { SHEET } from "../../consts"
import { useState } from "react"
import { MapPackGroup } from "../../types"
import { useMapPackGroups } from "../../hooks/useMapPackGroups"
import { SheetManager } from "react-native-actions-sheet"
import MapPackGroupCard from "../../components/cards/map-pack-group-card"
import OptionsSheet from "../../sheets/options-sheet"
import NothingHere from "../../components/misc/nothing-here"
import { useMapActions } from "../../contexts/map-context"
import { MapPackService } from "../../services/map-pack-service"


export default function PacksScreen({}) {

    const navigation = useNavigation();
    const { flyTo, setActivePackGroup } = useMapActions();
    const { mapPackGroups, get: getPackGroups, remove: removePackGroup } = useMapPackGroups();
    const [activeMapPackGroup, setActiveMapPackGroup] = useState<MapPackGroup>();
    const [refresh, setRefresh] = useState<number>(0);
    
    const navigateToBuilder = () => {
        navigation.navigate('area-builder')
    }
    
    const onPackGroupPress = (packGroup: MapPackGroup) => {
        setActiveMapPackGroup(packGroup);
        SheetManager.show(SHEET.MAP_PACKS_SAVED_PACKS)
    }

    const triggerReRender = () => {
        setRefresh(prev => prev + 1);
    }

    const openPackGroupOptionsSheet = (packGroup: MapPackGroup) => {
        setActiveMapPackGroup(packGroup);
        SheetManager.show(SHEET.MAP_PACK_GROUP_OPTIONS)
    }

    const removeDownload = async ( packGroup: MapPackGroup ) => {
        await MapPackService.removeDownloads(packGroup);
        await getPackGroups();
        triggerReRender()
    }

    const deletePackGroup = (packGroup: MapPackGroup) => {
        removePackGroup(packGroup.id);
        SheetManager.hide(SHEET.MAP_PACK_GROUP_OPTIONS);
    }

    const showArea = async ( packGroup: MapPackGroup ) => {
        await SheetManager.hide(SHEET.MAP_PACK_GROUP_OPTIONS);
        navigation.navigate('map');
        setActivePackGroup(packGroup);
        setTimeout(() => flyTo(packGroup.center), 100)
    }
    
    const OPTIONS = [
        { label: 'View area', icon: 'map-outline', onPress: () => showArea(activeMapPackGroup) },
        { label: 'Remove download', icon: 'cloud-download-outline', onPress: () => removeDownload(activeMapPackGroup) },
        { label: 'Delete area', icon: 'trash-outline', colour: COLOUR.red[500], onPress: () => deletePackGroup(activeMapPackGroup) },
    ];


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                {mapPackGroups.length > 0 ? 
                <View>
                    <Text style={styles.title}>{mapPackGroups.length} Areas created</Text>
                    <View style={styles.cardContainer}>
                        {mapPackGroups.map((packGroup, i) => {
                            return (
                                <MapPackGroupCard
                                    key={`${i}${refresh}`}
                                    mapPackGroup={packGroup}
                                    onPress={() => onPackGroupPress(packGroup)}
                                    onOtherPress={() => openPackGroupOptionsSheet(packGroup)}
                                />
                            )
                        })}
                    </View>
                </View>
                :
                <NothingHere
                    title="No areas yet?"
                    text="Press the button below to create your own area"
                    onPress={navigateToBuilder}
                    buttonText="Create new area"
                />
                }
            </ScrollView>
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