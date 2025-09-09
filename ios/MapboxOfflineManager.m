#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MapboxOfflineManager, NSObject)
RCT_EXTERN_METHOD(removeOfflineRegion:(NSString *)regionId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
