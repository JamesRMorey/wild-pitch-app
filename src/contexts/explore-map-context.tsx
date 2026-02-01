import React, { createContext,useContext,RefObject, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { useMapCameraControls } from '../hooks/useMapCameraControls';
import { useMapSettings } from '../hooks/useMapSettings';
import { PointOfInterest } from '../types';
import { Route } from '../models/route';
import { RouteService } from '../services/route-service';

type ExploreMapContextState = {
    styleURL: Mapbox.StyleURL;
    center: Position;
    cameraRef: RefObject<Mapbox.Camera>;
    enable3DMode: boolean;
    followUserLocation: boolean;
    activeRoute?: Route;
    activePOI?: PointOfInterest;
};

type ExploreMapContextActions = {
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
    reCenter: (position: Position) => void;
};

const StateContext = createContext<ExploreMapContextState | undefined>(undefined);
const ActionsContext = createContext<ExploreMapContextActions | undefined>(undefined);

export const ExploreMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { center, setCenter, styleURL, setStyleURL, enable3DMode, setEnable3DMode: toggle3dMode, followUserLocation, setFollowUserLocation } = useMapSettings();
    const { flyTo, flyToLow, zoomTo, moveTo, resetHeading, fitToBounds, cameraRef, reCenter } = useMapCameraControls();
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
                    setActivePOI,
                    reCenter
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const useExploreMapState = (): ExploreMapContextState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useExploreMapState must be used within a ExploreMapProvider');
    return context;
};

export const useExploreMapActions = (): ExploreMapContextActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('useExploreMapActions must be used within a ExploreMapProvider');
    return context;
};
