import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { Coordinate, PositionArray } from "../types";


export class MapService {

    static areaBounds ( topRight: Position, bottomLeft: Position ) {
        const [lng1, lat1] = bottomLeft;
        const [lng2, lat2] = topRight;

        const topLeft: Position = [lng1, lat2];
        const bottomRight: Position = [lng2, lat1];

        return {
            topLeft: topLeft,
            topRight: topRight,
            bottomRight: bottomRight,
            bottomLeft: bottomLeft
        }
    }

    static squareAreaGeoJson (bounds: PositionArray) {
        
        const tr = bounds[0];
        const bl = bounds[1];
        const { topLeft, topRight, bottomLeft, bottomRight } = this.areaBounds(tr, bl);

        return {
            type: 'FeatureCollection',
            features: [
            {
                type: 'Feature',
                geometry: {
                type: 'Polygon',
                coordinates: [[
                    bottomLeft,
                    topLeft,
                    topRight,
                    bottomRight,
                    bottomLeft,
                ]],
                },
                properties: {},
            },
            ],
        };
    }

    static boundsCenter (bounds: PositionArray): Position {
        const [topRight, bottomLeft] = bounds;
        const [lng1, lat1] = bottomLeft;
        const [lng2, lat2] = topRight;

        const centerLng = (lng1 + lng2) / 2;
        const centerLat = (lat1 + lat2) / 2;

        return [centerLng, centerLat];
    }        
}