import Mapbox from "@rnmapbox/maps";
import { COLOUR } from "../../styles";
import { Coordinate } from "../../types";
import PointOfInterestMarker from "../map/map-marker";
import { ASSET, SETTING } from "../../consts";
import { useEffect, useState } from "react";

type PropsType = { start: Coordinate, end: Coordinate, markers: Array<Coordinate>, lineKey: number };
export default function RouteLine({ start, end, markers, lineKey } : PropsType) {

    const [ready, setReady] = useState(false);
    const [line, setLine] = useState<any>({
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: markers.map(m => [m.longitude, m.latitude])
            }
        }]
    });

    const updateLine = ( markers: Array<Coordinate> ) => {
        setLine({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: markers.map(m => [m.longitude, m.latitude])
                }
            }]
        });
    }


    useEffect(() => {
        updateLine(markers);
        setReady(true); // without this it crashes on first load
    }, [markers])

    return (
        <>
            {(start && end) && (
                <>
                    <PointOfInterestMarker
                        coordinate={[start.longitude, start.latitude]}
                        icon={'location'}
                        colour={COLOUR.blue[500]}
                        disabled={true}
                    />
                    <PointOfInterestMarker
                        coordinate={[end.longitude, end.latitude]}
                        icon={'flag'}
                        colour={COLOUR.blue[500]}
                        disabled={true}
                    />
                </>
            )}
            {ready && markers && markers.length >= 2 && (
                <Mapbox.ShapeSource id={`lineSource-${lineKey}`} shape={line}>
                    <Mapbox.LineLayer
                        id={`lineLayer-${lineKey}`}
                        style={{
                            lineColor: SETTING.ROUTE_LINE_COLOUR,
                            lineWidth: 12,
                            lineOpacity: 0.9,
                            lineCap: 'round',
                            lineJoin: 'round'

                        }}
                    />
                    <Mapbox.SymbolLayer
                        id={`arrowLayer-${lineKey}`}
                        style={{
                            symbolPlacement: "line",
                            iconImage: "arrow",
                            iconSize: 0.4,
                            iconAllowOverlap: true,
                            iconIgnorePlacement: true,
                            symbolSpacing: 60,
                        }}
                    />
                    <Mapbox.LineLayer 
                        id={`dashedLayer-${lineKey}`} 
                        style={{
                            lineColor: "white",
                            lineWidth: 1.5,
                            lineDasharray: [4, 4],
                            lineCap: "round",
                            lineJoin: "round",
                        }}
                    />
                </Mapbox.ShapeSource>
            )}
        </>
    )
}