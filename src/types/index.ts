import Mapbox from "@rnmapbox/maps";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import type { ImageSourcePropType } from "react-native";

export type Coordinate = [number, number];

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
    name: string,
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
    latitude: number,
    longitude: number,
    name: string,
    notes?: string,
    point_type_id?: number,
    point_type?: PointType
    id?: number
}

export type PointType = {
    id: number,
    name: string,
    icon: string,
    colour: string
}