import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import Mapbox from "@rnmapbox/maps";
import { COLOUR, SHADOW } from "../../styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import { normalise } from "../../functions/helpers";
import Icon from "../misc/icon";

type PropsType = { coordinate: Position, icon: string, colour: string, onPress?: Function }

export default function PointOfInterestMarker ({ coordinate, icon='flag', colour=COLOUR.red[500], onPress=()=>{} } : PropsType ) {

    if (!coordinate) return;
    return (
        <Mapbox.MarkerView
            coordinate={coordinate}
            allowOverlapWithPuck={true}
            anchor={{ x: 0.5, y: 0.5 }}
        >
            <TouchableOpacity
                onPress={() => onPress()}
                style={[
                    styles.container,
                    { backgroundColor: colour }
                ]}
            >
                <Icon
                    icon={icon}
                    size={18}
                    colour={COLOUR.white}
                />
            </TouchableOpacity>
        </Mapbox.MarkerView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOUR.red[500],
        borderWidth: normalise(2),
        borderRadius: normalise(30),
        width: normalise(35),
        height: normalise(35),
        borderColor: COLOUR.white,
        ...SHADOW.sm
    }
})