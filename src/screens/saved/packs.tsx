import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { COLOUR, TEXT } from "../../styles"
import { normalise } from "../../utils/helpers"
import { useNavigation } from "@react-navigation/native"
import { SHEET } from "../../consts"
import { useEffect, useState } from "react"
import { MapPackGroup } from "../../types"
import { SheetManager } from "react-native-actions-sheet"
import MapPackGroupCard from "../../components/cards/map-pack-group-card"
import OptionsSheet from "../../sheets/options-sheet"
import NothingHere from "../../components/misc/nothing-here"
import { useMapActions } from "../../contexts/map-context"
import { MapPackService } from "../../services/map-pack-service"
import { useMapPackGroupsActions, useMapPackGroupsState } from "../../contexts/map-pack-group-context"
import { EventBus } from "../../services/event-bus"


export default function PacksScreen({}) {

    const navigation = useNavigation();
    const { fitToBounds, setActivePackGroup } = useMapActions();
    const { mapPackGroups } = useMapPackGroupsState();
    const { remove: removePackGroup } = useMapPackGroupsActions();
    const [activeMapPackGroup, setActiveMapPackGroup] = useState<MapPackGroup>();
    const [refresh, setRefresh] = useState<number>(0);
    
    const navigateToBuilder = () => {
        navigation.navigate('area-builder')
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
        triggerReRender()
    }

    const deletePackGroup = (packGroup: MapPackGroup) => {
        try {
            if (packGroup.id) removePackGroup(packGroup.id);
        }
        catch (error) {
            console.error(error)
        }
        finally {
            SheetManager.hide(SHEET.MAP_PACK_GROUP_OPTIONS);
        }
    }

    const showArea = async ( packGroup: MapPackGroup ) => {
        await SheetManager.hide(SHEET.MAP_PACK_GROUP_OPTIONS);
        navigation.navigate('map');
        setActivePackGroup(packGroup);
        setTimeout(() => fitToBounds(packGroup.bounds[0], packGroup.bounds[1], 100), 100)
    }
    
    const OPTIONS = [
        { label: 'View area', icon: 'map', onPress: () => showArea(activeMapPackGroup) },
        { label: 'Remove download', icon: 'cloud-download', onPress: () => removeDownload(activeMapPackGroup) },
        { label: 'Delete area', icon: 'trash', colour: COLOUR.red[500], onPress: () => openConfirmDeletePrompt() },
    ];

    const openConfirmDeletePrompt = () => {
        if (!activeMapPackGroup) return;
        Alert.alert(
            'Delete this route?', 
            'Are you sure you want to delete this route permanently?',
            [
                { text: 'Keep', onPress: () => {}},
                { text: 'Delete', onPress: () => deletePackGroup(activeMapPackGroup)},
            ],
        )
    }


    useEffect(() => {
        const refreshListener = EventBus.listen.packsRefresh(triggerReRender);

        return () => {
            refreshListener.remove();
        }
    }, []);


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {mapPackGroups.length > 0 ? 
                <View>
                    <Text style={styles.title}>{`${mapPackGroups.length} Map${mapPackGroups.length > 1 ? 's' : ''}`}</Text>
                    <View style={styles.cardContainer}>
                        {mapPackGroups.map((packGroup, i) => {
                            return (
                                <MapPackGroupCard
                                    key={`${i}${refresh}`}
                                    mapPackGroup={packGroup}
                                    onPress={() => openPackGroupOptionsSheet(packGroup)}
                                    onOtherPress={() => openPackGroupOptionsSheet(packGroup)}
                                />
                            )
                        })}
                    </View>
                </View>
                :
                <NothingHere
                    title="No map areas"
                    text="Head to the map if you want to download an area without a route. These areas will display offline on the main map once downloaded."
                    onPress={navigateToBuilder}
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