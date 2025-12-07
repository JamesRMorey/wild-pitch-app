import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import Mapbox from "@rnmapbox/maps";
import { COLOUR, SHADOW } from "../../styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import { normalise } from "../../utils/helpers";
import useHaptic from "../../hooks/useHaptic";
import { SETTING } from "../../consts";

type PropsType = { coordinate: Position, colour?: string, onPress?: Function, onDragEnd?: Function }

export default function RouteMarker ({ coordinate, colour=SETTING.ROUTE_LINE_COLOUR, onPress=()=>{}, onDragEnd=()=>{} } : PropsType ) {

    const { tick } = useHaptic();

    return (
        <Mapbox.PointAnnotation
            id={`route-marker-${coordinate[0]}-${coordinate[1]}`}
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            onDragEnd={(e) => onDragEnd(e)}
            onDragStart={() => tick()}
            draggable={true}
        >
            <TouchableOpacity
                onPress={() => onPress()}
                style={[
                    styles.container,
                    { backgroundColor: colour }
                ]}
            >
            </TouchableOpacity>
        </Mapbox.PointAnnotation>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalise(30),
        width: normalise(15),
        height: normalise(15),
        borderColor: COLOUR.white,
        ...SHADOW.sm
    }
})