import { Coordinate } from "../types";
import { getDistanceBetweenPoints } from "../functions/helpers";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";


export class RouteService {

    static calculateDistance ( markers: Array<Coordinate> ): number {
        if (markers.length < 2) return 0;
        let totalDistance = 0;
        for ( let i = 0; i < markers.length - 1; i++ ) {
            const start = markers[i];
            const end = markers[i + 1];
            const d = getDistanceBetweenPoints(start, end);
            totalDistance += d;
        }
        return totalDistance;
    }

    static calculateBoundingBox ( markers: Array<Coordinate> ): { ne: Position, sw: Position } | null {
        if (markers.length === 0) return null;

        const lats = markers.map(marker => marker.latitude);
        const lngs = markers.map(marker => marker.longitude);

        const ne: Position = [Math.max(...lngs), Math.max(...lats)];
        const sw: Position = [Math.min(...lngs), Math.min(...lats)];

        return { ne, sw };
    }

    static getBounds ( markers: Array<Coordinate> ): [Position, Position] {
        const bbox = this.calculateBoundingBox(markers);
        
        return [bbox.sw, bbox.ne];
    }
}