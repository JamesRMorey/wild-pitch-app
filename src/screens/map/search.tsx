import { TouchableOpacity, View, StyleSheet, Text, TextInput, ScrollView } from "react-native";
import { PACK_GROUPS, SETTING, SHEET } from "../../consts";
import { COLOUR, TEXT } from "../../styles";
import { delay, normalise } from "../../functions/helpers";
import { useMapPackContext } from "../../contexts/map-pack-context";
import { useMapActions } from "../../contexts/map-context";
import { MapPackGroup as MapPackGroupType } from "../../types";
import Icon from "../../components/misc/icon";
import MapPackGroup from "../../components/map-packs/map-pack-group";
import MapPackGroupCard from "../../components/cards/map-pack-group-card";

type PropsType = { navigation: any }
export default function MapSearchScreen ({ navigation } : PropsType) {

    const { setSelectedPackGroup } = useMapPackContext();
    const { setActivePackGroup, flyTo } = useMapActions();

    const openPackSheet = async ( group: MapPackGroupType ) => {
        setSelectedPackGroup(group);
        setActivePackGroup(group);
        navigation.pop();

        await delay(200);
        flyTo(group.center);
    }


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.searchBar}>
                    <Icon
                        icon="search"
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
                    onPress={() => navigation.goBack()}
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
                        <MapPackGroupCard 
                            key={i}
                            mapPackGroup={group}
                            onPress={() => openPackSheet(group)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        padding: normalise(20),
        paddingTop: SETTING.TOP_PADDING,
        flex: 1
    },
    scrollView: {
        paddingBottom: normalise(30),
        flex: 1,
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