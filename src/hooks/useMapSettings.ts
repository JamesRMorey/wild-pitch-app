import Mapbox from '@rnmapbox/maps';
import { MapPackGroup } from '../types';
import { useState } from 'react';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

export function useMapSettings() {

    const [styleURL, setStyleURL] = useState<Mapbox.StyleURL>(Mapbox.StyleURL.Outdoors);
    const [center, setCenter] = useState<Position>([-2.206805, 54.438787]);
    const [activePackGroup, setActivePackGroup] = useState<MapPackGroup>();
    const [enable3DMode, setEnable3DMode] = useState<boolean>(false);
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);


    return { 
        styleURL,
        center,
        activePackGroup,
        enable3DMode,
        followUserLocation,

        setStyleURL,
        setCenter,
        setActivePackGroup,
        setEnable3DMode,
        setFollowUserLocation
     };
}
