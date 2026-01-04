import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack";
import { MapPack, MapPackGroup } from "../types";
import Mapbox from "@rnmapbox/maps";
import { NativeModules } from 'react-native';

const { MapboxOfflineManager } = NativeModules;

export class MapPackService {
    
    static async download ( pack: MapPack, onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void) 
    {
        Mapbox.offlineManager.createPack(pack, (pack, status) => onProgress(pack, status), onError);
    }

    static async removeDownload ( name: string ) 
    {
        try {
            await Mapbox.offlineManager.deletePack(name);
            await Mapbox.offlineManager.invalidatePack(name);
            await MapboxOfflineManager.removeOfflineRegion(name);
            console.log('Deleted Mapbox offline database');
            console.log('Deleted pack:', name);
        }
        catch (e) {
            console.error('Failed to delete Mapbox offline database', e);
        }
    }

    static async removeDownloads ( packGroup: MapPackGroup ) 
    {
        const name = `${packGroup.key}_OUTDOORS`;
        await this.removeDownload(name);
    }

    static getKey ( input: string ): string {
        const name = input
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_');

        return name;
    }

    static getPackName ( input: string, styleURL: Mapbox.StyleURL ): string {
        const name = this.getKey(input);

        switch (styleURL) {
            case Mapbox.StyleURL.Outdoors:
                return `${name}_OUTDOORS`;
            case Mapbox.StyleURL.SatelliteStreet:
                return `${name}_SATELLITE`;
            case Mapbox.StyleURL.Street:
                return `${name}_STREET`;
            default:
                return name;
        }
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