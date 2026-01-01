import React, { createContext,useContext, useEffect, useState } from 'react';
import { MapPackGroup } from '../types';
import Mapbox from '@rnmapbox/maps';
import { useGlobalState } from './global-context';
import { MapPackGroupRepository } from '../database/repositories/map-pack-group-repository';
import { mapPackSchema as schema } from '../utils/schema';

type MapPackGroupsContextState = {
    mapPackGroups: Array<MapPackGroup>
};

type MapPackGroupsContextActions = {
    get: ()=>Promise<void>
    create: (data: MapPackGroup)=>Promise<MapPackGroup|void>,
    remove: (id: number)=>void,
    find: (id: number)=>void,
};

const StateContext = createContext<MapPackGroupsContextState | undefined>(undefined);
const ActionsContext = createContext<MapPackGroupsContextActions | undefined>(undefined);

export const MapPackGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { user } = useGlobalState();
    const [mapPackGroups, setMapPackGroups] = useState<Array<MapPackGroup>>([]);
    const repo = new MapPackGroupRepository(user?.id);

    const get = async (): Promise<void> => {
        if (!user) return;
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
    

    return (
        <StateContext.Provider
            value={{
                mapPackGroups,
            }}
        >
            <ActionsContext.Provider
                value={{
                    get,
                    create,
                    remove,
                    find,
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const useMapPackGroupsState = (): MapPackGroupsContextState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useMapPackGroupsState must be used within a MapPackGroupsProvider');
    return context;
};

export const useMapPackGroupsActions = (): MapPackGroupsContextActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('useMapPackGroupsActions must be used within a MapPackGroupsProvider');
    return context;
};
