import React, { createContext,useContext,RefObject, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { useMapCameraControls } from '../hooks/useMapCameraControls';
import { useMapSettings } from '../hooks/useMapSettings';
import { PointOfInterest, Route } from '../types';
import { RouteService } from '../services/route-service';

type RoutesContextState = {
    styleURL: Mapbox.StyleURL;
    center: Position;
    cameraRef: RefObject<Mapbox.Camera>;
    enable3DMode: boolean;
    followUserLocation: boolean;
    activeRoute?: Route;
    activePOI?: PointOfInterest;
};

type RoutesContextActions = {
    setStyleURL: (url: Mapbox.StyleURL) => void;
    setCenter: (coord: Position) => void;
    moveTo: (coord: Position) => void;
    zoomTo: (zoom: number) => void;
    flyTo: (coord: Position, zoom?: number, duration?: number,) => void;
    flyToLow: (coord: Position, zoom?: number, duration?: number,) => void;
    setEnable3DMode: (enabled: boolean) => void;
    setFollowUserLocation: (enabled: boolean) => void;
    resetHeading: () => void;
    fitToBounds: (ne: Position, sw: Position, padding?: number, duration?: number) => void;
    setActiveRoute: (route?: Route) => void;
    fitToRoute: (route: Route) => void;
    setActivePOI: (poi?: PointOfInterest) => void;
};

const StateContext = createContext<RoutesContextState | undefined>(undefined);
const ActionsContext = createContext<RoutesContextActions | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { center, setCenter, styleURL, setStyleURL, enable3DMode, setEnable3DMode: toggle3dMode, followUserLocation, setFollowUserLocation } = useMapSettings();
    const { flyTo, flyToLow, zoomTo, moveTo, resetHeading, fitToBounds, cameraRef } = useMapCameraControls();
    const [activeRoute, setActiveRoute] = useState<Route>();
	const [activePOI, setActivePOI] = useState<PointOfInterest>();
    
    const setEnable3DMode = ( enabled: boolean ) => {
        cameraRef.current?.setCamera({
            pitch: 0
        });
        toggle3dMode(enabled)
    }

    const fitToRoute = ( route: Route ) => {
        const boundingBox = RouteService.calculateBoundingBox(route.markers);
        if (boundingBox) {
            fitToBounds(boundingBox.ne, boundingBox.sw);
        }
    }
    

    return (
        <StateContext.Provider
            value={{
                styleURL,
                center,
                cameraRef,
                enable3DMode,
                followUserLocation,
                activeRoute,
                activePOI
            }}
        >
            <ActionsContext.Provider
                value={{
                    setStyleURL,
                    setCenter,
                    moveTo,
                    zoomTo,
                    flyTo,
                    setEnable3DMode,
                    setFollowUserLocation,
                    resetHeading,
                    flyToLow,
                    fitToBounds,
                    setActiveRoute,
                    fitToRoute,
                    setActivePOI
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
