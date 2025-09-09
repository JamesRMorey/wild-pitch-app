import Mapbox from '@rnmapbox/maps';
import { Coordinate, MapPackGroup } from '../types';
import { useState } from 'react';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

export function useMapSettings() {

    const [styleURL, setStyleURL] = useState<Mapbox.StyleURL>(Mapbox.StyleURL.Outdoors);
    const [center, setCenter] = useState<Position>([-2.206805, 54.438787]);
    const [activePackGroup, setActivePackGroup] = useState<MapPackGroup>();
    const [enable3DMode, setEnable3DMode] = useState<boolean>(false);
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);
    const [initialRegion, setInitialRegion] = useState<Coordinate>();
    const [userPosition, setUserPosition] = useState<Coordinate>();
    const [loaded, setLoaded] = useState<boolean>(false);

    const updateUserPosition = ( latitude: number, longitude: number ) => {
        if (!latitude || !longitude) return;
        if (!initialRegion) {
            setInitialRegion({ latitude, longitude });
            setTimeout(() => setLoaded(true), 1000);
        }
        setUserPosition({ latitude, longitude });
    }

    return { 
        styleURL,
        center,
        activePackGroup,
        enable3DMode,
        followUserLocation,
        initialRegion,
        userPosition,
        loaded,

        setStyleURL,
        setCenter,
        setActivePackGroup,
        setEnable3DMode,
        setFollowUserLocation,
        setUserPosition,
        updateUserPosition,
        setInitialRegion,
        setLoaded,
     };
}
