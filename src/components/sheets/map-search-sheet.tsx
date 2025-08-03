import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { TouchableOpacity, View, StyleSheet, Text, TextInput, ScrollView } from "react-native";
import { PACK_GROUPS, SHEET } from "../../consts";
import { COLOUR, TEXT } from "../../styles";
import { delay, normalise } from "../../functions/helpers";
import { SimpleLineIcons as Icon } from "@react-native-vector-icons/simple-line-icons";
import { useMapPackContext } from "../../contexts/map-pack-context";
import { useMapActions } from "../../contexts/map-context";
import { MapPackGroup as MapPackGroupType } from "../../types";
import MapPackGroup from "../map-packs/map-pack-group";


export default function MapSearchSheet ({ id=SHEET.MAP_SEARCH } : { id?: string }) {

    const { setSelectedPackGroup } = useMapPackContext();
    const { setActivePackGroup, flyTo } = useMapActions();

    const close = () => {
        SheetManager.hide(id);
    }

    const openPackSheet = async ( group: MapPackGroupType ) => {
        setSelectedPackGroup(group);
        setActivePackGroup(group);

        SheetManager.hide(SHEET.MAP_SEARCH);

        await delay(500);
        SheetManager.show(SHEET.MAP_PACKS_SEARCH);

        flyTo(group.center);
    }


    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.searchBar}>
                        <Icon
                            name="magnifier"
                            size={normalise(20)}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for places..."
                            placeholderTextColor={COLOUR.gray[600]}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={close}
                    >
                        <Text>cancel</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}>Results</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    {PACK_GROUPS.map((group, i) => {
                        return (
                            <MapPackGroup 
                                key={i}
                                group={group}
                                onPress={() => openPackSheet(group)}
                            />
                        )
                    })}
                </ScrollView>
            </View>
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
        padding: 20,
        flex: 1,
        paddingTop: normalise(30)
    },
    container: {
        
    },
    scrollView: {
    },
    headerContainer: {
        flexDirection: 'row',
        gap: normalise(20),
        alignItems: 'center',
        marginBottom: normalise(15)
    },
    searchInput: {
        flex: 1,
        padding: normalise(15),
    },
    searchBar: {
        flex: 1,
        backgroundColor: COLOUR.gray[200],
        borderRadius: normalise(50),
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: normalise(15)
    },
    heading: {
        ...TEXT.h4,
        paddingVertical: normalise(10),
        borderBottomWidth: normalise(1),
        borderColor: COLOUR.gray[300]
    }
});