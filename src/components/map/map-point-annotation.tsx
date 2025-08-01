import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { MarkerType } from "../../types";
import Mapbox from "@rnmapbox/maps";
import { Ionicons as Icon } from "@react-native-vector-icons/ionicons";
import { COLOUR } from "../../styles";
import { normalise } from "../../functions/helpers";


export default function MapPointAnnotation ({ id, coordinate, draggable=false, onDrag=()=>{}, onDragStart=()=>{}, onDragEnd=()=>{} } : { id: string, coordinate: Position, draggable?: boolean, onDrag?: Function, onDragStart?: Function, onDragEnd?: Function }) {

    if (!coordinate) return;
    return (
        <Mapbox.PointAnnotation
            id={id}
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            draggable={draggable}
            onDrag={(e) => onDrag(e)}
            onDragEnd={(e) => onDragEnd(e)}
            onDragStart={(e) => onDragStart(e)}
        >
            <Icon
                name='move'
                size={normalise(40)}
                color={COLOUR.black}
            />
        </Mapbox.PointAnnotation>
    )
}