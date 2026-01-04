import React, { createContext,useContext, useEffect, useState } from 'react';
import { PointOfInterest } from '../types';
import { useGlobalState } from './global-context';
import { PointOfInterestRepository } from '../database/repositories/points-of-interest-repository';
import { pointOfInterestSchema as schema } from '../utils/schema';

type PointsOfInterestContextState = {
    pointsOfInterest: Array<PointOfInterest>
};

type PointsOfInterestContextActions = {
    create: (data: any)=>Promise<PointOfInterest|void>,
    find: (id: number)=>PointOfInterest|void,
    update: (id: number, data: PointOfInterest)=>Promise<PointOfInterest|void>,
    remove: (id: number)=>void,
    findByLatLng: (latitude: number, longitude: number)=>PointOfInterest|void
};

const StateContext = createContext<PointsOfInterestContextState | undefined>(undefined);
const ActionsContext = createContext<PointsOfInterestContextActions | undefined>(undefined);

export const PointsOfInterestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { user } = useGlobalState();
    const [pointsOfInterest, setPointsOfInterest] = useState<Array<PointOfInterest>>([]);
    const repo = new PointOfInterestRepository(user?.id);

    const get = (): void => {
        if (!user) return;
        const points = repo.get() ?? [];
        setPointsOfInterest(points);
    }

    const create = async ( data: PointOfInterest ): Promise<PointOfInterest|void> => {
        await schema.validate(data, { abortEarly: false });
        const newPoint = repo.create(data);

        if (!newPoint) return;
        get();

        return newPoint;
    }

    const update = async ( id: number, data: PointOfInterest ): Promise<PointOfInterest|void> => {
        if (!id) return;

        await schema.validate(data, { abortEarly: false });
        const newPoint = repo.update(id, data);

        if (!newPoint) return;
        get();

        return newPoint;
    }

    const find = ( id: number ): PointOfInterest|void => {
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

    const findByLatLng = ( latitude: number, longitude: number ): PointOfInterest|void => {
        try {
            const point = repo.findByLatLng(latitude, longitude);
            if (!point) return;

            return point;
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

    useEffect(() => {
        get();
    }, [])

    return (
        <StateContext.Provider
            value={{
                pointsOfInterest
            }}
        >
            <ActionsContext.Provider
                value={{
                    create,
                    update,
                    remove,
                    find,
                    findByLatLng
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const usePointsOfInterestState = (): PointsOfInterestContextState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('usePointsOfInterestState must be used within a PointsOfInterestProvider');
    return context;
};

export const usePointsOfInterestActions = (): PointsOfInterestContextActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('usePointsOfInterestActions must be used within a PointsOfInterestProvider');
    return context;
};
