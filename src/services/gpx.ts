import { pick } from "@react-native-documents/picker";
import RNFS from "react-native-fs";

export class GPX {

    static async export ( gpx: string, name: string ) {
        const path = `${RNFS.DocumentDirectoryPath}/${name}`;
        await RNFS.writeFile(path, gpx, 'utf8');

        return path;
    }

    static async import (): Promise<string|void> {
        const [result] = await pick();

        if (!result) return;
        if (!result.name?.endsWith('.gpx')) return;

        return await this.readFile(result.uri);
    }

    static parse () {

    }

    static async readFile ( uri: string ): Promise<string> {
        let path = uri;

        if (path.startsWith("file://")) {
            path = decodeURIComponent(path.replace("file://", ""));
        }

        return await RNFS.readFile(path, "utf8");
    }

    static escapeXml ( str: string ): string {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}