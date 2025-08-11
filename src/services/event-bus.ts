import { DeviceEventEmitter } from "react-native"
import { EVENT } from "../consts"
import { PointOfInterest } from "../types"


export class EventBus {

    static emit: any = {
        mapPackDownload: (packName: string) => DeviceEventEmitter.emit(EVENT.MAP_PACK_DOWNLOAD, packName),
        mapInspectPOI: (poi: PointOfInterest) => DeviceEventEmitter.emit(EVENT.MAP_INSPECT_POI, poi),
    }

    static listen: any = {
        mapPackDownload: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_PACK_DOWNLOAD, () => callback()),
        mapInspectPOI: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_INSPECT_POI, (e: PointOfInterest) => callback(e)),
    }
}