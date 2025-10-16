import React, { createContext,useContext } from 'react';
import { PointOfInterest } from '../types';
import { usePointsOfInterest } from '../hooks/repositories/usePointsOfInterest';

type PointsOfInterestContextState = {
    pointsOfInterest: Array<PointOfInterest>
};

type PointsOfInterestContextActions = {
    create: (data: any)=>Promise<PointOfInterest|void>,
    update: (id: number, data: PointOfInterest)=>Promise<PointOfInterest|void>,
    remove: (id: number)=>void,
    findByLatLng: (latitude: number, longitude: number)=>PointOfInterest|void
};

const StateContext = createContext<PointsOfInterestContextState | undefined>(undefined);
const ActionsContext = createContext<PointsOfInterestContextActions | undefined>(undefined);

export const PointsOfInterestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { pointsOfInterest, create, update, remove, findByLatLng } = usePointsOfInterest();

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
