import { DeviceEventEmitter } from "react-native"
import { EVENT } from "../consts"


export class EventBus {

    static emit: any = {
        mapPackDownload: (packName: string) => DeviceEventEmitter.emit(EVENT.MAP_PACK_DOWNLOAD, packName)
    }

    static listen: any = {
        mapPackDownload: (callback: Function) => DeviceEventEmitter.addListener(EVENT.MAP_PACK_DOWNLOAD, () => callback())
    }
}