import { hasNotch, hasDynamicIsland } from "react-native-device-info";
import { normalise } from "../functions/helpers";

const deviceHasNotch = hasNotch();
const deviceHasDynamicIsland = hasDynamicIsland();
const unknownDevice = (deviceHasNotch !== true || deviceHasNotch !== false) || (deviceHasDynamicIsland !== true || deviceHasDynamicIsland !== false) || deviceHasNotch == 'unknown' || deviceHasDynamicIsland == 'unknown';


export const settings = {
    MAP_DEFAULT_ZOOM: 6,
    MAP_CLOSE_ZOOM: 9,
    MAP_MARKER_ZOOM: 14,
    MAP_PACK_MIN_ZOOM: 9,
    MAP_PACK_MAX_ZOOM: 18,

    TOP_PADDING: ( deviceHasNotch || deviceHasDynamicIsland || unknownDevice ) ? normalise(50) : normalise(15),
}