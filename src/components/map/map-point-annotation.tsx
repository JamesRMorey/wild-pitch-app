import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import Mapbox from "@rnmapbox/maps";
import { COLOUR } from "../../styles";
import { normalise } from "../../utils/helpers";
import Icon from "../misc/icon";


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
                icon='move'
                size={normalise(40)}
                colour={COLOUR.black}
            />
        </Mapbox.PointAnnotation>
    )
}