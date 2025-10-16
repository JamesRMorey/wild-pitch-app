import { Coordinate, PointOfInterest, Route } from '../../types';
import { useEffect, useState } from 'react';
import { EventBus } from '../../services/event-bus';
import { array, number, object, string } from "yup";
import { RouteRepository } from '../../database/repositories/route-repository';
import { OSMaps } from '../../services/api/os-maps';
import { useGlobalState } from '../../contexts/global-context';

const schema = object({
    name: string().required("Name is required"),
    notes: string().optional().nullable(),
    markers: array().required("Markers are required"),
    latitude: number().required("Latitude is required"),
    longitude: number().required("Longitude is required"),
    distance: number().optional().nullable(),
    elevation_gain: number().optional().nullable(),
    elevation_loss: number().optional().nullable(),
});

export function useRoutes() {

    const { user }  = useGlobalState();
    const [routes, setRoutes] = useState<Array<Route>>([]);
    const repo = new RouteRepository(user.id);

    const get = (): void => {
        const data = repo.get() ?? [];
        setRoutes(data);
    }

    const create = async ( data: any ): Promise<Route|void> => {
        return new Promise(async (resolve, reject) => {
            try {
                await schema.validate(data, { abortEarly: false });
                const newRoute = repo.create(data);

                if (!newRoute) return resolve();
                get();
                
                return resolve(newRoute);
            }
            catch (error) {
                return reject(error);
            }
        });
    }

    const update = async ( id: number, data: Route ): Promise<Route|void> => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.id) return reject();

                await schema.validate(data, { abortEarly: false });
                const newPoint = repo.update(id, data);

                if (!newPoint) return resolve();
                get();

                return resolve(newPoint);
            }
            catch (error) {
                return reject(error);
            }
        });
    }

    const find = ( id: number ): Route|void => {
        try {
            const point = repo.find(id);
            if (!point) return;

            return point;
        }
        catch (err) {
            return;
        }
    }

    const findByLatLng = ( latitude: number, longitude: number ): Route|undefined => {
        try {
            const route = repo.findByLatLng(latitude, longitude);
            if (!route) return;

            return route;
        }
        catch (err) {
            return;
        }
    }

    const remove = ( id: number ) => {
        if (!id) return;
        
        repo.delete(id);
        get();
    }

    useEffect(() => {
        get();
    }, [])

    return { 
        routes,
        get,
        find,
        findByLatLng,
        create,
        update,
        remove,
    };
}
