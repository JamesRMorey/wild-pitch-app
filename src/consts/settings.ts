import { hasNotch, hasDynamicIsland } from "react-native-device-info";
import { normalise } from "../functions/helpers";
import { COLOUR } from "../styles";

const deviceHasNotch = hasNotch();
const deviceHasDynamicIsland = hasDynamicIsland();
const unknownDevice = (deviceHasNotch !== true || deviceHasNotch !== false) || (deviceHasDynamicIsland !== true || deviceHasDynamicIsland !== false) || deviceHasNotch == 'unknown' || deviceHasDynamicIsland == 'unknown';


export const settings = {
    MAP_DEFAULT_ZOOM: 6,
    MAP_CLOSE_ZOOM: 9,
    MAP_CLOSEST_ZOOM: 12,
    MAP_MARKER_ZOOM: 14,
    MAP_PACK_MIN_ZOOM: 14,
    MAP_PACK_MAX_ZOOM: 18,
    ROUTE_CLOSE_ZOOM: 16,
    ROUTE_DEFAULT_ZOOM: 12,
    ROUTE_LINE_COLOUR: COLOUR.blue[500],

    TOP_PADDING: ( deviceHasNotch || deviceHasDynamicIsland || unknownDevice ) ? normalise(50) : normalise(15),
}