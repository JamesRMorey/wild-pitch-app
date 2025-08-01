import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { MarkerType } from "../../types";
import Mapbox from "@rnmapbox/maps";
import { Ionicons as Icon } from "@react-native-vector-icons/ionicons";
import { COLOUR } from "../../styles";


export default function MapMarker ({ coordinate, type } : { coordinate: Position, type: MarkerType }) {

    if (!coordinate) return;
    return (
        <Mapbox.MarkerView
            coordinate={coordinate}
            allowOverlapWithPuck={true}
            anchor={{ x: 0.5, y: 0.5 }}
        >
            <Icon
                name='flag'
                size={30}
                color={COLOUR.red[500]}
            />
        </Mapbox.MarkerView>
    )
}