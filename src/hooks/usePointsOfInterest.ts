import Mapbox from '@rnmapbox/maps';
import { Coordinate, MapPackGroup, PointOfInterest } from '../types';
import { useEffect, useState } from 'react';
import { PointOfInterestRepository } from '../database/repositories/points-of-interest-repository';
import { EventBus } from '../services/event-bus';

export function usePointsOfInterest() {

    const [pointsOfInterest, setPointsOfInterest] = useState<Array<PointOfInterest>>([]);
    const repo = new PointOfInterestRepository();

    const get = (): void => {
        const points = repo.get() ?? [];
        setPointsOfInterest(points);
    }

    const create = ( data: PointOfInterest ): PointOfInterest|void => {
        const newPoint = repo.create(data);

        if (!newPoint) return;
        EventBus.emit.poiRefresh();

        return newPoint;
    }

    const update = ( data: PointOfInterest ): PointOfInterest|void => {
        if (!data.id) return;
        const newPoint = repo.update(data.id, data);
        
        if (!newPoint) return;
        EventBus.emit.poiRefresh();

        return newPoint;
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
        create,
        update,
        remove
    };
}
