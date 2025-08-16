import { View, StyleSheet, Text, TextInput } from "react-native";
import { SETTING } from "../../consts";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";
import { MapPackGroup } from "../../types";
import { useState } from "react";
import { MapPackService } from "../../services/map-pack-service";
import { MapService } from "../../services/map-service";
import Mapbox from "@rnmapbox/maps";
import Button from "../../components/buttons/button";
import { useMapPackGroups } from "../../hooks/useMapPackGroups";

type PropsType = { navigation: any, route: any }
export default function AreaBuilderSaveAreaScreen ({ navigation, route } : PropsType) {

    const { bounds, onBack } = route.params;
    const { create } = useMapPackGroups();
    const [data, setData] = useState<any>({
        name: null,
        description: null
    });

    const save = () => {
        if (!data.name || !data.description) return;
        const group: MapPackGroup = {
            name: data.name,
            key: MapPackService.getKey(data.name),
            description: data.description,
            minZoom: SETTING.MAP_PACK_MIN_ZOOM,
            maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
            center: MapService.boundsCenter(bounds),
            bounds: bounds,
            packs: [
                {
                    name: MapPackService.getPackName(data.name, Mapbox.StyleURL.Outdoors),
                    styleURL: Mapbox.StyleURL.Outdoors
                },
                {
                    name: MapPackService.getPackName(data.name, Mapbox.StyleURL.SatelliteStreet),
                    styleURL: Mapbox.StyleURL.SatelliteStreet
                }
            ]
        }

        create(group);
        if (onBack) {
            onBack()
        }
        navigation.replace('saved');
    }


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                
            </View>   
            <View style={styles.inputGroup}>
                <Text style={TEXT.label}>Name</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Name your area..."
                    placeholderTextColor={COLOUR.gray[600]}
                    onChangeText={(text: string) => setData({...data, name: text})}
                    value={data.name}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={TEXT.label}>Description</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="A description of the area..."
                    placeholderTextColor={COLOUR.gray[600]}
                    onChangeText={(text: string) => setData({...data, description: text})}
                    value={data.description}
                />
            </View>
            
            <View style={styles.buttons}>
                <Button
                    title="Save"
                    onPress={save}
                />    
            </View>        
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: normalise(20)
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
        padding: normalise(15),
        backgroundColor: COLOUR.gray[200],
        borderRadius: normalise(15),
        ...TEXT.md
    },
    searchBar: {
        borderRadius: normalise(50),
        alignItems: 'center',
        flexDirection: 'row',
    },
    heading: {
        ...TEXT.h4,
        paddingVertical: normalise(10),
        borderBottomWidth: normalise(1),
        borderColor: COLOUR.gray[300]
    },
    inputGroup: {
        marginBottom: normalise(15)
    },
    buttons: {
        marginTop: normalise(15)
    }
});