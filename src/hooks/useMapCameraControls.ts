import Mapbox from '@rnmapbox/maps';
import { Coordinate } from '../types';
import { SETTING } from '../consts';
import { useRef } from 'react';

export function useMapCameraControls() {

    const cameraRef = useRef<Mapbox.Camera>(null);

    const moveTo = (coordinate: Coordinate) => {
        cameraRef.current?.moveTo(coordinate);
    };

    const flyTo = (coordinate: Coordinate, zoom: number=SETTING.MAP_CLOSE_ZOOM, duration: number = 1000) => {
        cameraRef.current?.setCamera({
            centerCoordinate: coordinate,
            zoomLevel: zoom,
            animationMode: 'flyTo',
            animationDuration: duration,
        });
    };

    const zoomTo = (zoom: number) => {
        cameraRef.current?.zoomTo(zoom);
    };


    return { moveTo, flyTo, zoomTo, cameraRef };
}
