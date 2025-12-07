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
                user_id INTEGER,
                name TEXT NOT NULL UNIQUE,
                icon TEXT NOT NULL,
                colour TEXT NOT NULL
            )
        `);    
    }

    seed (): void {
        this.db.execute(`
            INSERT INTO point_types (name, icon, colour) VALUES
            ('Point of Interest', 'map-pin', '#c2410c'),
            ('Meeting Point', 'users', '#eab308'),
            ('Camp Spot', 'tent', '#3b7a57'),
            ('Parking', 'square-parking', '#6ebdeeff'),
            ('Food & Drink', 'soup', '#7b687d'),
            ('Cafe', 'coffee', '#A0522D'),
            ('Shop', 'store', '#4682B4'),
            ('Mountain', 'mountain', '#7B3F00'),
            ('Lake', 'waves', '#1E90FF'),
            ('Forest', 'trees', '#228B22'),
            ('Waterfall', 'waves-arrow-down', '#00CED1'),
            ('Viewpoint', 'binoculars', '#FFD700'),
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