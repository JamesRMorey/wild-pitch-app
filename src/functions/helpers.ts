import { Dimensions, PixelRatio } from 'react-native';

/** function to normalise fonts etc based on screen size */
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 11's scale
const scale = (SCREEN_WIDTH / 414) > 1 ? (SCREEN_WIDTH / 414) : 1;

export const normalise = (size) => {
    try {
        const newSize = size * scale;
        const minRatio = 0.9;
        return Math.max(Math.round(PixelRatio.roundToNearestPixel(newSize), Math.round(PixelRatio.roundToNearestPixel(minRatio * size))));
    } 
    catch (error) {
        console.log(error);
        return size;
    }
}

export const getDistanceBetweenPoints = (point1, point2) => {
    try {
        let ky = 40000 / 360;
        let kx = Math.cos((Math.PI * point1.latitude) / 180.0) * ky;
        let dx = Math.abs(point1.longitude - point2.longitude) * kx;
        let dy = Math.abs(point1.latitude - point2.latitude) * ky;

        return parseInt(Math.sqrt(dx * dx + dy * dy) * 1000);
    } catch (err) {
        return 1000000000000;
    }
}

export const getBearing = (point1, point2) => {
    try {
        // Convert latitude and longitude to radians
        const lat1 = point1.latitude * Math.PI / 180;
        const long1 = point1.longitude * Math.PI / 180;
        const lat2 = point2.latitude * Math.PI / 180;
        const long2 = point2.longitude * Math.PI / 180;

        let bearing = Math.atan2(
            Math.sin(long2 - long1) * Math.cos(lat2),
            Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2 - long1)
        )

        //   Convert the bearing to degrees
        bearing = (bearing) * 180 / Math.PI;

        // Make sure the bearing is positive
        return bearing = (bearing + 360) % 360
    } catch (err) {
        return false;
    }
}

export const randomNumberBetween = (min, max) => {
    return Math.random() * (max - min) + min;
}

export const randomIntBetween = (min, max): number => {
    min = Math.ceil(min);
    max = Math.floor(max) + 0.49;
    return Math.round(Math.random() * (max - min) + min);
}

export const formatSecondsToMin = (seconds) => {
    const minutes = Math.floor(seconds / 60) <= 9 ? '0' + Math.floor(seconds / 60).toString() : Math.floor(seconds / 60).toString();
    const second = (seconds % 60) <= 9 ? '0' + (seconds % 60).toString() : (seconds % 60).toString();

    return '' + minutes + ':' + second + '';
}

export const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const trimBase64String = (base64) => {
    return new Promise((resolve, reject) => {
        const base64String = base64.split(',')[1]; // Extract the Base64 string without the prefix
        resolve(base64String);
    })
}

export const convertPhotoToBase64 = async (photoPath, trim = true) => {
    const result = await fetch(`file://${photoPath}`)
    const blob = await result.blob();

    const base64 = await blobToBase64(blob);

    if (trim) {
        const trimmedBase64 = await trimBase64String(base64);
        return trimmedBase64;
    }

    return base64;
}

export const delay = ( ms: number ): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

export const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export async function withRetries( func, retries = 5 ) {
    let attempts = 0;
    return new Promise(async function (resolve, reject) {
        while (attempts < retries) {
            try {
                const result = await func();
                resolve(result);
                return;
            } catch (e) {
                attempts++;
                if (attempts >= retries) {
                    reject(e);
                    return;
                }
                await delay(2000);
            }
        }
    });
}

export const formatTimeStampToDate = (timestamp) => {
    const date = new Date(timestamp);

    const minutes = String(date.getMinutes()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export function getRelativeHeading(userLocation, targetLocation) {
  const { latitude: lat1, longitude: lon1, heading } = userLocation.coords;
  const { latitude: lat2, longitude: lon2 } = targetLocation;

  // If heading is -1, device is likely not moving / unknown
  if (heading === -1) return null;

  // Calculate the bearing from user location to target
  const bearingToTarget = getBearingBetweenPoints(lat1, lon1, lat2, lon2);

  // Calculate relative angle (difference between your heading and the target's bearing)
  let relativeHeading = bearingToTarget - heading;

  // Normalize to 0–360
  if (relativeHeading < 0) relativeHeading += 360;
  if (relativeHeading >= 360) relativeHeading -= 360;

  return relativeHeading;
}

// Compute bearing using basic formula (forward azimuth)
export function getBearingBetweenPoints(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const toDeg = rad => rad * 180 / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360; // normalize
}