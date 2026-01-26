import { StyleSheet, View, ScrollView, Text } from "react-native";
import { normalise, parseValidationErrors } from "../../../utils/helpers";
import { TEXT } from "../../../styles";
import TextInput from "../../../components/inputs/text-input";
import { useCallback, useMemo, useState } from "react";
import Button from "../../../components/buttons/button";
import TextArea from "../../../components/inputs/text-area";
import { FormErrors, Option, RouteData } from "../../../types";
import { useFocusEffect } from "@react-navigation/native";
import KeyboardAvoidingView from "../../../components/misc/keyboard-avoiding-view";
import { RouteService } from "../../../services/route-service";
import { useRoutesActions } from "../../../contexts/routes-context";
import { ROUTE_DIFFICULTY, ROUTE_TYPE } from "../../../consts/enums";
import PillSelectInput from "../../../components/inputs/pill-select-input";
import Icon from "../../../components/misc/icon";

type PropsType = { navigation: any, route: any, popCount?: number };
export default function RouteSaveScreen({ navigation, route: params, popCount=2 } : PropsType) {

    const { route, onGoBack } = params.params;
    const [data, setData] = useState<RouteData>(route);
    const [errors, setErrors] = useState<FormErrors>()
    const { create, update } = useRoutesActions();
    const TYPE_OPTIONS: Array<Option> = [
        { label: 'Circular', value: ROUTE_TYPE.CIRCULAR },
        { label: 'Out and back', value: ROUTE_TYPE.OUT_AND_BACK },
        { label: 'Point to point', value: ROUTE_TYPE.POINT_TO_POINT },
    ];
    const DIFFICULTY_OPTIONS: Array<Option> = [
        { label: 'Easy', value: ROUTE_DIFFICULTY.EASY },
        { label: 'Moderate', value: ROUTE_DIFFICULTY.MODERATE },
        { label: 'Challenging', value: ROUTE_DIFFICULTY.CHALLENGING },
        { label: 'Difficult', value: ROUTE_DIFFICULTY.DIFFICULT }
    ];
    const distance = useMemo(() => data.distance ?? RouteService.calculateDistance(data.markers), [route]);

    const validate = async () => {
        try {
            const routeData = {
                ...data,
                distance: distance,
            }
            
            const updated = data.id ? await update(data.id, routeData) : await create(routeData);
            if (!updated) return;
            
            if (onGoBack) {
                onGoBack({ point: updated });
            }
            
            let i = 1;
            while (i <= popCount) {
                await navigation.pop();
                i++;
            }
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
                    <PillSelectInput
                        label="Type"
                        options={TYPE_OPTIONS}
                        onChange={(value) => setData(prev => ({...prev, type: value }))}
                        value={data.type}
                        error={errors?.type?.[0] ?? undefined}
                    />
                    <PillSelectInput
                        label="Difficulty"
                        options={DIFFICULTY_OPTIONS}
                        onChange={(value) => setData(prev => ({...prev, difficulty: value }))}
                        value={data.difficulty}
                        error={errors?.difficulty?.[0] ?? undefined}
                    />
                    <TextArea
                        label="Notes"
                        placeHolder="Notes about your route..."
                        value={data.notes}
                        onChangeText={(text: string) => setData({...data, notes: text})}
                        error={errors?.notes?.[0] ?? undefined}
                        onFocus={() => setErrors(({ ...errors, notes: [] }))}
                    />
                    {distance && 
                    <View style={{ flexDirection: 'row', gap: normalise(5), alignItems: 'center' }}>
                        <Icon
                            icon="footprints"
                        />
                        <Text style={TEXT.label}>Distance: {`${(distance / 1000).toFixed(2)} km`}</Text>
                    </View>
                    }
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