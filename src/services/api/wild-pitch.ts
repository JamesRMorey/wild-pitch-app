import { Route, User } from "../../types";
import * as Keychain from 'react-native-keychain';

const URL = 'https://api.wild-pitch.co.uk';

export class WildPitchApi {

    static async login( data: { email: string; password: string } ): Promise<{ token: string; user: User }> {
        const response = await fetch(`${URL}/login`, {
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
        const response = await fetch(`${URL}/register`, {
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

        const response = await fetch(`${URL}/delete-account`, {
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

        const response = await fetch(`${URL}/routes`, {
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

        const response = await fetch(`${URL}/routes/${id}`, {
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

    static async fetchSavedRoutes (): Promise<Array<Route>> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${URL}/routes`, {
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

        const response = await fetch(`${URL}/routes/${route.server_id}`, {
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
}