import { StyleSheet, Text, View } from "react-native";
import { PointOfInterest } from "../../../types";
import { normalise } from "../../../functions/helpers";
import { COLOUR, TEXT } from "../../../styles";
import Header from "../header";
import TextInput from "../../inputs/text-input";
import { useEffect, useState } from "react";
import Button from "../../buttons/button";
import TextArea from "../../inputs/text-area";
import { ScrollView } from "react-native-actions-sheet";
import { usePointTypes } from "../../../hooks/usePointType";
import HorizontalSelect from "../../inputs/horizontal-select";

type PropsType = { point: PointOfInterest, onBack: ()=>void, onSave: (data: PointOfInterest)=>void };

export default function Edit({ point, onBack, onSave } : PropsType) {

    const [data, setData] = useState<PointOfInterest>(point);
    const { pointTypes } = usePointTypes();

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
                />
                <HorizontalSelect
                    label="Category"
                    options={pointTypes.map(p => { return {label: p.name, value: p.id, icon: p.icon} })}
                    onSelect={(id: any) => setData({...data, point_type_id: id})}
                    value={data.point_type_id}
                />
                <TextArea
                    label="Notes"
                    placeHolder="Notes about your point..."
                    value={data.notes}
                    onChangeText={(text: string) => setData({...data, notes: text})}
                />
            </View>
            <View style={styles.buttons}>
                <Button
                    onPress={() => onSave(data)}
                    title="Save"
                />
            </View>
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