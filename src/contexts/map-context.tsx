import React, { createContext, RefObject, useContext, useRef, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { Coordinate, MapPackGroup } from '../types';
import { delay } from '../functions/helpers';
import { SETTING } from '../consts';

type MapContextType = {
    styleURL: Mapbox.StyleURL,
    setStyleURL: Function,
    center: Coordinate,
    setCenter: Function,
    moveTo: Function,
    activePackGroup: MapPackGroup,
    setActivePackGroup: Function,
    clearActivePackGroup: Function,
    cameraRef: RefObject<Mapbox.Camera>
    zoomTo: Function,
    flyTo: Function,
    reCenter: Function,
    enable3DMode: boolean,
    setEnable3DMode: Function
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [styleURL, setStyleURL] = useState<Mapbox.StyleURL>(Mapbox.StyleURL.Outdoors);
    const [center, setCenter] = useState<Coordinate>([-1.865014, 53.450585]);
    const [activePackGroup, setActivePackGroup] = useState<MapPackGroup>()
    const cameraRef = useRef<Mapbox.Camera>(null);
    const [enable3DMode, setEnable3DMode] = useState<boolean>(false);

    const clearActivePackGroup = () => {
        setActivePackGroup(undefined);
    }

    const moveTo = (coordinate: Coordinate) => {
        if (!cameraRef.current) return;
        cameraRef.current.moveTo(coordinate);
    }

    const flyTo = (coordinate: Coordinate, duration:number = 1000) => {
        if (!cameraRef.current) return;
        cameraRef.current.setCamera({
            centerCoordinate: coordinate,
            zoomLevel: SETTING.MAP_CLOSE_ZOOM,
            animationMode: 'flyTo',
            animationDuration: duration
        });
    }

    const zoomTo = ( zoom: number ) => {
        if (!cameraRef.current) return;
        cameraRef.current.zoomTo(zoom)
    }

    const reCenter = () => {

    }

    return (
        <MapContext.Provider
            value={{
                styleURL,
                center,
                activePackGroup,
                cameraRef,
                enable3DMode,

                setStyleURL,
                setCenter,
                setActivePackGroup,
                clearActivePackGroup,
                moveTo,
                zoomTo,
                flyTo,
                reCenter,
                setEnable3DMode
            }}
        >
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = (): MapContextType => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};
