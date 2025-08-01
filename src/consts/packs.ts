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
                styleURL: Mapbox.StyleURL.Satellite,
                size: 320,
            },
            {
                name: 'PEAK_DISTRICT_BLEAKLOW_STREET',
                styleURL: Mapbox.StyleURL.Street,
                size: 320,
            }
        ]
    },
    {
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
                styleURL: Mapbox.StyleURL.Satellite,
                size: 340,
            },
            {
                name: 'PEAK_DISTRICT_KINDER_SCOUT_STREET',
                styleURL: Mapbox.StyleURL.Street,
                size: 280,
            }
        ]
    },
    {
        name: 'Derwent Valley Peak District',
        description: 'Explore the stunning Derwent Valley with its historic reservoirs and surrounding moorland. Home to the famous Derwent Dam, used for Dambusters training during WWII.',
        bounds: PEAK_DISTRICT_DERWENT_VALLEY_BOUNDS,
        minZoom: 9,
        maxZoom: 18,
        center: [-1.663312, 53.435520],
        packs: [
            {
                name: 'PEAK_DISTRICT_DERWENT_VALLEY_OUTDOORS',
                styleURL: Mapbox.StyleURL.Outdoors,
                size: 150,
            },
            {
                name: 'PEAK_DISTRICT_DERWENT_VALLEY_SATELLITE',
                styleURL: Mapbox.StyleURL.Satellite,
                size: 390,
            },
            {
                name: 'PEAK_DISTRICT_DERWENT_VALLEY_STREET',
                styleURL: Mapbox.StyleURL.Street,
                size: 200,
            }
        ]
    },
    {
        name: 'Edale Valley Peak District',
        description: 'Experience the beauty of Edale Valley, the southern gateway to the Dark Peak and starting point of the Pennine Way. Rolling hills and traditional Peak District villages await.',
        bounds: PEAK_DISTRICT_EDALE_BOUNDS,
        minZoom: 9,
        maxZoom: 18,
        center: [-1.762777, 53.388910],
        packs: [
            {
                name: 'PEAK_DISTRICT_EDALE_OUTDOORS',
                styleURL: Mapbox.StyleURL.Outdoors,
                size: 110,
            },
            {
                name: 'PEAK_DISTRICT_EDALE_SATELLITE',
                styleURL: Mapbox.StyleURL.Satellite,
                size: 300,
            },
            {
                name: 'PEAK_DISTRICT_EDALE_STREET',
                styleURL: Mapbox.StyleURL.Street,
                size: 250,
            }
        ]
    },
    {
        name: 'Winnats Pass Peak District',
        description: 'Navigate the dramatic limestone gorge of Winnats Pass near Castleton. This spectacular valley features towering limestone cliffs and leads to the famous Blue John Cavern.',
        bounds: PEAK_DISTRICT_WINNATS_PASS_BOUNDS,
        minZoom: 9,
        maxZoom: 18,
        center: [-1.772128, 53.350520],
        packs: [
            {
                name: 'PEAK_DISTRICT_WINNATS_PASS_OUTDOORS',
                styleURL: Mapbox.StyleURL.Outdoors,
                size: 90,
            },
            {
                name: 'PEAK_DISTRICT_WINNATS_PASS_SATELLITE',
                styleURL: Mapbox.StyleURL.Satellite,
                size: 280,
            },
            {
                name: 'PEAK_DISTRICT_WINNATS_PASS_STREET',
                styleURL: Mapbox.StyleURL.Street,
                size: 180,
            }
        ]
    },
]