import Mapbox from '@rnmapbox/maps';
import { SETTING } from '../consts';
import { useRef } from 'react';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

export function useMapCameraControls() {

    const cameraRef = useRef<Mapbox.Camera>(null);

    const moveTo = (coordinate: Position): void => {
        cameraRef.current?.moveTo(coordinate);
    };

    const flyTo = (coordinate: Position, zoom: number=SETTING.MAP_CLOSE_ZOOM, duration: number = 1000): void => {
        cameraRef.current?.setCamera({
            centerCoordinate: coordinate,
            zoomLevel: zoom,
            animationMode: 'flyTo',
            animationDuration: duration,
        });
    };

    const flyToLow = (coordinate: Position, zoom: number=SETTING.MAP_CLOSE_ZOOM, duration: number = 1000): void => {
        flyTo([coordinate[0], coordinate[1]-0.00022*zoom], zoom, duration);
    };

    const zoomTo = (zoom: number): void => {
        cameraRef.current?.zoomTo(zoom);
    };

    const resetHeading = (): void => {
        cameraRef.current?.setCamera({
            heading: 0,
            animationDuration: 500
        });
    }

    return { moveTo, flyTo, flyToLow, zoomTo, resetHeading, cameraRef };
}
