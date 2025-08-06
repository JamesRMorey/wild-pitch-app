import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { PointOfInterest, PointOfInterestSheetSection } from "../../types";
import { SHEET } from "../../consts";
import { COLOUR, OPACITY } from "../../styles";
import { normalise } from "../../functions/helpers";
import { useState } from "react";
import Details from "./details";
import OverView from "./overview";
import Edit from "./edit";

type PropsType = { id?: string, pointOfInterest: PointOfInterest|undefined, onSave?: Function, onUpdate?: Function, onDelete?: Function, onClose?: Function };

export default function MapPointOfInterestSheet ({ id=SHEET.MAP_MARKER, pointOfInterest, onSave=(point: PointOfInterest)=>{}, onUpdate=(point: PointOfInterest)=>{}, onDelete=(point: PointOfInterest)=>{}, onClose=()=>{} } : PropsType ) {

    const [activeSection, setActiveSection] = useState<PointOfInterestSheetSection>()
    

    const save = ( data: PointOfInterest ) => {
        if (data.id) {
            onUpdate(data);
        }
        else {
            onSave(data)
        }
        setActiveSection(undefined);
    }

    const close = () => {
        SheetManager.hide(id);
    }


    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
            onClose={() => onClose()}
            onBeforeClose={() => setActiveSection(undefined)}
        >
            {pointOfInterest && (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        {activeSection == 'details' ? 
                        <Details 
                            point={pointOfInterest}
                            onBack={() => setActiveSection(undefined)}
                        />    
                        :activeSection == 'edit' ?
                        <Edit
                            point={pointOfInterest}
                            onBack={() => setActiveSection(undefined)}
                            onSave={(data: PointOfInterest) => save(data)}
                        />
                        :
                        <OverView 
                            point={pointOfInterest}
                            onSeeDetails={() => setActiveSection('details')}
                            onEdit={() => setActiveSection('edit')}
                            onDelete={() => onDelete(pointOfInterest)}
                        />
                        }
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            )}
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
    },
    container: {
        
    },
    topContainer: {
        padding: normalise(20)
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomContainer: {
        padding: normalise(20),
        backgroundColor: COLOUR.gray[100],
        paddingBottom: normalise(35),
        paddingTop: normalise(5)
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalise(20),
        borderBottomWidth: normalise(1),
        borderBottomColor: COLOUR.black + OPACITY[20]
    },
    optionNameContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'center'
    },
    buttons: {
        paddingTop: normalise(20)
    }
});