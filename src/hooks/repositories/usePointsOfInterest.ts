import { PointOfInterest } from '../../types';
import { useEffect, useState } from 'react';
import { PointOfInterestRepository } from '../../database/repositories/points-of-interest-repository';
import { EventBus } from '../../services/event-bus';
import { number, object, string } from "yup";

const schema = object({
    name: string().required("Name is required"),
    point_type_id: string().required("Category is required"),
    notes: string().optional(),
    latitude: number().required("Latitude is required"),
    longitude: number().required("Longitude is required"),
});

export function usePointsOfInterest() {

    const [pointsOfInterest, setPointsOfInterest] = useState<Array<PointOfInterest>>([]);
    const repo = new PointOfInterestRepository();

    const get = (): void => {
        const points = repo.get() ?? [];
        setPointsOfInterest(points);
    }

    const create = async ( data: PointOfInterest ): Promise<PointOfInterest|void> => {
        return new Promise(async (resolve, reject) => {
            try {
                await schema.validate(data, { abortEarly: false });
                const newPoint = repo.create(data,);

                if (!newPoint) return resolve();
                EventBus.emit.poiRefresh();

                return resolve(newPoint);
            }
            catch (error) {
                return reject(error);
            }
        });
    }

    const update = async ( data: PointOfInterest ): Promise<PointOfInterest|void> => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.id) return reject();

                await schema.validate(data, { abortEarly: false });
                const newPoint = repo.update(data.id, data);

                if (!newPoint) return resolve();
                EventBus.emit.poiRefresh();

                return resolve(newPoint);
            }
            catch (error) {
                return reject(error);
            }
        });
    }

    const find = ( id: number ): PointOfInterest|void => {
        try {
            const point = repo.find(id);
            if (!point) return;

            return point;
        }
        catch (err) {
            return;
        }
    }

    const findByLatLng = ( latitude: number, longitude: number ): PointOfInterest|void => {
        try {
            const point = repo.findByLatLng(latitude, longitude);
            if (!point) return;

            return point;
        }
        catch (err) {
            return;
        }
    }

    const remove = ( id: number ) => {
        if (!id) return;
        
        repo.delete(id);
        EventBus.emit.poiRefresh();
    }


    useEffect(() => {
        const getListener = EventBus.listen.poiRefresh(() => get());
        get();

        return () => {
            getListener.remove();
        }
    }, [])

    return { 
        pointsOfInterest,
        get,
        find,
        findByLatLng,
        create,
        update,
        remove
    };
}
