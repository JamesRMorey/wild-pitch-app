import { normalise } from "../utils/helpers";
import { COLOUR } from "../styles";
import { initialWindowMetrics } from 'react-native-safe-area-context';

const { top } = initialWindowMetrics?.insets;

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
    MAX_MAP_AREA: 50000000, //m2
    TOP_PADDING: top,
}