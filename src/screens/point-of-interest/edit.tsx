import { StyleSheet, View } from "react-native";
import { PointOfInterest, PointType } from "../../types";
import { normalise, parseValidationErrors } from "../../functions/helpers";
import { TEXT } from "../../styles";
import TextInput from "../../components/inputs/text-input";
import { useCallback, useState } from "react";
import Button from "../../components/buttons/button";
import TextArea from "../../components/inputs/text-area";
import { usePointTypes } from "../../hooks/repositories/usePointType";
import { FormErrors } from "../../types";
import PressInput from "../../components/inputs/press-input";
import { usePointsOfInterest } from "../../hooks/repositories/usePointsOfInterest";
import { useFocusEffect } from "@react-navigation/native";
import KeyboardAvoidingView from "../../components/misc/keyboard-avoiding-view";

type PropsType = { navigation: any, route: any };
export default function PointOfInterestEditScreen({ navigation, route } : PropsType) {

    const { point, onGoBack } = route.params;
    const [data, setData] = useState<PointOfInterest>(point);
    const [errors, setErrors] = useState<FormErrors>()
    const { pointTypes } = usePointTypes();
    const { create, update } = usePointsOfInterest();
    
    const validate = async () => {
        try {
            const updated = data.id ? await update(data) : await create(data);

            if (onGoBack) {
                onGoBack({ point: updated });
            }

            navigation.goBack();
        }
        catch (err: any) {
            console.log(err);
            const errs = parseValidationErrors(err);
            setErrors(errs);
        }
    }

    const selectPointType = () => {
        navigation.navigate('map-point-of-interest', { 
            screen: 'point-of-interest-point-type-selector', 
            params: {
                value: data.point_type_id,
                onGoBack: (pointType: PointType) => setData({...data, point_type_id: pointType.id})
            }
        });
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
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput
                        label="Name"
                        placeHolder="Name your point..."
                        value={data.name}
                        onChangeText={(text: string) => setData({...data, name: text})}
                        error={errors?.name?.[0] ?? undefined}
                        onFocus={() => {
                            setErrors(({ ...errors, name: [] }));
                            if (data.name.startsWith('New Location')) {
                                setData({...data, name: ''});
                            }
                        }}
                    />
                    <PressInput
                        onPress={selectPointType}
                        label="Category"
                        placeHolder="Category..."
                        value={pointTypes.find(p => p.id == data.point_type_id)?.name}
                        error={errors?.point_type_id?.[0] ?? undefined}
                        onFocus={() => setErrors(({ ...errors, point_type_id: [] }))}
                    />
                    <TextArea
                        label="Notes"
                        placeHolder="Notes about your point..."
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
            </View>
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
    }
})