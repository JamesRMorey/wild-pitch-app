import { ScrollView, StyleSheet, Text, View } from "react-native"
import Alert from "../../components/misc/alert"
import { TEXT } from "../../styles"
import { normalise } from "../../functions/helpers"
import Button from "../../components/buttons/button"
import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import { PACK_GROUPS } from "../../consts"
import { useCallback, useState } from "react"
import { MapPack } from "../../types"
import Mapbox from "@rnmapbox/maps"
import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack"
import IconButton from "../../components/buttons/icon-button"

export default function PacksScreen({ navigation } : { navigation: any }) {

    const [offlinePacks, setOfflinePacks] = useState<Array<OfflinePack>>([]);
    
    const navigateToBuilder = () => {
        navigation.navigate('area-builder')
    }

    const updateOfflinePacks =  async() => {
        const offline = await Mapbox.offlineManager.getPacks();
        setOfflinePacks(offline);
    }

    const deletePack =  async( pack: OfflinePack ) => {
        await Mapbox.offlineManager.deletePack(pack.name);
        updateOfflinePacks();
    }


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
                <View style={styles.alertContainer}>
                    <Text style={TEXT.h2}>No custom areas yet?</Text>
                    <Text style={TEXT.p}>Press the button below to create your own area</Text>
                    <View style={styles.buttons}>
                        <Button
                            title="Create new area"
                            onPress={navigateToBuilder}
                        />
                    </View>
                </View>
                <View style={styles.packsContainer}>
                    {offlinePacks.map((offlinePack, i) => {
                        return (
                            <View 
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                                key={i}
                            >
                                <Text>{offlinePack.name}</Text>
                                <IconButton
                                    icon={'trash'}
                                    onPress={() => deletePack(offlinePack)}
                                />
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingTop: 50,
        padding: normalise(20),
        gap: normalise(30)
    },
    alertContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(15)
    },
    buttons: {
        marginTop: normalise(15)
    },
    packsContainer: {
        gap: normalise(20),
    }
})