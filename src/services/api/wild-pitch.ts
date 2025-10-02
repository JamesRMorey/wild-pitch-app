import { User } from "../../types";

export class WildPitchApi {

    url;

    constructor() {
        this.url = 'https://api.wild-pitch.co.uk';
    }

    login (data : { email: string, password: string }): Promise<{ token: string, user: User}> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("Accept", "application/json, text/plain, */*");
                headers.append("Content-Type", "application/json");

                const options = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                }

                const response = await fetch(`${this.url}/login`, options);

                if (!response.ok) {
                    reject(await response.json());
                }

                return resolve(await response.json());
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    register (data : { email: string, password: string, name: string, password_confirm: string, gender?: string }): Promise<{ token: string, user: User}> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = new Headers();
                headers.append("Accept", "application/json, text/plain, */*");
                headers.append("Content-Type", "application/json");

                const options = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                }

                const response = await fetch(`${this.url}/register`, options);

                if (!response.ok) {
                    reject(await response.json());
                }

                return resolve(await response.json());
            } 
            catch (error) {
                reject(error);
            }
        });
    }
}