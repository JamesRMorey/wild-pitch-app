import { useState, useEffect, useMemo, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Coordinate } from '../types';
import { Permission } from '../services/permissions';

export default function useUserPosition () {
    const [userPosition, setUserPosition] = useState<Coordinate>();
    const userPositionRef = useRef(userPosition);

    const newPositionHandler = async (coords: Coordinate) => {
        const pos = {
            latitude: parseFloat(coords.latitude),
            longitude: parseFloat(coords.longitude)
        };

        setUserPosition(pos);
        userPositionRef.current = pos;
    }
    
    const watchPosition = () => {
        return Geolocation.watchPosition((data) => newPositionHandler(data.coords), 
        (error) => console.log(error), 
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
            distanceFilter: 1,
        }); 
    };

    const currentPosition = () => {
        return Geolocation.getCurrentPosition((data) => newPositionHandler(data.coords),
        (error) => console.log(error), 
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
            distanceFilter: 1,
        });
    }

    let watchId: any;
    useEffect(() => {
        Permission.location();
        currentPosition();
        
        watchId = watchPosition();
        return () => {
            Geolocation.clearWatch(watchId);
        }
    }, []);
    
    return useMemo(
        () => ({
            userPosition: userPosition,
            getUserPosition: () => userPositionRef.current,
            currentPosition: () => currentPosition(),
            watchPosition: () => watchPosition(),
        }),
        [userPosition]
    );
};
