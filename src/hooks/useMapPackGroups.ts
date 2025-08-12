import { MapPackGroup } from '../types';
import { useEffect, useState } from 'react';
import { MapPackGroupRepository } from '../database/repositories/map-pack-group-repository';

export function useMapPackGroups() {

    const [mapPackGroups, setMapPackGroups] = useState<Array<MapPackGroup>>([]);
    const repo = new MapPackGroupRepository();

    const get = async (): Promise<void> => {
        const groups = await repo.get();
        console.log(groups);
        setMapPackGroups(groups);
    }

    const create = ( data: MapPackGroup ): MapPackGroup|void => {
        const newGroup = repo.create(data);

        if (!newGroup) return;

        get();
        return newGroup;
    }

    // const update = ( data: PointOfInterest ): PointOfInterest|void => {
    //     if (!data.id) return;
    //     const newPoint = repo.update(data.id, data);

    //     if (!newPoint) return;

    //     get();
    //     return newPoint;
    // }

    // const remove = ( id: number ) => {
    //     if (!id) return;
        
    //     repo.delete(id);
    //     get();
    // }


    useEffect(() => {
        get();
    }, [])

    return { 
        mapPackGroups,
        get,
    };
}
