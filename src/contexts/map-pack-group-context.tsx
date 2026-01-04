import React, { createContext,useContext, useEffect, useState } from 'react';
import { MapPackGroup } from '../types';
import { useGlobalState } from './global-context';
import { MapPackGroupRepository } from '../database/repositories/map-pack-group-repository';
import { mapPackSchema as schema } from '../utils/schema';
import { MapPackService } from '../services/map-pack-service';

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
        const groups = repo.get();
        setMapPackGroups(groups);
    }

    const create = async ( data: MapPackGroup ): Promise<MapPackGroup|void> => {
        await schema.validate(data, { abortEarly: false });
        const newGroup = repo.create(data);

        if (!newGroup) return;
        get();

        return newGroup;
    }

    const find = ( id: number ): MapPackGroup|void => {
        const mapPackGroup = repo.find(id);

        return mapPackGroup;
    }

    const remove = async ( id: number ) => {
        if (!id) return;
        
        try {
            const packGroup = find(id);
            if (!packGroup) return;

            await MapPackService.removeDownloads(packGroup);

            repo.delete(id);
            get();
        }
        catch (error) {
            console.error(error);
        }
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
