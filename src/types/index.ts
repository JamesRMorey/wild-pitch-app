import Mapbox from "@rnmapbox/maps";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import type { ImageSourcePropType } from "react-native";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type PositionArray = [Position, Position];

export type MapPack = {
    name: string,
    styleURL: string,
    minZoom: number,
    maxZoom: number,
    bounds: PositionArray
}

export type MapStyle = {
    styleURL: Mapbox.StyleURL,
    image: ImageSourcePropType,
    name: string
}

export type MapPackGroup = {
    id?: number,
    name: string,
    key: string,
    description: string,
    bounds: PositionArray,
    minZoom: number,
    maxZoom: number,
    center: Position,
    packs: Array<{
        name: string,
        styleURL: Mapbox.StyleURL
    }>,
    created_at?: string,
    updated_at?: string,
}

export type MapSetting = {
    label: string,
    active: boolean
}

export type MapMarker = {
    coordinate: Position,
    type: MarkerType
}

export type MarkerType = 'route'|'area'|'poi'

export type PointOfInterestSheetSection = 'details'|'edit'|'save'|undefined

export type Migration = {
    id: number;
    name: string;
}

export type DbMigration = {
    name: string;
    query: string;
}

export type PointOfInterest = {
    created_at?: string,
    updated_at?: string,
    elevation?: number,
    latitude: number,
    longitude: number,
    point_type_id?: number,
    point_type?: PointType,
    notes?: string,
    name: string,
    id?: number,
}

export type FormErrors = {
    [key: string]: Array<string>
}

export type PointType = {
    id: number,
    name: string,
    colour: string,
    icon: string
}

export type Place = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    category: string,
    address: string,
    point_type?: PointType
}

export type PublicUser = {
    id: number;
    name: string;
}

export type Route = {
    id?: number,
    user_id?: number;
    name: string,
    notes?: string,
    markers: Array<Coordinate>,
    latitude: number,
    longitude: number,
    distance?: number,
    elevation_gain?: number,
    elevation_loss?: number,
    created_at?: string,
    updated_at?: string,
    published_at?: string,
    status?: RouteStatus,
    server_id?: number,
    user?: PublicUser,
}

export type RouteStatus = 'PRIVATE'|'PUBLIC'

export type RouteSearchResult = {
    server_id: string;
    name: string,
    slug: string,
    latitude: number,
    longitude: number,
    distance?: number,
    elevation_gain?: number,
    elevation_loss?: number;
    user: PublicUser
}

export type Bounds = {
    ne: [number, number], 
    sw: [number, number]
}

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export type Colour = {
    "50": string,
    "100": string,
    "200": string,
    "300": string,
    "400": string,
    "500": string,
    "600": string,
    "700": string,
    "800": string,
    "900": string,
}