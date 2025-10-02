import { open } from 'react-native-nitro-sqlite'
import { PointType } from '../../types';
import { getDB } from '../db';


export class PointTypeRepository {

    db;
    tableName;

    constructor () {
        const db = getDB();
        this.db = db;
        this.tableName = 'point_types';
        this.createTable();
        this.seed();
    }

    createTable (): void {
        this.db.execute(`
            CREATE TABLE IF NOT EXISTS point_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                icon TEXT NOT NULL,
                colour TEXT NOT NULL
            )
        `);    
    }

    seed (): void {
        this.db.execute(`
            INSERT INTO point_types (name, icon, colour) VALUES
            ('Point of Interest', 'location', '#c2410c'),
            ('Meeting Point', 'people', '#eab308'),
            ('Camp Spot', 'bonfire', '#3b7a57'),
            ('Parking', 'car', '#6ebdeeff'),
            ('Food & Drink', 'restaurant', '#7b687d'),
            ('Cafe', 'cafe', '#A0522D'),
            ('Shop', 'storefront', '#4682B4'),
            ('Mountain', 'triangle', '#7B3F00'),
            ('Lake', 'water', '#1E90FF'),
            ('River', 'water', '#00BFFF'),
            ('Forest', 'leaf', '#228B22'),
            ('Waterfall', 'rainy', '#00CED1'),
            ('Viewpoint', 'eye', '#FFD700'),
            ('Other', 'heart', '#acc286')

            ON CONFLICT(name) DO UPDATE SET
                icon = excluded.icon,
                colour = excluded.colour
        `);   
    }

    get ( limit: number=100 ): Array<PointType>  {
        const data = this.db.execute(`
            SELECT id, name, icon, colour
            FROM ${this.tableName}
            LIMIT ${limit}
        `);

        return data.rows?._array ? 
            data.rows._array.map(row => ({
                id: row.id,
                name: row.name,
                icon: row.icon,
                colour: row.colour
            })) as PointType[]
            : [];
    }
}