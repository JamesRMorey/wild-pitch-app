import React, { createContext,useContext, useEffect, useState } from 'react';
import { routeSchema as schema } from '../utils/schema';
import { RouteRepository } from '../database/repositories/route-repository';
import { useGlobalState } from './global-context';
import Mapbox from '@rnmapbox/maps';
import { MapPackService } from '../services/map-pack-service';
import { WildPitchApi } from '../services/api/wild-pitch';
import { ROUTE_ENTRY_TYPE } from '../consts/enums';
import { Route } from '../models/route';
import { RouteData } from '../types';

type BookmarkedRoutesContextState = {
    bookmarkedRoutes: Array<Route>;
};

type BookmarkedRoutesContextActions = {
    create: (data: any)=>Promise<Route|void>;
    update: (id: number, data: any)=>Promise<Route|void>;
    remove: (route: Route)=>void;
    find: (id: number)=>Route|void;
    upload: (serverId: number)=>Promise<void>;
    isBookmarked: (serverId: number)=>boolean;
};

const StateContext = createContext<BookmarkedRoutesContextState | undefined>(undefined);
const ActionsContext = createContext<BookmarkedRoutesContextActions | undefined>(undefined);

export const BookmarkedRoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { user }  = useGlobalState();
    const [bookmarkedRoutes, setBookmarkedRoutes] = useState<Array<Route>>([]);

    const repo = new RouteRepository(user?.id);

    const get = (): void => {
        if (!user) return;
        const data = repo.get(ROUTE_ENTRY_TYPE.BOOKMARK) ?? [];
        setBookmarkedRoutes(data.map(r => new Route(r)));
    }

    const sync = async (): Promise<void> => {
        if (!user) return;
        
        const savedRoutes = repo.get(ROUTE_ENTRY_TYPE.BOOKMARK);
        const serverRoutes = await WildPitchApi.fetchBookmarkedRoutes();
        const unSavedRoutes = serverRoutes.filter(r => !savedRoutes.find(p => p.server_id == r.server_id));
        
        for (const route of unSavedRoutes) {
            repo.create(route, ROUTE_ENTRY_TYPE.BOOKMARK);
        }
        
        for (const saved of savedRoutes) {
            const serverRoute = serverRoutes.find(r => r.server_id == saved.server_id);
            if (!serverRoute) {
                remove(new Route(saved));
                continue;
            };

            if (serverRoute.updated_at > saved.updated_at && saved.id) {
                repo.update(saved.id, serverRoute);
            }
        }
        
        get();
    }

    const create = async ( data: any ): Promise<Route|void> => {
        await schema.validate(data, { abortEarly: false });
        
        const existing = repo.get(ROUTE_ENTRY_TYPE.BOOKMARK);
        const isExisting = existing.find((bm: RouteData) => bm.server_id == data.server_id);
        
        if (isExisting) return new Route(isExisting);
        
        const routes = repo.get(ROUTE_ENTRY_TYPE.ROUTE);
        const isOwnRoute = routes.find((r: RouteData) => r.server_id == data.server_id);
        if (isOwnRoute) return;

        const newRoute = repo.create(data, ROUTE_ENTRY_TYPE.BOOKMARK);
        if (!newRoute || !newRoute.server_id) return;

        upload(newRoute.server_id)
            .then((data) => console.log('success bookmarking route'))
            .catch((error) => console.error(error));

        get();
        
        return new Route(newRoute);
    }

    const update = async ( id: number, data: Route ): Promise<Route|void> => {
        if (!id) return;

        await schema.validate(data, { abortEarly: false });
        const updated = repo.update(id, data);

        if (!updated) return;
        get();

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

    const remove = async ( route: Route): Promise<void> => {
        if (!route.id) return;
        const deleted = repo.delete(route.id, ROUTE_ENTRY_TYPE.BOOKMARK);
        
        if (deleted) {
            await MapPackService.removeDownload(route.getMapPackName());

            if (deleted.server_id) {
                WildPitchApi.removeBookmarkedRoute(deleted.server_id);
            }
        }

        get();
    }

    const upload = async ( serverId: number ): Promise<void> => {
        await WildPitchApi.bookmarkRoute(serverId);
    }

    const isBookmarked = ( serverId: number ): boolean => {
        return bookmarkedRoutes.find((b) => b.server_id == serverId) ? true : false;
    }


    useEffect(() => {
        get();
        sync();
    }, [])


    return (
        <StateContext.Provider
            value={{
                bookmarkedRoutes
            }}
        >
            <ActionsContext.Provider
                value={{
                    create,
                    update,
                    remove,
                    find,
                    upload,
                    isBookmarked
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const useBookmarkedRoutesState = (): BookmarkedRoutesContextState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useBookmarkedRoutesState must be used within a RoutesProvider');
    return context;
};

export const useBookmarkedRoutesActions = (): BookmarkedRoutesContextActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('useBookmarkedRoutesActions must be used within a RoutesProvider');
    return context;
};
