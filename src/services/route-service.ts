import { Coordinate, Route, RouteSearchResult } from "../types";
import { getDistanceBetweenPoints } from "../utils/helpers";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { OSMaps } from "./api/os-maps";
import { XMLParser } from "fast-xml-parser";
import Share from 'react-native-share';
import { GPX } from "./gpx";
import { Format } from "./formatter";

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

    static generateGPX ( route: Route ): string {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
            <gpx version="1.1" creator="WildPitch" xmlns="http://www.topografix.com/GPX/1/1">
                <metadata>
                    <name>${GPX.escapeXml(route.name)}</name>
                    <desc>${GPX.escapeXml(route.notes ?? '')}</desc>
                </metadata>
                <trk>
                <trkseg>`;

        const trkpts = route.markers
            .map((p) =>
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

    static parseGPX ( gpxString: string ): Route|void {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

        const data = parser.parse(gpxString);
        console.log(data);
        const markers = data.gpx.trk.trkseg.trkpt?.map((p) => ({ latitude: parseFloat(p.lat), longitude: parseFloat(p.lon) }));

        if (markers.length == 0) return;

        return {
            name: data.gpx?.metadata?.name ?? `New Route - ${Format.dateToDateTime(new Date())}`,
            notes: data.gpx?.metadata?.desc ?? null,
            markers: markers,
            latitude: markers[0].latitude,
            longitude: markers[0].longitude,
            elevation_gain: data.gpx?.metadata?.elevation_gain?.length ? parseFloat(data.gpx.metadata.elevation_gain) : undefined,
            elevation_loss: data.gpx?.metadata?.elevation_loss?.length ? parseFloat(data.gpx.metadata.elevation_loss) : undefined,
            distance: this.calculateDistance(markers),
        }
    }

    static getFileName ( name: string ): string {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    static getPreviouslyPassedPointOnRoute ( point: Coordinate, routePoints: Array<Coordinate> ): { coord: Coordinate, distancePast: number, index: number } {
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
        if (routePoints.length === 0 || index > routePoints.length) return null;
        
        let totalDistance = 0;
        for (let i=0; i <= index; i++) {
            const start = routePoints[i];
            const end = routePoints[i + 1] ? routePoints[i + 1] : start;
            const d = getDistanceBetweenPoints(start, end);
            totalDistance += d;
        }

        return totalDistance;
    }

    static async share ( route: Route, message: string = `Here\'s a GPX file for a route I've plotted on Wild Pitch Maps` ) {
        this.export(route, message);
    }

    static async export ( route: Route, message?: string ) {
        const gpx = this.generateGPX(route);
        const fileName = `${this.getFileName(route.name)}.gpx`;

        const path = await GPX.export(gpx, fileName);

        await Share.open({
            title: "Share Route GPX",
            url: "file://" + path,
            type: "application/gpx+xml",
            message: message,
        });
    }
}


// ${route.elevation_gain ? `<elevation_gain>${route.elevation_gain}</elevation_gain>` : ''}
// ${route.elevation_loss ? `<elevation_loss>${route.elevation_loss}</elevation_loss>` : ''}