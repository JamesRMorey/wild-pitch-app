import { useMemo } from 'react';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export default function useHaptic () {

    const tick = () => {
        ReactNativeHapticFeedback.trigger("impactLight");
    };


    return useMemo(() => ({
        tick: () => tick()
    }), []);
};
