import { ROUTE_ENTRY_TYPE, ROUTE_STATUS } from '../consts/enums';
import { Coordinate, Route as RouteType } from '../types';

export class Route {
    id?: number;
    server_id?: number;
    user_id: number;
    name: string;
    notes?: string;
    markers: Array<Coordinate>;
    latitude: number;
    longitude: number;
    distance?: number;
    elevation_gain?: number;
    elevation_loss?: number;
    created_at?: string;
    updated_at?: string;
    published_at?: string;
    status: ROUTE_STATUS;
    entry_type: ROUTE_ENTRY_TYPE;
    user?: { id: number; name: string };

    constructor (data: RouteType) {
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
        this.user_id = data.user_id;
        this.user = data.user;
    }

    isBookmark (): boolean {
        return this.entry_type == ROUTE_ENTRY_TYPE.BOOKMARK;
    }

    isBookmarked ( existingBookmarks: Array<RouteType>): boolean {
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

    isDownloaded (): boolean {
        return true;
    }

    toJSON (): RouteType {
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
        };
    }
}