import React, { createContext,useContext,RefObject } from 'react';
import Mapbox from '@rnmapbox/maps';
import { Coordinate, MapPackGroup } from '../types';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { useMapCameraControls } from '../hooks/useMapCameraControls';
import { useMapSettings } from '../hooks/useMapSettings';

type MapContextState = {
    styleURL: Mapbox.StyleURL;
    center: Coordinate;
    activePackGroup?: MapPackGroup;
    cameraRef: RefObject<Mapbox.Camera>;
    enable3DMode: boolean;
    followUserLocation: boolean;
};

type MapContextActions = {
    setStyleURL: (url: Mapbox.StyleURL) => void;
    setCenter: (coord: Coordinate) => void;
    setActivePackGroup: (pack: MapPackGroup) => void;
    clearActivePackGroup: () => void;
    moveTo: (coord: Coordinate) => void;
    zoomTo: (zoom: number) => void;
    flyTo: (coord: Position, zoom?: number, duration?: number,) => void;
    reCenter: () => void;
    setEnable3DMode: (enabled: boolean) => void;
    setFollowUserLocation: (enabled: boolean) => void;
};

const StateContext = createContext<MapContextState | undefined>(undefined);
const ActionsContext = createContext<MapContextActions | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const { center, setCenter, styleURL, setStyleURL, activePackGroup, setActivePackGroup, enable3DMode, setEnable3DMode: toggle3dMode, followUserLocation, setFollowUserLocation } = useMapSettings();
    const { flyTo, zoomTo, moveTo, resetHeading, cameraRef } = useMapCameraControls();

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
                    resetHeading
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
