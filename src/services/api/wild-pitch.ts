import { ENVIRONMENT } from "../../../ENV";
import { Bounds, Filters, RouteData, RouteSearchResult, User } from "../../types";
import * as Keychain from 'react-native-keychain';


export class WildPitchApi {

    static async login( data: { email: string; password: string } ): Promise<{ token: string; user: User }> {
        const response = await fetch(`${ENVIRONMENT.api_url}/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log('login', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }


    static async register(
        data: {
            email: string;
            password: string;
            name: string;
            password_confirm: string;
            gender?: string;
        }
    ): Promise<{ token: string; user: User }> {
        const response = await fetch(`${ENVIRONMENT.api_url}/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log('register', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }

    static async deleteAccount(): Promise<void> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/delete-account`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }
    }

    static async createRoute ( data: RouteData ): Promise<RouteData> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log('createRoute', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }

    static async updateRoute ( id: number, data: RouteData ): Promise<RouteData> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log('updateRoute', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }

    static async makeRoutePublic ( id: number ): Promise<RouteData> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/${id}/public`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });
        
        const result = await response.json();
        console.log('makeRoutePublic', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }
    
    static async fetchUserRoutes (): Promise<Array<RouteData>> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });

        const result = await response.json();
        console.log('fetchUserRoutes', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }
    
    static async deleteRoute( route: RouteData ): Promise<void> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/${route.server_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });
        
        if (!response.ok) {
            throw new Error(await response.json());
        }
    }

    static async searchRoutes (filters: Filters): Promise<Array<RouteSearchResult>> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }
        console.log(filters)
        const response = await fetch(`${ENVIRONMENT.api_url}/routes/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            },
            body: JSON.stringify(filters)
        });

        const result = await response.json();
        console.log('searchRoutes', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }

    static async findRoute (id: number): Promise<RouteData> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });
        
        const result = await response.json();
        console.log('findRoute', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }

    static async fetchBookmarkedRoutes (): Promise<Array<RouteData>> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/bookmarked`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });

        const result = await response.json();
        console.log('fetchBookmarkedRoutes', response, result);

        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }

    static async bookmarkRoute ( id: number ): Promise<void> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/${id}/bookmark`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });

        console.log('bookmarkRoute', response);
        
        if (!response.ok) {
            throw new Error(await response.json());
        }
    }

    static async removeBookmarkedRoute ( id: number ): Promise<void> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/${id}/bookmark`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            }
        });
        
        if (!response.ok) {
            throw new Error(await response.json());
        }
    }

    static async searchFeaturedRoutes (filters?: { query: string }): Promise<Array<RouteSearchResult>> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${ENVIRONMENT.api_url}/routes/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            },
            body: JSON.stringify(filters)
        });

        const result = await response.json();
        console.log('searchFeaturedRoutes', response, result);
        
        if (!response.ok) {
            throw new Error(result);
        }

        return result;
    }
}