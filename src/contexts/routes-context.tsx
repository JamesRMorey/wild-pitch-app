import React, { createContext,useContext, useEffect, useState } from 'react';
import { routeSchema as schema } from '../utils/schema';
import { Route } from '../models/route';
import { RouteRepository } from '../database/repositories/route-repository';
import { useGlobalState } from './global-context';
import { PointOfInterestRepository } from '../database/repositories/points-of-interest-repository';
import { RouteService } from '../services/route-service';
import { GPX } from '../services/gpx';
import { Alert } from 'react-native';
import { MapPackService } from '../services/map-pack-service';
import { WildPitchApi } from '../services/api/wild-pitch';
import { ROUTE_ENTRY_TYPE, ROUTE_STATUS } from '../consts/enums';
import { RouteData } from '../types';

type RoutesContextState = {
    routes: Array<Route>;
    syncing: boolean;
};

type RoutesContextActions = {
    create: (data: any)=>Promise<Route|void>;
    update: (id: number, data: RouteData)=>Promise<Route|void>;
    remove: (route: Route)=>void;
    exists: (id: number)=>boolean;
    find: (id: number)=>Route|void;
    importFile: ()=>Promise<RouteData|void>;
    upload: (data: Route, status: ROUTE_STATUS)=>Promise<Route|void>;
    makePublic: (data: Route)=>Promise<Route|void>;
    sync: ()=>Promise<void>;
};

const StateContext = createContext<RoutesContextState | undefined>(undefined);
const ActionsContext = createContext<RoutesContextActions | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { user }  = useGlobalState();
    const [routes, setRoutes] = useState<Array<Route>>([]);
    const [syncing, setSyncing] = useState<boolean>(false);

    const repo = new RouteRepository(user?.id);
    const poiRepo = new PointOfInterestRepository(user?.id);

    const get = (): void => {
        if (!user) return;
        const data = repo.get() ?? [];
        setRoutes(data.map((r) => new Route(r)));
    }

    const sync = async (): Promise<void> => {
        if (!user) return;

        try {
            setSyncing(true);
            const savedRoutes = repo.get();
            const serverRoutes = await WildPitchApi.fetchUserRoutes();
            const unSavedRoutes = serverRoutes.filter(r => !savedRoutes.find((p: RouteData) => p.server_id == r.server_id));
            
            for (const route of unSavedRoutes) {
                repo.create(route, ROUTE_ENTRY_TYPE.ROUTE, route.updated_at);
            }
            
            await Promise.all(
                savedRoutes.map((saved) => {
                    const savedRoute = new Route(saved);
                    if (!saved.server_id) {
                        upload(savedRoute, saved.status ?? ROUTE_STATUS.PRIVATE)
                            .then((data) => {
                                repo.update(savedRoute.id, data, data?.updated_at);
                            })
                            .catch((error) => console.error(error));
                        return;
                    }

                    const serverRoute = serverRoutes.find((r: RouteData) => r.server_id == saved.server_id);
                    if (!serverRoute) {
                        remove(savedRoute);
                        return;
                    };

                    if (serverRoute.updated_at > saved.updated_at && saved.id) {
                        repo.update(saved.id, {...serverRoute, server_id: saved.server_id}, serverRoute.updated_at);
                    }
                    else if (serverRoute.updated_at < saved.updated_at && serverRoute.server_id) {
                        WildPitchApi.updateRoute(serverRoute.server_id, saved);
                    }
                })
            )

            get();
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setTimeout(() => setSyncing(false), 2000)
        }
    }

    const exists = (id: number): boolean => {
        const existing = repo.get();
        return existing.find(r => r.id == id) ? true : false;
    }

    const create = async ( data: any ): Promise<Route|void> => {
        await schema.validate(data, { abortEarly: false });
        
        if (data.id && exists(data.id)) {
            return find(data.id);
        } 

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

    const remove = async ( route: Route ) => {
        if (!route.id) return;
        
        try {
            const deleted = repo.delete(route.id);
            if (deleted) {
                await MapPackService.removeDownload(route.getMapPackName())
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
                routes,
                syncing
            }}
        >
            <ActionsContext.Provider
                value={{
                    create,
                    update,
                    remove,
                    find,
                    importFile,
                    upload,
                    makePublic,
                    exists,
                    sync
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
