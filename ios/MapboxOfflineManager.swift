import Foundation
import MapboxMaps
import React

@objc(MapboxOfflineManager)
class MapboxOfflineManager: NSObject {

  @objc
  func removeOfflineRegion(_ regionId: String,
                           resolver: @escaping RCTPromiseResolveBlock,
                           rejecter: @escaping RCTPromiseRejectBlock) {
    let tileStore = TileStore.default

    // Your SDK only supports this synchronous signature
    tileStore.removeTileRegion(forId: regionId)

    // No completion available, so just resolve immediately
    resolver("✅ Requested removal of tile region \(regionId)")
  }
}
