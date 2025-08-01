import Mapbox from '@rnmapbox/maps';
import { Coordinate, MapPackGroup } from '../types';
import { useState } from 'react';

export function useMapSettings() {

    const [styleURL, setStyleURL] = useState<Mapbox.StyleURL>(Mapbox.StyleURL.Outdoors);
    const [center, setCenter] = useState<Coordinate>([-1.865014, 53.450585]);
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
