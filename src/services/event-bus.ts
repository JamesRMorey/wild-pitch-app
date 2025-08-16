import { DeviceEventEmitter } from "react-native"
import { EVENT } from "../consts"
import { PointOfInterest } from "../types"


export class EventBus {

    static emit: any = {
        mapPackDownload: (packName: string) => DeviceEventEmitter.emit(EVENT.MAP_PACK_DOWNLOAD, packName),
        mapInspectPOI: (poi: PointOfInterest) => DeviceEventEmitter.emit(EVENT.MAP_INSPECT_POI, poi),
        poiRefresh: () => DeviceEventEmitter.emit(EVENT.POI_REFRESH),
    }

    static listen: any = {
        mapPackDownload: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_PACK_DOWNLOAD, () => callback()),
        mapInspectPOI: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_INSPECT_POI, (e: PointOfInterest) => callback(e)),
        poiRefresh: (callback: Function) => DeviceEventEmitter.addListener(EVENT.POI_REFRESH, (e: PointOfInterest) => callback(e)),
    }
}