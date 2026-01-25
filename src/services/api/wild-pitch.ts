import { ENVIRONMENT } from "../../../ENV";
import { Route, RouteSearchResult, User } from "../../types";
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

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
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

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
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

    static async createRoute ( data: Route ): Promise<Route> {
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
        
        if (!response.ok) {
            throw new Error(await response.json());
        }

        return await response.json()
    }

    static async updateRoute ( id: number, data: Route ): Promise<Route> {
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
        
        if (!response.ok) {
            throw new Error(await response.json());
        }

        return await response.json()
    }

    static async fetchUserRoutes (): Promise<Array<Route>> {
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

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return await response.json();
    }
    
    static async deleteRoute( route: Route ): Promise<void> {
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

    static async searchRoutes (filters: { query: string }): Promise<Array<RouteSearchResult>> {
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

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return await response.json();
    }

    static async findRoute (id: string): Promise<Route> {
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
        
        if (!response.ok) {
            throw new Error(await response.json());
        }

        return await response.json();
    }

    static async fetchBookmarkedRoutes (): Promise<Array<Route>> {
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
        console.log(response)
        if (!response.ok) {
            throw new Error(await response.json());
        }

        return await response.json();
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
        console.log(response);
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
        console.log(response);
        if (!response.ok) {
            throw new Error(await response.json());
        }
    }
}