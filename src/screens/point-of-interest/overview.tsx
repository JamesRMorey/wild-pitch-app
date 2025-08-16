import { StyleSheet, Text, View, TouchableOpacity, Linking, Share } from "react-native"
import { COLOUR, OPACITY, TEXT } from "../../styles"
import { normalise } from "../../functions/helpers";
import { PointOfInterest } from "../../types";
import { useState } from "react";
import PointOfInterestNavigation from "./navigation";
import PointOfInterestDetails from "./details";

type PropsType = { navigation: any, route: any }
export default function PointOfInterestOverviewScreen({ navigation, route } : PropsType) {

    const { point: paramsPoint } = route.params;
    const [point, setPoint] = useState<PointOfInterest>(paramsPoint)
    const [activeSection, setActiveSection] = useState<string>('details')
    

    return (
        <View style={styles.container}>
            {activeSection == 'navigation' ?
            <PointOfInterestNavigation
                point={point}
            />
            :
            <PointOfInterestDetails
                point={point}
                onChangeSection={(section: string) => setActiveSection(section)}
            />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(20),
        paddingBottom: 0
    },
    topContainer: {
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomContainer: {
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
    },
    notes: {
        ...TEXT.sm,
        marginBottom: normalise(5)
    },
    latlng: {
        ...TEXT.sm, 
        ...TEXT.medium,
        textDecorationLine: 'underline'
    }
});