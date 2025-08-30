import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack";
import { MapPackGroupRepository } from "../database/repositories/map-pack-group-repository";
import { MapPack, MapPackGroup } from "../types";
import Mapbox from "@rnmapbox/maps";


export class MapPackService {

    static downloadProgress (pack: any, group: MapPackGroup, status: any, onProgress: (pack: any, status: any) => void)
    {
        if (status.percentage == 100) {
            const repo = new MapPackGroupRepository();
            repo.create(group)
        } 
        onProgress(pack, status);
    }
    
    static async download ( pack: MapPack, group: MapPackGroup, onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void) 
    {
        Mapbox.offlineManager.createPack(pack, (pack, status) => this.downloadProgress(pack, group, status, onProgress), onError);
    }

    static async removeDownload ( pack: MapPack ) 
    {
        Mapbox.offlineManager.deletePack(pack.name);
    }

    static async removeDownloads ( packGroup: MapPackGroup ) 
    {
        const packName = `${packGroup.key}_OUTDOORS`;
        Mapbox.offlineManager.deletePack(packName);
    }

    static getKey ( input: string ): string {
        const name = input
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_');

        return name;
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

    static async getPack ( name: string ): Promise<OfflinePack|undefined> {
        const p = await Mapbox.offlineManager.getPack(name);
        return p;
    }

    static async getOfflinePacks (): Promise<Array<MapPack>> {
        const packs = await Mapbox.offlineManager.getPacks();
        
        return packs.map((pack, i) => {
            const meta = pack.metadata;
            
            return {
                name: pack.name,
                styleURL: meta.styleURI
            }
        });
    }
}