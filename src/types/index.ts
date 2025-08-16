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
    latitude: number,
    longitude: number,
    point_type_id?: number,
    point_type?: PointType,
    notes?: string,
    name: string,
    id?: number,
}

export type FormErrors = {
    [key: string]: {
        message: string
    }
}

export type PointType = {
    id: number,
    name: string,
    colour: string,
    icon: string
}