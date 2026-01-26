import { array, number, object, string } from "yup";

export const routeSchema = object({
    name: string().required("Name is required"),
    type: string().required("Type is required"),
    difficulty: string().required("Difficlity is required"),
    notes: string().optional().nullable(),
    markers: array().required("Markers are required"),
    latitude: number().required("Latitude is required"),
    longitude: number().required("Longitude is required"),
    distance: number().optional().nullable(),
    elevation_gain: number().optional().nullable(),
    elevation_loss: number().optional().nullable(),
});

export const mapPackSchema = object({
    name: string().required("Name is required"),
    key: string().required("Key is required"),
    description: string().required("Description is required"),
});

export const pointOfInterestSchema = object({
    name: string().required("Name is required"),
    point_type_id: string().required("Category is required"),
    notes: string().optional(),
    latitude: number().required("Latitude is required"),
    longitude: number().required("Longitude is required"),
});