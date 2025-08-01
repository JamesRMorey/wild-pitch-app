import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { TouchableOpacity, View, StyleSheet, Text, TextInput } from "react-native";
import { SETTING, SHEET } from "../../../consts";
import { COLOUR, TEXT } from "../../../styles";
import { normalise } from "../../../functions/helpers";
import { MapPackGroup, PositionArray } from "../../../types";
import { useEffect, useState } from "react";
import { MapPackService } from "../../../services/map-pack-service";
import { MapService } from "../../../services/map-service";
import Mapbox from "@rnmapbox/maps";
import Button from "../../buttons/button";
import IconButton from "../../buttons/icon-button";


export default function BuilderAreaCreateEditSheet ({ id=SHEET.BUILDER_AREA_CREATE_EDIT_SHEET, bounds } : { id?: string, bounds: PositionArray }) {

    // if (!bounds) return;

    const [data, setData] = useState<any>({
        name: null,
        description: null
    });

    const close = () => {
        SheetManager.hide(id);
    }

    const save = () => {
        if (!data.name || !data.description) return;
        const mapPackGroup: MapPackGroup = {
            name: data.name,
            description: data.description,
            minZoom: SETTING.MAP_PACK_MIN_ZOOM,
            maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
            center: MapService.boundsCenter(bounds),
            packs: [
                {
                    name: MapPackService.getPackName(data.name, Mapbox.StyleURL.Outdoors),
                    styleURl: Mapbox.StyleURL.Outdoors
                },
                {
                    name: MapPackService.getPackName(data.name, Mapbox.StyleURL.SatelliteStreet),
                    styleURl: Mapbox.StyleURL.SatelliteStreet
                },
                {
                    name: MapPackService.getPackName(data.name, Mapbox.StyleURL.Street),
                    styleURl: Mapbox.StyleURL.Street
                }
            ]
        }
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
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
                
                <View style={styles.buttons}>
                    <IconButton
                        icon="folder"
                        onPress={save}
                    />    
                </View>        
            </View>
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
        padding: 20,
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
    },
    buttons: {
        marginTop: normalise(15),
        alignItems: 'flex-end'
    }
});