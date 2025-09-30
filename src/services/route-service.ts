import { Coordinate, Route, RouteSearchResult } from "../types";
import { getDistanceBetweenPoints } from "../functions/helpers";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { OSMaps } from "./os-maps";


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

    static async getForMapArea ( ne: Coordinate, sw: Coordinate ): Promise<Array<RouteSearchResult>> {
        const rts = await OSMaps.searchMapArea(ne, sw);
        return rts;
    }

    static boundsInsideBounds ( inner: { ne: Position, sw: Position }, outer: { ne: Position, sw: Position } ): boolean {
        return (
            inner.ne[0] <= outer.ne[0] &&
            inner.ne[1] <= outer.ne[1] &&
            inner.sw[0] >= outer.sw[0] &&
            inner.sw[1] >= outer.sw[1]
        );
    }

    static generateGPX( route: Route ): string {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
            <gpx version="1.1" creator="MyApp" xmlns="http://www.topografix.com/GPX/1/1">
                <trk>
                <name>${route.name}</name>
                <trkseg>`;

        const trkpts = route.markers
            .map(
            (p) =>
                `<trkpt lat="${p.latitude}" lon="${p.longitude}">
                <time>${new Date().toISOString()}</time>
                </trkpt>`
            )
            .join("\n");

        const footer = `
            </trkseg>
            </trk>
        </gpx>`;

        return header + trkpts + footer;
    }

    static getFileName( name: string ): string {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    static getPreviouslyPassedPointOnRoute( point: Coordinate, routePoints: Array<Coordinate> ): { coord: Coordinate, distancePast: number, index: number } {
        if (routePoints.length === 0) throw new Error('No route points provided');

        let closestIndex = 0;
        let closestDistance = getDistanceBetweenPoints(point, routePoints[closestIndex]);

        for (let i=1; i < routePoints.length; i++) {
            const p = routePoints[i];
            const d = getDistanceBetweenPoints(point, p);
            if (d < closestDistance) {
                closestDistance = d;
                closestIndex = i;
            }
        }

        const prev = routePoints[closestIndex - 1];
        const next = routePoints[closestIndex + 1];
        
        const dPrev = getDistanceBetweenPoints(point, prev);
        const dNext = getDistanceBetweenPoints(point, next);

        return dNext < dPrev ? { coord: routePoints[closestIndex], distancePast: closestDistance, index: closestIndex } : { coord: prev, distancePast: dPrev, index: closestIndex - 1 }
    }

    static getRouteDistanceToPoint( index: number, routePoints: Array<Coordinate> ): number | null {
        if (routePoints.length === 0 || index >= routePoints.length) return null;
        
        let totalDistance = 0;
        for (let i=0; i < index; i++) {
            const start = routePoints[i];
            const end = routePoints[i + 1];
            const d = getDistanceBetweenPoints(start, end);
            totalDistance += d;
        }

        return totalDistance;
    }
}