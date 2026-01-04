import React, { createContext,useContext, useEffect, useState } from 'react';
import { routeSchema as schema } from '../utils/schema';
import { Route } from '../types';
import { RouteRepository } from '../database/repositories/route-repository';
import { useGlobalState } from './global-context';
import { PointOfInterestRepository } from '../database/repositories/points-of-interest-repository';
import { RouteService } from '../services/route-service';
import { GPX } from '../services/gpx';
import { Alert } from 'react-native';

type RoutesContextState = {
    routes: Array<Route>
};

type RoutesContextActions = {
    create: (data: any)=>Promise<Route|void>,
    update: (id: number, data: any)=>Promise<Route|void>,
    remove: (id: number)=>void,
    findByLatLng: (latitude: number, longitude: number)=>Route|void
    find: (id: number)=>Route|void
    importFile: ()=>Promise<Route|void>
};

const StateContext = createContext<RoutesContextState | undefined>(undefined);
const ActionsContext = createContext<RoutesContextActions | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { user }  = useGlobalState();
    const [routes, setRoutes] = useState<Array<Route>>([]);
    const repo = new RouteRepository(user?.id);
    const poiRepo = new PointOfInterestRepository(user?.id);

    const get = (): void => {
        if (!user) return;
        const data = repo.get() ?? [];
        setRoutes(data);
    }

    const create = async ( data: any ): Promise<Route|void> => {
        try {
            await schema.validate(data, { abortEarly: false });
            const newRoute = repo.create(data);

            if (!newRoute) return;

            const poiToDelete = poiRepo.findByLatLng(newRoute.latitude, newRoute.longitude);
            if (poiToDelete?.id) {
                poiRepo.delete(poiToDelete.id);
            }

            get();
            
            return newRoute;
        }
        catch (error: any) {
            console.error(error);
            return error;
        }
    }

    const update = async ( id: number, data: Route ): Promise<Route|void> => {
        try {
            if (!data.id) return

            await schema.validate(data, { abortEarly: false });
            const newPoint = repo.update(id, data);

            if (!newPoint) return;
            get();

            return newPoint;
        }
        catch (error: any) {
            console.error(error);
            return error;
        }
    }

    const find = ( id: number ): Route|void => {
        try {
            const point = repo.find(id);
            if (!point) return;

            return point;
        }
        catch (error: any) {
            console.error(error);
            return error;
        }
    }

    const findByLatLng = ( latitude: number, longitude: number ): Route|undefined => {
        try {
            const route = repo.findByLatLng(latitude, longitude);
            if (!route) return;

            return route;
        }
        catch (error: any) {
            console.error(error);
            return error;
        }
    }

    const remove = ( id: number ) => {
        if (!id) return;
        
        repo.delete(id);
        get();
    }

    const importFile = async (): Promise<Route|void> => {
        const gpxString = await GPX.import();
        if (!gpxString) {
            Alert.alert('Error', 'Looks like the import wasn\'t in the right format.');
            return;
        }

        const routeData = RouteService.parseGPX(gpxString);
        if (!routeData) {
            Alert.alert('Error', 'Looks like the import wasn\'t in the right format.');
            return;
        }

        return routeData;
    }

    useEffect(() => {
        get();
    }, [])
    

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
                    findByLatLng,
                    find,
                    importFile
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
