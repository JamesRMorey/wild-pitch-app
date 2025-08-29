import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { View, StyleSheet, Text } from "react-native";
import { PointOfInterest } from "../../types";
import { SHEET } from "../../consts";
import { COLOUR } from "../../styles";
import { normalise } from "../../functions/helpers";
import { useEffect, useState } from "react";
import PointOfInterestNavigation from "./navigation";
import PointOfInterestDetails from "./details";

type PropsType = { id?: string, point: PointOfInterest }
export default function PointOfInterestSheet({ id=SHEET.MAP_POI_SHEET, point: poi } : PropsType) {

    const [point, setPoint] = useState<PointOfInterest>(poi)
    const [activeSection, setActiveSection] = useState<string>('details')
        
    const reset = () => {
        setActiveSection('details')
    }
    

    useEffect(() => {
        if (!poi) return;
        setPoint(poi)
    }, [poi])


    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
            onClose={() => reset()}
            defaultOverlayOpacity={0.1}
        >
            {point && (
                <View style={styles.container}>
                    {activeSection == 'navigation' ?
                    <PointOfInterestNavigation
                        point={point}
                        onBack={() => setActiveSection('details')}
                    />
                    :
                    <PointOfInterestDetails
                        point={point}
                        onUpdatePoint={(poi: PointOfInterest) => setPoint(poi)}
                        onChangeSection={(section: string) => setActiveSection(section)}
                    />
                    }
                </View>
            )}
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
        padding: 20,
    },
    container: {
        gap: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    packContainer: {
        flexDirection: 'row',
        gap: normalise(15),
        backgroundColor: COLOUR.gray[100],
        borderRadius: normalise(15),
        padding: normalise(20)
    },
    buttons: {
        alignItems: 'flex-end'
    }
});