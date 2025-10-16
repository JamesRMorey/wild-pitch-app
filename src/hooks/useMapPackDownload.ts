import { useState } from 'react';
import { MapPackService } from '../services/map-pack-service';
import { EventBus } from '../services/event-bus';
import { MapPack } from '../types';
import OfflinePack from '@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack';
import { SETTING } from '../consts';

type PropsType = { mapPack: MapPack, onSuccess?: () => void, onFail?: () => void };
export function useMapPackDownload({ mapPack, onSuccess, onFail }: PropsType) {

    const [progress, setProgress] = useState<number>();
    const [downloading, setDownloading] = useState<boolean>(false);
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [errored, setErrored] = useState<boolean>();
    const [offlinePack, setOfflinePack] = useState<OfflinePack>();
    const [pack, setPack] = useState<MapPack>(mapPack);

    const onDownloadProgress = (status: { percentage: number }, refreshOnSuccess: boolean=true) => {
        setProgress(Math.ceil(status.percentage));
        setDownloaded(status.percentage == 100 ? true : false);

        if (status.percentage == 100) {
            EventBus.emit.mapPackDownload(pack.name);
            if (refreshOnSuccess) {
                EventBus.emit.routesRefresh();
                EventBus.emit.packsRefresh();
            }
    
            setDownloading(false);
            setDownloaded(true);
            fetchPack();

            if (onSuccess) onSuccess();
        }
    }

    const fetchPack = async () => {
        const p = await MapPackService.getPack(pack.name);
        
        if (!p) {
            setProgress(0);
            setDownloaded(false);
            setOfflinePack(undefined);
            return;
        }

        setOfflinePack(p);
        setDownloaded(p.pack.state == "complete");
        setProgress(Math.ceil(p.pack.percentage));
    }

    const onDownloadError = (offlineRegion: any, err: any) => {
        setErrored(true);
        setDownloading(false);
        setProgress(0);
        fetchPack();
        if (onFail) onFail();
    }

    const downloadRoute = (refreshOnSuccess: boolean=true) => {
        setErrored(false);
        setProgress(0);

        MapPackService.downloadRoute({
            name: pack.name, 
            styleURL: pack.styleURL, 
            minZoom: SETTING.MAP_PACK_MIN_ZOOM, 
            maxZoom: SETTING.MAP_PACK_MAX_ZOOM,
            bounds: pack.bounds
        }, (offlineRegion: any, status: { percentage: number }) => onDownloadProgress(status, refreshOnSuccess), onDownloadError);

        setDownloading(true);
    }

    return { 
        progress,
        errored,
        downloading,
        downloaded,
        offlinePack,
        pack,
        setPack,
        downloadRoute,
        checkDownloaded: fetchPack
    };
}
