import Mapbox from "@rnmapbox/maps";
import { MapPack as MapPackType } from "../types";


export class MapPack {

    pack: MapPackType

    constructor({ name, styleURL, minZoom, maxZoom, bounds } : MapPackType) {
        this.pack = {
            name: name,
            styleURL: styleURL,
            minZoom: minZoom,
            maxZoom: maxZoom,
            bounds: bounds
        };
    }

    async download ( onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void ) 
    {
        await Mapbox.offlineManager.createPack(this.pack, onProgress, onError);
    }
}