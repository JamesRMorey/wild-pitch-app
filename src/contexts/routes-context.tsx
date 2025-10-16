import React, { createContext,useContext, useState } from 'react';
import { useRoutes } from '../hooks/repositories/useRoutes';
import { Route } from '../types';

type RoutesContextState = {
    routes: Array<Route>
};

type RoutesContextActions = {
    create: (data: any)=>Promise<Route>,
    update: (id: number, data: any)=>Promise<Route>,
    remove: (id: number)=>void,
    findByLatLng: (latitude: number, longitude: number)=>Route|void
};

const StateContext = createContext<RoutesContextState | undefined>(undefined);
const ActionsContext = createContext<RoutesContextActions | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { routes, create, update, remove, findByLatLng } = useRoutes();
    

    return (
        <StateContext.Provider
            value={{
                routes
            }}
        >
            <ActionsContext.Provider
                value={{
                    create,
                    update,
                    remove,
                    findByLatLng
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const useRoutesState = (): RoutesContextState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useRoutesState must be used within a RoutesProvider');
    return context;
};

export const useRoutesActions = (): RoutesContextActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('useRoutesActions must be used within a RoutesProvider');
    return context;
};
