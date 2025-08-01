import { MapPack } from "../types";
import Mapbox from "@rnmapbox/maps";


export class MapPackService {

    static async download ( pack: MapPack, onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void) 
    {
        await Mapbox.offlineManager.createPack(pack, onProgress, onError);
    }
}