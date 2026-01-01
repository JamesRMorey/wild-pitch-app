import { User } from "../../types";
import * as Keychain from 'react-native-keychain';

export class WildPitchApi {

    url;

    constructor() {
        this.url = 'https://api.wild-pitch.co.uk';
    }

    init() {
        this.url = 'https://api.wild-pitch.co.uk';
    }

    async login( data: { email: string; password: string } ): Promise<{ token: string; user: User }> {
        const response = await fetch(`${this.url}/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw await response.json();
        }

        return response.json();
    }


    async register(
        data: {
            email: string;
            password: string;
            name: string;
            password_confirm: string;
            gender?: string;
        }
    ): Promise<{ token: string; user: User }> {
        const response = await fetch(`${this.url}/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw await response.json();
        }

        return response.json();
    }


    async deleteAccount(): Promise<void> {
        const credentials = await Keychain.getGenericPassword({ service: 'wild_pitch' });
        if (!credentials) {
            throw new Error('No credentials found');
        }

        const response = await fetch(`${this.url}/delete-account`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.password}`
            },
        });

        if (!response.ok) {
            throw await response.json();
        }
    }
}