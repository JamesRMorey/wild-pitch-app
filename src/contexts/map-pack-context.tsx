import React, { createContext, useContext, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { MapPackGroup } from '../types';
import { PACK_GROUPS } from '../consts';

type MapPackContextType = {
    selectedPackGroup: MapPackGroup,
    setSelectedPackGroup: Function
};

const MapPackContext = createContext<MapPackContextType | undefined>(undefined);

export const MapPackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [selectedPackGroup, setSelectedPackGroup] = useState<MapPackGroup>(PACK_GROUPS[0])


    return (
        <MapPackContext.Provider
            value={{
                selectedPackGroup,
                setSelectedPackGroup
            }}
        >
            {children}
        </MapPackContext.Provider>
    );
};

export const useMapPackContext = (): MapPackContextType => {
    const context = useContext(MapPackContext);
    if (!context) {
        throw new Error('useMapPackContext must be used within a MapPackProvider');
    }
    return context;
};
