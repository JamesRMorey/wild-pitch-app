import Mapbox from "@rnmapbox/maps";
import { PositionArray } from "../../types";
import { MapService } from "../../services/map-service";
import { useMemo } from "react";


export default function MapArea({ id, bounds, onPress=()=>{} } : { id: string, bounds: PositionArray, onPress?: Function }) {
    
    const areaGeoJson= useMemo(() => MapService.squareAreaGeoJson(bounds), [bounds]);

    return (
        <Mapbox.ShapeSource 
            id={id}
            shape={areaGeoJson}
            onPress={() => onPress()}
        >
            <Mapbox.FillLayer
                id="square-fill"
                style={{
                    fillColor: 'rgba(0, 150, 255, 0.3)',
                    fillOutlineColor: '#007AFF',
                }}
            />
        </Mapbox.ShapeSource>
    )
}