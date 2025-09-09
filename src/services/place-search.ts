import { Place } from "../types";


export class PlaceSearch {

    static search (search: string): Promise<Array<Place>> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&countrycodes=GB`);
                const data = await response.json();

                const places: Array<Place> = data.map((item: any) => ({
                    id: item.place_id,
                    name: item.name,
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                    address: item.display_name,
                    category: item.type
                }));

                return resolve(places);
            } 
            catch (error) {
                reject(error);
            }
        });
    }
}