import { Route, RouteSearchResult, User } from "../types";
import { OSMaps } from "./api/os-maps";
import { WaymarkedTrails } from "./api/waymarked-trails";


export class RouteProvider {

    provider: OSMaps|WaymarkedTrails;

    constructor( user: User ) {
        // switch (this.provider) {
        //     case ROUTE_PROVIDER.OS_MAPS:
        //         return await OSMaps.search(term);
        //     case ROUTE_PROVIDER.WAYMARKED_TRAILS:
        //         return await WaymarkedTrails.search(term);
        // }
        this.provider = OSMaps;
    }

    async search( term: string ): Promise<Array<RouteSearchResult>|undefined> {
        return await this.provider.search(term);
    }

    async fetchRoute(id: string, slug?: string): Promise<Route|undefined> {
        return this.provider.fetchRoute(id, slug)
    }
}