import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import { Coordinate, Place, Route, RouteSearchResult } from "../types";


export class OSMaps {

    static search (search: string): Promise<Array<RouteSearchResult>> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("Accept", "application/json, text/plain, */*");
                headers.append("Content-Type", "application/json");

                const options = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        "name": search,
                        "premiumOnly": true,
                        "pageParameters": {
                            "size": 25,
                            "order": [
                                {
                                    "property": "metadata.rating.count",
                                    "direction": "DESC"
                                },
                                {
                                    "property": "metadata.rating.average",
                                    "direction": "DESC"
                                },
                                {
                                    "property": "metadata.modifiedAt"
                                }
                            ]
                        }
                    })
                }

                const response = await fetch(`https://consumerplatform.ordnancesurvey.co.uk/route-api/v1/routes/search`, options);
                const data = await response.json();
                // console.log(data.content[0])
                const results = data?.content?.map((item: any) => ({
                    id: item.id,
                    name: item.metadata.name,
                    slug: item.metadata.slugName,
                    distance: item.characteristics.distance,
                    elevation_gain: item.characteristics.elevationAscent,
                    elevation_loss: item.characteristics.elevationDescent,
                    latitude: item.startPoint.coordinates[1],
                    longitude: item.startPoint.coordinates[0],
                })) ?? [];

                return resolve(results);
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    static fetchRoute (id: string, slug: string): Promise<Route> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("accept", "*/*");
                headers.append("accept-language", "en-US,en;q=0.9");
                headers.append("priority", "u=1, i");

                const options = {
                    method: 'GET',
                    headers: headers,
                    redirect: 'follow'
                };

                const response = await fetch(`https://explore.osmaps.com/_next/data/EqzcGASzlWJFVN-snyqE1/en/route/${id}/${slug}.json`, options);
                const data = await response.json();
                const routeData = data.pageProps.route.data;
                
                const markersPositions = routeData.features.find((f: any) => f.geometry.type == "LineString")?.geometry.coordinates;
                return resolve({
                    id: routeData.id,
                    name: routeData.metadata.name,
                    notes: routeData.metadata.description,
                    markers: markersPositions.map((pos: Position) => ({ latitude: pos[1], longitude: pos[0] })), 
                    latitude: routeData.startPoint.coordinates[1],
                    longitude: routeData.startPoint.coordinates[0],
                    distance: routeData.characteristics.distance,
                    elevation_gain: routeData.characteristics.elevationAscent,
                    elevation_loss: routeData.characteristics.elevationDescent,
                });
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    static searchMapArea (ne: Coordinate, sw: Coordinate): Promise<Array<RouteSearchResult>> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("Accept", "application/json, text/plain, */*");
                headers.append("Content-Type", "application/json");

                const options = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        "boundingBox":[sw.longitude, sw.latitude, ne.longitude, ne.latitude],
                        "premiumOnly": true,
                        "pageParameters": {
                            "size": 200,
                            "order": [
                                {
                                    "property": "metadata.rating.count",
                                    "direction": "DESC"
                                },
                                {
                                    "property": "metadata.rating.average",
                                    "direction": "DESC"
                                },
                                {
                                    "property": "metadata.modifiedAt"
                                }
                            ]
                        }
                    })
                }

                const response = await fetch(`https://consumerplatform.ordnancesurvey.co.uk/route-api/v1/routes/search`, options);
                const data = await response.json();

                if (!data?.content || data.content.length === 0) {
                    return reject();
                }

                const results = data?.content?.map((item: any) => ({
                    id: item.id,
                    name: item.metadata.name,
                    slug: item.metadata.slugName,
                    distance: item.characteristics.distance,
                    elevation_gain: item.characteristics.elevationAscent,
                    elevation_loss: item.characteristics.elevationDescent,
                    latitude: item.startPoint.coordinates[1],
                    longitude: item.startPoint.coordinates[0],
                })) ?? [];

                return resolve(results);
            } 
            catch (error) {
                reject(error);
            }
        });
    }
}