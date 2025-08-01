import { MapPack } from "../types";
import Mapbox from "@rnmapbox/maps";


export class MapPackService {

    static async download ( pack: MapPack, onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void) 
    {
        await Mapbox.offlineManager.createPack(pack, onProgress, onError);
    }

    static getPackName ( input: string, styleURL: Mapbox.StyleURL ): string|null {
        const name = input
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_');

        switch (styleURL) {
            case Mapbox.StyleURL.Outdoors:
                return `${name}_OUTDOORS`;
            case Mapbox.StyleURL.SatelliteStreet:
                return `${name}_SATELLITE`;
            case Mapbox.StyleURL.Street:
                return `${name}_STREET`;
        }

        return null;
    }
}