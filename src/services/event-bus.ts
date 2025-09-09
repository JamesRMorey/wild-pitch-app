import { DeviceEventEmitter } from "react-native"
import { EVENT } from "../consts"
import { PointOfInterest } from "../types"


export class EventBus {

    static emit: any = {
        mapPackDownload: (packName: string) => DeviceEventEmitter.emit(EVENT.MAP_PACK_DOWNLOAD, packName),
        mapInspectPOI: (poi: PointOfInterest) => DeviceEventEmitter.emit(EVENT.MAP_INSPECT_POI, poi),
        inspectRoute: (route: any) => DeviceEventEmitter.emit(EVENT.INSPECT_ROUTE, route),
        poiRefresh: () => DeviceEventEmitter.emit(EVENT.POI_REFRESH),
        packsRefresh: () => DeviceEventEmitter.emit(EVENT.PACKS_REFRESH),
        routesRefresh: () => DeviceEventEmitter.emit(EVENT.ROUTES_REFRESH),
    }

    static listen: any = {
        mapPackDownload: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_PACK_DOWNLOAD, () => callback()),
        mapInspectPOI: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_INSPECT_POI, (e: PointOfInterest) => callback(e)),
        inspectRoute: (callback: Function) => DeviceEventEmitter.addListener(EVENT.INSPECT_ROUTE, (e: any) => callback(e)),
        poiRefresh: (callback: Function) => DeviceEventEmitter.addListener(EVENT.POI_REFRESH, (e: PointOfInterest) => callback(e)),
        packsRefresh: (callback: Function) => DeviceEventEmitter.addListener(EVENT.PACKS_REFRESH, (e: PointOfInterest) => callback(e)),
        routesRefresh: (callback: Function) => DeviceEventEmitter.addListener(EVENT.ROUTES_REFRESH, (e: PointOfInterest) => callback(e)),
    }
}