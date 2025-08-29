import { useMemo } from 'react';
import { Platform, Vibration } from 'react-native';

const DEFAULT_PATTERN = Platform.OS == 'ios' ? [0] : [0, 1000,0]; 

export default function useVibration () {

    const start = (pattern: Array<number> = DEFAULT_PATTERN, repeat: boolean = false) => {
        stop();
        Vibration.vibrate(pattern, repeat);
    };

    const stop = () => {
        Vibration.cancel();
    };


    return useMemo(() => ({
        vibrate: (p: Array<number> = DEFAULT_PATTERN, repeat: boolean = false) => start(p, repeat),
        stop: () => stop()
    }), []);
};
