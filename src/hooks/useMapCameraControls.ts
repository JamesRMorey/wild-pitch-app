import Mapbox from '@rnmapbox/maps';
import { SETTING } from '../consts';
import { useRef, useState } from 'react';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { delay } from '../utils/helpers';

export function useMapCameraControls() {

    const cameraRef = useRef<Mapbox.Camera>(null);
    const [initialRegion, setInitialRegion] = useState<Position>();
    const [heading, setHeading] = useState<number>(0);
    const [followUserPosition, setFollowUserPosition] = useState<boolean>(false);

    const moveTo = (coordinate: Position): void => {
        cameraRef.current?.moveTo(coordinate);
    };

    const flyTo = (coordinate: Position, zoom: number=SETTING.MAP_CLOSE_ZOOM, duration: number = 1000): void => {
        cameraRef.current?.setCamera({
            centerCoordinate: coordinate,
            zoomLevel: zoom,
            animationMode: 'flyTo',
            animationDuration: duration,
            heading: 0
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
        setHeading(0);
    }

    const reCenter = async (center: Position) => {
		if (!center) return;
		cameraRef.current?.setCamera({
			centerCoordinate: center,
			zoomLevel: SETTING.MAP_CLOSEST_ZOOM,
			animationDuration: 1000,
		});
	}

    const fitToBounds = async (ne: Position, sw: Position, padding: number = 50, duration: number = 1000): void => {
        if (!cameraRef.current) return;
        await delay(300);
        cameraRef.current?.fitBounds(ne, sw, [Math.max(padding, 120), padding, Math.max(padding, 160), padding], duration);
    }

    return { 
        cameraRef,
        initialRegion,
        heading,
        followUserPosition,

        moveTo, 
        flyTo, 
        flyToLow, 
        zoomTo, 
        resetHeading,
        setInitialRegion,
        fitToBounds,
        setHeading,
        setFollowUserPosition,
        reCenter
    };
}
