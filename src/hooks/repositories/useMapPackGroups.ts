import { MapPackGroup } from '../../types';
import { useEffect, useState } from 'react';
import { MapPackGroupRepository } from '../../database/repositories/map-pack-group-repository';
import Mapbox from '@rnmapbox/maps';
import { object, string } from "yup";
import { useGlobalState } from '../../contexts/global-context';

const schema = object({
    name: string().required("Name is required"),
    key: string().required("Key is required"),
    description: string().required("Description is required"),
});

export function useMapPackGroups() {

    const { user } = useGlobalState();
    const [mapPackGroups, setMapPackGroups] = useState<Array<MapPackGroup>>([]);
    const repo = new MapPackGroupRepository(user.id);

    const get = async (): Promise<void> => {
        const groups = await repo.get();
        setMapPackGroups(groups);
    }

    const create = ( data: MapPackGroup ): Promise<MapPackGroup|void> => {
        return new Promise(async (resolve, reject) => {
            try {
                await schema.validate(data, { abortEarly: false });
                const newGroup = repo.create(data);

                if (!newGroup) return;
                get();

                return resolve(newGroup);
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    const find = ( id: number ): MapPackGroup|void => {
        const mapPackGroup = repo.find(id);

        return mapPackGroup;
    }

    // const update = ( data: PointOfInterest ): PointOfInterest|void => {
    //     if (!data.id) return;
    //     const newPoint = repo.update(data.id, data);

    //     if (!newPoint) return;

    //     get();
    //     return newPoint;
    // }

    const remove = async ( id: number ) => {
        if (!id) return;
        
        const packGroup = find(id);
        if (!packGroup) return;

        await Promise.all(packGroup.packs.map(p => Mapbox.offlineManager.deletePack(p.name)));

        repo.delete(id);
        get();
    }


    useEffect(() => {
        get();
    }, [])


    return { 
        mapPackGroups,
        get,
        find,
        create,
        remove
    };
}
