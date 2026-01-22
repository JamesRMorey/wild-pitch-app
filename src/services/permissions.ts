import { Alert, PermissionsAndroid, Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";


export class Permission {

    static location (): Promise<void> {
        return new Promise( async (resolve, reject): Promise<void> => {
            if (Platform.OS == 'ios') {
                check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                .then((result) => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                        //   console.log('This feature is not available (on this device / in this context)');
                            reject('This feature is not available (on this device / in this context)')
                            break;
                        case RESULTS.DENIED:
                            // console.log('The permission has not been requested / is denied but requestable');
                            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                            .then((result) => {
                                if (result != 'granted') {
                                    Alert.alert('We need your location to show your position on the main map and measure distances to points from you. We do not transmit this location off the device. You need to enable location permission in your device settings.');
                                    reject("You can't play without location permission");
                                }
                                resolve();
                            }).catch((error) => {0
                                reject();
                            });
                        break;
                        case RESULTS.LIMITED:
                            // console.log('The permission is limited: some actions are possible');
                            reject("You can't play without location permission");
                            break;
                        case RESULTS.GRANTED:
                            // console.log('The permission is granted');
                            resolve();
                            break;
                        case RESULTS.BLOCKED:
                            // console.log('The permission is denied and not requestable anymore');
                            Alert.alert('We need your location to show your position on the main map and measure distances to points from you. We do not transmit this location off the device. You need to enable location permission in your device settings.');
                            reject("You can't play without location permission");
                            break;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject("You can't play without location permission");
                });
            } 
            else {
                try {
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // console.log("You can use the location");
                        resolve('location permission granted');
                    } else {
                        // console.log("location permission denied");
                        Alert.alert("Enable location permission in your device settings");
                        reject("You can't play without location permission");
                    }
                } 
                catch (err) {
                    console.log(err);
                    reject("You can't play without location permission");
                }
            }
        });
    }
}