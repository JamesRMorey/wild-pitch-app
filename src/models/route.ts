import Mapbox from '@rnmapbox/maps';
import { CREATION_TYPE, ROUTE_DIFFICULTY, ROUTE_ENTRY_TYPE, ROUTE_STATUS, ROUTE_TYPE } from '../consts/enums';
import { GPX } from '../services/gpx';
import { MapPackService } from '../services/map-pack-service';
import { RouteService } from '../services/route-service';
import { Coordinate, MapPack, RouteData } from '../types';
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import Share from 'react-native-share';
import { SETTING } from '../consts';

export class Route {
    id?: number;
    server_id?: number;
    user_id?: number;
    name: string;
    notes?: string;
    markers: Array<Coordinate>;
    latitude: number;
    longitude: number;
    distance?: number;
    elevation_gain?: number;
    elevation_loss?: number;
    created_at: string;
    updated_at: string;
    published_at?: string;
    status: ROUTE_STATUS;
    entry_type: ROUTE_ENTRY_TYPE;
    user?: { id: number; name: string };
    type: ROUTE_TYPE;
    difficulty: ROUTE_DIFFICULTY;
    creation_type: CREATION_TYPE;

    constructor (data: RouteData) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.name = data.name;
        this.notes = data.notes;
        this.markers = data.markers;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.distance = data.distance;
        this.elevation_gain = data.elevation_gain;
        this.elevation_loss = data.elevation_loss;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.published_at = data.published_at;
        this.status = data.status;
        this.server_id = data.server_id;
        this.entry_type = data.entry_type || 'ROUTE';
        this.user = data.user;
        this.type = data.type;
        this.difficulty = data.difficulty;
        this.creation_type = data.creation_type;
    }

    isBookmark (): boolean {
        return this.entry_type == ROUTE_ENTRY_TYPE.BOOKMARK;
    }

    isBookmarked ( existingBookmarks: Array<RouteData>): boolean {
        return existingBookmarks.find((r) => r.entry_type == ROUTE_ENTRY_TYPE.BOOKMARK && r.server_id == this.server_id) ? true : false;
    }

    getDistanceInKm(): string {
        if (!this.distance) return '0 km';
        return `${(this.distance / 1000).toFixed(2)} km`;
    }

    getElevationGainInM (): string {
        if (!this.elevation_gain) return '0 m';
        return `${this.elevation_gain.toFixed(2)} m`;
    }

    getElevationLossInM (): string {
        if (!this.elevation_loss) return '0 m';
        return `${this.elevation_loss.toFixed(2)} m`;
    }

    isPublic (): boolean {
        return this.server_id != null && this.server_id != undefined && this.status == ROUTE_STATUS.PUBLIC;
    }

    isPrivate (): boolean {
        return this.status === ROUTE_STATUS.PRIVATE;
    }

    isOwnedByUser (userId: number): boolean {
        return this.user_id === userId && this.entry_type == ROUTE_ENTRY_TYPE.ROUTE;
    }

    async isDownloaded (): Promise<boolean> {
        return await MapPackService.getPack(this.getMapPackName()) ? true : false;
    }

    isImport (): boolean {
        return this.creation_type == CREATION_TYPE.IMPORTED;
    }

    calculateBoundingBox (): { ne: Position, sw: Position } | null {
        return RouteService.calculateBoundingBox(this.markers);
    }

    getFileName (): string {
        return this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    getMapPackName (): string {
        return MapPackService.getPackName(this.name, Mapbox.StyleURL.Outdoors);
    }

    getBounds (): [Position, Position] {
        const bbox = this.calculateBoundingBox();
        if (!bbox) return null; 

        return [bbox.sw, bbox.ne];
    }

    getMapPack (): MapPack {
        return {
            name: this.getMapPackName(),
            styleURL: Mapbox.StyleURL.Outdoors,
            minZoom: SETTING.MAP_PACK_MIN_ZOOM,
            maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
            bounds: this.getBounds()
        }
    }

    generateGPX (): string {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
            <gpx version="1.1" creator="WildPitch" xmlns="http://www.topografix.com/GPX/1/1">
                <metadata>
                    <name>${GPX.escapeXml(this.name)}</name>
                    <desc>${GPX.escapeXml(this.notes ?? '')}</desc>
                    <difficulty>${GPX.escapeXml(this.difficulty ?? '')}</desc>
                    <type>${GPX.escapeXml(this.type ?? '')}</desc>
                </metadata>
                <trk>
                <trkseg>`;

        const trkpts = this.markers
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

    async export ( message: string = `Here\'s a GPX file for a route I've plotted on Wild Pitch Maps` ) {
        const gpx = this.generateGPX();
        const fileName = `${this.getFileName()}.gpx`;

        const path = await GPX.export(gpx, fileName);

        await Share.open({
            title: "Share Route GPX",
            url: "file://" + path,
            type: "application/gpx+xml",
            message: message,
        });
    } 
    

    toJSON (): RouteData {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            notes: this.notes,
            markers: this.markers,
            latitude: this.latitude,
            longitude: this.longitude,
            distance: this.distance,
            elevation_gain: this.elevation_gain,
            elevation_loss: this.elevation_loss,
            created_at: this.created_at,
            updated_at: this.updated_at,
            published_at: this.published_at,
            status: this.status,
            server_id: this.server_id,
            entry_type: this.entry_type,
            user: this.user,
            difficulty: this.difficulty,
            type: this.type,
            creation_type: this.creation_type
        };
    }
}