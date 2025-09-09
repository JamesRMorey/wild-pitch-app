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
    id: number,
    name: string,
    key: string,
    description: string,
    bounds: PositionArray,
    minZoom: number,
    maxZoom: number,
    center: Position,
    packs: Array<{
        name: string,
        styleURL: Mapbox.StyleURL,
        size: number
    }>
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

export type PointOfInterest = {
    created_at?: string,
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

export type Route = {
    id?: number,
    name: string,
    notes?: string,
    markers: Array<Coordinate>,
    latitude: number,
    longitude: number,
    distance?: number,
    elevation_gain?: number,
    elevation_loss?: number,
    created_at?: string,
}

export type RouteSearchResult = {
    id: string,
    name: string,
    slug: string,
    latitude: number,
    longitude: number,
    distance?: number,
    elevation_gain?: number,
    elevation_loss?: number,
    created_at?: string,
}