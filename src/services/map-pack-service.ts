import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack";
import { MapPackGroupRepository } from "../database/repositories/map-pack-group-repository";
import { MapPack, MapPackGroup } from "../types";
import Mapbox from "@rnmapbox/maps";
import { NativeModules } from 'react-native';

const { MapboxOfflineManager } = NativeModules;

export class MapPackService {

    static downloadProgress (userId: number, pack: any, group: MapPackGroup, status: any, onProgress: (pack: any, status: any) => void)
    {
        if (status.percentage == 100) {
            const repo = new MapPackGroupRepository(userId);
            repo.create(group)
        } 
        onProgress(pack, status);
    }
    
    static async download ( pack: MapPack, userId: number, group: MapPackGroup, onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void) 
    {
        Mapbox.offlineManager.createPack(pack, (pack, status) => this.downloadProgress(userId, pack, group, status, onProgress), onError);
    }

    static async downloadRoute ( pack: MapPack, onProgress: (pack: any, status: any) => void, onError: (offlineRegion: any, err: any) => void) 
    {
        Mapbox.offlineManager.createPack(pack, (pack, status) => onProgress(pack, status), onError);
    }

    static async removeDownload ( pack: MapPack ) 
    {
        Mapbox.offlineManager.deletePack(pack.name);
        try {
            await MapboxOfflineManager.removeOfflineRegion(pack.name);
            console.log('Deleted Mapbox offline database');
        }
        catch (e) {
            console.error('Failed to delete Mapbox offline database', e);
        }
        console.log('Deleted pack:', pack.name);
    }

    static async removeDownloads ( packGroup: MapPackGroup ) 
    {
        const packName = `${packGroup.key}_OUTDOORS`;
        await this.removeDownload({ name: packName, styleURL: '' });
    }

    static getKey ( input: string ): string {
        const name = input
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_');

        return name;
    }

    static getPackName ( input: string, styleURL: Mapbox.StyleURL ): string {
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