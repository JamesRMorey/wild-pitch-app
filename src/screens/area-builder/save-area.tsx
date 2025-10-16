import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SETTING } from "../../consts";
import { normalise, parseValidationErrors } from "../../functions/helpers";
import { FormErrors, MapPackGroup } from "../../types";
import { useState } from "react";
import { MapPackService } from "../../services/map-pack-service";
import { MapService } from "../../services/map-service";
import Mapbox from "@rnmapbox/maps";
import Button from "../../components/buttons/button";
import TextArea from "../../components/inputs/text-area";
import TextInput from "../../components/inputs/text-input";
import { object, string } from "yup";
import { useMapPackGroupsActions } from "../../contexts/map-pack-group-context";

const schema = object({
    name: string().required("Name is required"),
    description: string().required("Description is required"),
});

type PropsType = { navigation: any, route: any }
export default function AreaBuilderSaveAreaScreen ({ navigation, route } : PropsType) {

    const { bounds, onBack } = route.params;
    const { create } = useMapPackGroupsActions();
    const [data, setData] = useState<any>({
        name: null,
        description: null
    });
    const [errors, setErrors] = useState<FormErrors>();

    const save = async () => {
        try {
            await schema.validate(data, { abortEarly: false });

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
                    }
                ]
            }

            create(group);
            if (onBack) {
                onBack()
            }
            
            await navigation.pop();
            await navigation.pop();
        }
        catch (err: any) {
            console.log(err);
            const errs = parseValidationErrors(err);
            setErrors(errs);
        }
    }


    return (
        <KeyboardAvoidingView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <TextInput
                            label="Name"
                            placeHolder="Name your area..."
                            onChangeText={(text: string) => setData({...data, name: text})}
                            value={data.name}
                            error={errors?.name?.[0] ?? undefined}
                            onFocus={() => setErrors(({ ...errors, name: [] }))}
                        />
                        <TextArea
                            label="Description"
                            placeHolder="A description of the area..."
                            onChangeText={(text: string) => setData({...data, description: text})}
                            value={data.description}
                            error={errors?.description?.[0] ?? undefined}
                            onFocus={() => setErrors(({ ...errors, description: [] }))}
                        />
                    </View>
                    <View style={styles.buttons}>
                        <Button
                            title="Save"
                            onPress={save}
                        />    
                    </View>        
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    form: {
        gap: normalise(15)
    },
    buttons: {
        marginTop: normalise(30)
    }
});