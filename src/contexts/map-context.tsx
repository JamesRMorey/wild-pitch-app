import React, { createContext,useContext,RefObject, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { MapPackGroup, PointOfInterest } from '../types';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { useMapCameraControls } from '../hooks/useMapCameraControls';
import { useMapSettings } from '../hooks/useMapSettings';
import { usePointsOfInterest } from '../hooks/repositories/usePointsOfInterest';

type MapContextState = {
    styleURL: Mapbox.StyleURL;
    center: Position;
    activePackGroup?: MapPackGroup;
    cameraRef: RefObject<Mapbox.Camera>;
    enable3DMode: boolean;
    followUserLocation: boolean;
    showPointsOfInterest: boolean;
    pointsOfInterest: Array<PointOfInterest>;
};

type MapContextActions = {
    setStyleURL: (url: Mapbox.StyleURL) => void;
    setCenter: (coord: Position) => void;
    setActivePackGroup: (pack: MapPackGroup) => void;
    clearActivePackGroup: () => void;
    moveTo: (coord: Position) => void;
    zoomTo: (zoom: number) => void;
    flyTo: (coord: Position, zoom?: number, duration?: number,) => void;
    flyToLow: (coord: Position, zoom?: number, duration?: number,) => void;
    fitToBounds: (ne: Position, sw: Position, padding?: number, duration?: number) => void;
    reCenter: () => void;
    setEnable3DMode: (enabled: boolean) => void;
    setShowPointsOfInterest: (enabled: boolean) => void;
    setFollowUserLocation: (enabled: boolean) => void;
    resetHeading: () => void;
};

const StateContext = createContext<MapContextState | undefined>(undefined);
const ActionsContext = createContext<MapContextActions | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { center, setCenter, styleURL, setStyleURL, activePackGroup, setActivePackGroup, enable3DMode, setEnable3DMode: toggle3dMode, followUserLocation, setFollowUserLocation } = useMapSettings();
    const { flyTo, flyToLow, zoomTo, moveTo, resetHeading, fitToBounds, cameraRef } = useMapCameraControls();
    const { pointsOfInterest } = usePointsOfInterest();
    const [showPointsOfInterest, setShowPointsOfInterest] = useState<boolean>(true);

    const clearActivePackGroup = () => setActivePackGroup(undefined);
    
    const setEnable3DMode = ( enabled: boolean ) => {
        cameraRef.current?.setCamera({
            pitch: 0
        });
        toggle3dMode(enabled)
    }
    

    return (
        <StateContext.Provider
            value={{
                styleURL,
                center,
                activePackGroup,
                cameraRef,
                enable3DMode,
                followUserLocation,
                pointsOfInterest,
                showPointsOfInterest,
            }}
        >
            <ActionsContext.Provider
                value={{
                    setStyleURL,
                    setCenter,
                    setActivePackGroup,
                    clearActivePackGroup,
                    moveTo,
                    zoomTo,
                    flyTo,
                    setEnable3DMode,
                    setFollowUserLocation,
                    resetHeading,
                    setShowPointsOfInterest,
                    flyToLow,
                    fitToBounds
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const useMapState = (): MapContextState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useMapState must be used within a MapProvider');
    return context;
};

export const useMapActions = (): MapContextActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('useMapActions must be used within a MapProvider');
    return context;
};
