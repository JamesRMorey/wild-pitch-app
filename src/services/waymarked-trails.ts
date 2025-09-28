import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { Route, RouteSearchResult } from "../types";
import { isInUK, mercatorToLngLat } from "../functions/helpers";
import { RouteService } from "./route-service";


export class WaymarkedTrails {

    static search (search: string): Promise<Array<RouteSearchResult>> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("Accept", "application/json, text/plain, */*");
                headers.append("Content-Type", "application/json");

                const options = {
                    method: 'GET',
                    headers: headers
                }
                const term = search.replaceAll(' ', '+').trim();
                const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/list/search?query=${term}`, options);
                const data = await response.json();

                const fullDataRoutes = await Promise.all(
                    data.results.map((r) => this.fetchRoute(r.id))
                );

                const filteredRoutes = fullDataRoutes.filter((r) => isInUK({ latitude: r.latitude, longitude: r.longitude }));

                const results = filteredRoutes?.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.name,
                    distance: item.distance,
                    elevation_gain: null,
                    elevation_loss: null,
                    latitude: item.latitude,
                    longitude: item.longitude,
                })) ?? [];

                return resolve(results);
            } 
            catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    static fetchRoute (id: string): Promise<Route> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("accept", "*/*");
                headers.append("accept-language", "en-US,en;q=0.9");
                headers.append("priority", "u=1, i");

                const options = {
                    method: 'GET',
                    headers: headers
                };

                const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}`, options);
                const data = await response.json();
                
                const markers = data.route.main[0].ways.map((way) => way.geometry.coordinates).reduce((acc, curr) => [...acc, ...curr], []);
                const latLngMarkers = markers.map((m: Position) => mercatorToLngLat(m[0], m[1])).map((pos: Position) => ({ latitude: pos[1], longitude: pos[0] }));
 
                return resolve({
                    id: data.id,
                    name: data.name,
                    notes: `Route provided by Waymarked Trails - waymarkedtrails.org`,
                    markers: latLngMarkers, 
                    latitude: latLngMarkers[0].latitude,
                    longitude: latLngMarkers[0].longitude,
                    distance: RouteService.calculateDistance(latLngMarkers),
                    elevation_gain: undefined,
                    elevation_loss: undefined,
                });
            } 
            catch (error) {
                console.log(error)
                reject(error);
            }
        });
    }
}