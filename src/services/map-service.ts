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

    static relativeBearing( start: Coordinate, end: Coordinate ): number {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;

        const dLon = toRad(end.longitude - start.longitude);
        const lat1 = toRad(start.latitude);
        const lat2 = toRad(end.latitude);

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        const bearing = toDeg(Math.atan2(y, x));
        return (bearing + 360) % 360;
    }

    static async getPointElevation ( point: Coordinate ): Promise<number|null> {
        const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${point.latitude},${point.longitude}`);
        const data = await response.json();

        return data.results[0]?.elevation ?? null;
    }
}