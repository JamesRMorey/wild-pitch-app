import React, { createContext,useContext } from 'react';
import { useMapPackGroups } from '../hooks/repositories/useMapPackGroups';
import { MapPackGroup } from '../types';

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
    
    const { mapPackGroups, get, create, remove, find } = useMapPackGroups();
    

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
