import Mapbox from "@rnmapbox/maps";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { MapPackGroup } from "../types";

const PEAK_DISTRICT_BLEAKLOW_BOUNDS: [Position, Position] = [
    [-2.007022, 53.344180],
    [-1.691721, 53.518641],
];

const PEAK_DISTRICT_KINDER_SCOUT_BOUNDS: [Position, Position] = [
    [-2.087021, 53.372180],
    [-1.765432, 53.452641],
];

const PEAK_DISTRICT_DERWENT_VALLEY_BOUNDS: [Position, Position] = [
    [-1.784521, 53.385420],
    [-1.542103, 53.485621],
];

const PEAK_DISTRICT_EDALE_BOUNDS: [Position, Position] = [
    [-1.873214, 53.352180],
    [-1.652341, 53.425641],
];

const PEAK_DISTRICT_WINNATS_PASS_BOUNDS: [Position, Position] = [
    [-1.832154, 53.315420],
    [-1.712103, 53.385621],
];

export const PACK_GROUPS : Array<MapPackGroup> = [
    {
        id: 1,
        key: 'PEAK_DISTRICT_BLEAKLOW',
        name: 'Bleaklow Peak District',
        description: 'Explore the rugged moorland and dramatic landscapes of Bleaklow in the Peak District. This remote plateau offers challenging terrain and stunning views across the Dark Peak.',
        bounds: PEAK_DISTRICT_BLEAKLOW_BOUNDS,
        minZoom: 9,
        maxZoom: 18,
        center: [-1.8493715, 53.4314105],
        packs: [
            {
                name: 'PEAK_DISTRICT_BLEAKLOW_OUTDOORS',
                styleURL: Mapbox.StyleURL.Outdoors,
                size: 100,
            },
            {
                name: 'PEAK_DISTRICT_BLEAKLOW_SATELLITE',
                styleURL: Mapbox.StyleURL.SatelliteStreet,
                size: 320,
            }
        ]
    },
    {
        id: 2,
        key: 'PEAK_DISTRICT_KINDER_SCOUT',
        name: 'Kinder Scout Peak District',
        description: 'Discover the highest peak in the Peak District at Kinder Scout. Famous for the Mass Trespass of 1932, this plateau offers dramatic gritstone edges and sweeping moorland views.',
        bounds: PEAK_DISTRICT_KINDER_SCOUT_BOUNDS,
        minZoom: 9,
        maxZoom: 18,
        center: [-1.926226, 53.412410],
        packs: [
            {
                name: 'PEAK_DISTRICT_KINDER_SCOUT_OUTDOORS',
                styleURL: Mapbox.StyleURL.Outdoors,
                size: 120,
            },
            {
                name: 'PEAK_DISTRICT_KINDER_SCOUT_SATELLITE',
                styleURL: Mapbox.StyleURL.SatelliteStreet,
                size: 340,
            }
        ]
    }
]