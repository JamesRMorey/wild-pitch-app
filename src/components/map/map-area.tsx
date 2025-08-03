import Mapbox from "@rnmapbox/maps";
import { Coordinate, PositionArray } from "../../types";
import { MapService } from "../../services/map-service";
import { useEffect, useState } from "react";


export default function MapArea({ id, bounds, onPress=()=>{} } : { id: string, bounds: PositionArray, onPress?: Function }) {
    
    const [areaGeoJson, setAreaGeoJson] = useState(MapService.squareAreaGeoJson(bounds));

    useEffect(() => {
        setAreaGeoJson(MapService.squareAreaGeoJson(bounds));
    }, [bounds])

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