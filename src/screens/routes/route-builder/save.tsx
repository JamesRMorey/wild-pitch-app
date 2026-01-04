import { StyleSheet, View, ScrollView } from "react-native";
import { normalise, parseValidationErrors } from "../../../utils/helpers";
import { TEXT } from "../../../styles";
import TextInput from "../../../components/inputs/text-input";
import { useCallback, useState } from "react";
import Button from "../../../components/buttons/button";
import TextArea from "../../../components/inputs/text-area";
import { FormErrors, Route } from "../../../types";
import { useFocusEffect } from "@react-navigation/native";
import KeyboardAvoidingView from "../../../components/misc/keyboard-avoiding-view";
import { RouteService } from "../../../services/route-service";
import { useRoutesActions } from "../../../contexts/routes-context";

type PropsType = { navigation: any, route: any };
export default function RouteSaveScreen({ navigation, route } : PropsType) {

    const { route: WPRoute, onGoBack } = route.params;
    const [data, setData] = useState<Route>(WPRoute);
    const [errors, setErrors] = useState<FormErrors>()
    const { create, update } = useRoutesActions();

    
    const validate = async () => {
        try {
            const routeData = {
                ...data,
                distance: data.distance ?? RouteService.calculateDistance(data.markers),
            }
            const updated = data.id ? await update(data.id, routeData) : await create(routeData);
            if (!updated) return;
            
            if (onGoBack) {
                onGoBack({ point: updated });
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

    useFocusEffect(
        useCallback(() => {
        return () => {
            if (onGoBack) onGoBack();
        };
        }, [])
    );

    return (
        <KeyboardAvoidingView>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <TextInput
                        label="Name"
                        placeHolder="Name your route..."
                        value={data.name}
                        onChangeText={(text: string) => setData({...data, name: text})}
                        error={errors?.name?.[0] ?? undefined}
                        onFocus={() => setErrors(({ ...errors, name: [] }))}
                    />
                    <TextArea
                        label="Notes"
                        placeHolder="Notes about your route..."
                        value={data.notes}
                        onChangeText={(text: string) => setData({...data, notes: text})}
                        error={errors?.notes?.[0] ?? undefined}
                        onFocus={() => setErrors(({ ...errors, notes: [] }))}
                    />
                </View>
                <View style={styles.buttons}>
                    <Button
                        onPress={() => validate()}
                        title="Save"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(20),
        gap: normalise(20),
        paddingBottom: normalise(35)
    },
    statContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        justifyContent: 'space-evenly'
    },
    stat: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(5)
    },
    statLabel: {
        ...TEXT.sm,
        textAlign: 'center'
    },
    statText: {
        ...TEXT.xl,
        textAlign: 'center'
    },
    statSubText: {
        ...TEXT.sm
    },
    latLng: {
        ...TEXT.lg,
        textAlign: 'center',
        marginTop: normalise(5),
        ...TEXT.medium
    },
    form: {
        gap: normalise(15)
    },
    buttons: {
        
    }
})