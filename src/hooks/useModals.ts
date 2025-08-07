import { useState, useMemo, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';


export default function useModals(initial) {

    const [modals, setModals] = useState(initial);

    const close = () => {
        const keys = Object.keys(modals);
        const closed = keys.reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});

        setModals(closed);
    }

    const open = (id) => {
        close();
        DeviceEventEmitter.emit('modals:dismiss-all');

        const keys = Object.keys(modals);
        const opened = keys.reduce((acc, key) => {
            acc[key] = key === id;
            return acc;
        }, {});

        setModals(opened);
    }


    useEffect(() => {
        const dismissAllListener = DeviceEventEmitter.addListener('modals:dismiss-all', () => close());
        return () => {
            dismissAllListener.remove();
        }
    }, []);
    

    return useMemo(() => ({ 
        modals: modals,
        open: (id) => open(id),
        close: () => close(),
    }), [modals, close, open]);
};
