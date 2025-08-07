import { StyleSheet, View } from "react-native";
import { PointOfInterest, PointType } from "../../types";
import { normalise } from "../../functions/helpers";
import { TEXT } from "../../styles";
import Header from "../header";
import TextInput from "../../components/inputs/text-input";
import { useState } from "react";
import Button from "../../components/buttons/button";
import TextArea from "../../components/inputs/text-area";
import { usePointTypes } from "../../hooks/usePointType";
import { FormErrors } from "../../types";
import PressInput from "../../components/inputs/press-input";
import useModals from "../../hooks/useModals";
import PointTypeSelectorModal from "../../modals/point-type-selector";

type PropsType = { point: PointOfInterest, onBack: ()=>void, onSave: (data: PointOfInterest)=>void };

export default function Edit({ point, onBack, onSave } : PropsType) {

    const [data, setData] = useState<PointOfInterest>(point);
    const [errors, setErrors] = useState<FormErrors>()
    const { pointTypes } = usePointTypes();
    const { modals, open: openModal, close: closeModals } = useModals({ pointType: false });

    const validate = () => {
        const err = {};

        if (!data.name || data.name.length == 0) {
            err.name = { message: 'Please enter a name' }
        }
        if (!data.notes || data.notes.length == 0) {
            err.notes = { message: 'Please enter a short description' }
        }
        if (!data.point_type_id) {
            err.point_type_id = { message: 'Please select a category' }
        }
        
        setErrors(err);

        if (Object.keys(err).length == 0) {
            onSave(data);
        }
    }

    return (
        <View style={styles.container}>
            <Header 
                title={point.name}
                onBack={() => onBack()}
            />
            <View style={styles.form}>
                <TextInput
                    label="Name"
                    placeHolder="Name your point..."
                    value={data.name}
                    onChangeText={(text: string) => setData({...data, name: text})}
                    error={errors?.name?.message ?? undefined}
                />
                <PressInput
                    onPress={() => openModal('pointType')}
                    label="Category"
                    placeHolder="Category..."
                    value={pointTypes.find(p => p.id == data.point_type_id)?.name}
                    error={errors?.point_type_id?.message ?? undefined}
                />
                <TextArea
                    label="Notes"
                    placeHolder="Notes about your point..."
                    value={data.notes}
                    onChangeText={(text: string) => setData({...data, notes: text})}
                    error={errors?.notes?.message ?? undefined}
                />
            </View>
            <View style={styles.buttons}>
                <Button
                    onPress={() => validate()}
                    title="Save"
                />
            </View>
            {modals.pointType && (
                <PointTypeSelectorModal
                    onClose={closeModals}
                    value={data.point_type_id}
                    onSelect={(pointType: PointType) => {
                        setData({...data, point_type_id: pointType.id});
                        closeModals();
                    }}
                />
            )}
        </View>
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