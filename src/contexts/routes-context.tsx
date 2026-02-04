import React, { createContext,useContext, useEffect, useState } from 'react';
import { routeSchema as schema } from '../utils/schema';
import { Route } from '../models/route';
import { RouteRepository } from '../database/repositories/route-repository';
import { useGlobalState } from './global-context';
import { PointOfInterestRepository } from '../database/repositories/points-of-interest-repository';
import { RouteService } from '../services/route-service';
import { GPX } from '../services/gpx';
import { Alert } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { MapPackService } from '../services/map-pack-service';
import { WildPitchApi } from '../services/api/wild-pitch';
import { ROUTE_ENTRY_TYPE, ROUTE_STATUS } from '../consts/enums';
import { RouteData } from '../types';

type RoutesContextState = {
    routes: Array<Route>
};

type RoutesContextActions = {
    create: (data: any)=>Promise<Route|void>,
    update: (id: number, data: RouteData)=>Promise<Route|void>,
    remove: (route: Route)=>void,
    findByLatLng: (latitude: number, longitude: number)=>Route|void
    find: (id: number)=>Route|void
    importFile: ()=>Promise<RouteData|void>
    upload: (data: Route, status: ROUTE_STATUS)=>Promise<Route|void>
    makePublic: (data: Route)=>Promise<Route|void>
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
        setRoutes(data.map((r) => new Route(r)));
    }

    const sync = async (): Promise<void> => {
        if (!user) return;

        const savedRoutes = repo.get();
        const serverRoutes = await WildPitchApi.fetchUserRoutes();
        const unSavedRoutes = serverRoutes.filter(r => !savedRoutes.find((p: RouteData) => p.server_id == r.server_id));
        
        for (const route of unSavedRoutes) {
            repo.create(route, ROUTE_ENTRY_TYPE.ROUTE, route.updated_at);
        }

        for (const saved of savedRoutes) {
            const savedRoute = new Route(saved);
            if (!saved.server_id) {
                upload(savedRoute, saved.status ?? ROUTE_STATUS.PRIVATE)
                    .then((data) => {
                        repo.update(savedRoute.id, data, data?.updated_at);
                    })
                    .catch((error) => console.error(error));
                continue;
            }

            const serverRoute = serverRoutes.find((r: RouteData) => r.server_id == saved.server_id);
            if (!serverRoute) {
                remove(savedRoute);
                continue;
            };

            if (serverRoute.updated_at > saved.updated_at && saved.id) {
                repo.update(saved.id, {...serverRoute, server_id: saved.server_id}, serverRoute.updated_at);
            }
            else if (serverRoute.updated_at < saved.updated_at && serverRoute.server_id) {
                WildPitchApi.updateRoute(serverRoute.server_id, saved);
            }
        }

        get();
    }

    const create = async ( data: any ): Promise<Route|void> => {
        await schema.validate(data, { abortEarly: false });
        
        const created = repo.create(data);

        if (!created?.id) return;
        const newRoute = new Route(created);

        const poiToDelete = poiRepo.findByLatLng(newRoute.latitude, newRoute.longitude);
        if (poiToDelete?.id) {
            poiRepo.delete(poiToDelete.id);
        }

        upload(newRoute, ROUTE_STATUS.PRIVATE)
        .then((data) => {
            update(
                newRoute.id, 
                { ...data, server_id: data.server_id}
            );
        })
        .catch((error) => console.error(error));

        get();
        
        return new Route(newRoute);
    }

    const update = async ( id: number, data: RouteData, sync: boolean = true ): Promise<Route|void> => {
        if (!id) return;

        await schema.validate(data, { abortEarly: false });
        const updated = repo.update(id, data);

        if (!updated) return;
        get();

        if (sync && updated.server_id) {
            WildPitchApi.updateRoute(updated.server_id, updated);
        }

        return new Route(updated);
    }

    const find = ( id: number ): Route|void => {
        try {
            const route = repo.find(id);
            if (!route) return;

            return new Route(route);
        }
        catch (error: any) {
            console.error(error);
            return;
        }
    }

    const findByLatLng = ( latitude: number, longitude: number ): Route|undefined => {
        try {
            const route = repo.findByLatLng(latitude, longitude);
            if (!route) return;

            return new Route(route);
        }
        catch (error: any) {
            console.error(error);
            return;
        }
    }

    const remove = async ( route: Route ) => {
        if (!route.id) return;
        
        try {
            const deleted = repo.delete(route.id);
            if (deleted) {
                const packName = MapPackService.getPackName(deleted.name, Mapbox.StyleURL.Outdoors);
                await MapPackService.removeDownload(packName)
            }

            if (route.server_id) {
                WildPitchApi.deleteRoute(route);
            }

            get();
        }
        catch (error) {
            console.error(error);
        }
    }

    const upload = async ( data: Route, status: ROUTE_STATUS ): Promise<Route|void> => {
        if (!data.id) return;
        const route = await WildPitchApi.createRoute({
            ...data,
            status: status
        });

        return await update(
            data.id, 
            route,
            false
        );
    }

    const makePublic = async ( data: Route ): Promise<Route|void> => {
        if (!data.id) return;

        if (!data.server_id) {
            const uploaded = await upload(data, ROUTE_STATUS.PUBLIC);
            return uploaded;
        }

        if (data.status == ROUTE_STATUS.PUBLIC) return data;

        const updated = await WildPitchApi.makeRoutePublic(data.server_id);
        
        return await update(data.id, updated, false);
    }

    const importFile = async (): Promise<RouteData|void> => {
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
        sync();
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
                    importFile,
                    upload,
                    makePublic
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
