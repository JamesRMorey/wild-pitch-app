import { open } from 'react-native-nitro-sqlite'
import { PointType } from '../../types';


export class PointTypeRepository {

    db;
    tableName;

    constructor () {
        const db = open({ name: `database.sqlite` })
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
            ('Point of Interest', 'location-outline', '#c2410c'),
            ('Meeting Point', 'people-outline', '#eab308'),
            ('Camp Spot', 'bonfire-outline', '#3b7a57'),
            ('Parking', 'car-outline', '#0264A0'),
            ('Food & Drink', 'restaurant-outline', '#7b687d'),
            ('Mountain', 'triangle-outline', '#7B3F00'),
            ('Lake', 'water-outline', '#1E90FF'),
            ('River', 'water-outline', '#00BFFF'),
            ('Forest', 'leaf-outline', '#228B22'),
            ('Waterfall', 'rainy-outline', '#00CED1'),
            ('Viewpoint', 'eye-outline', '#FFD700'),
            ('Other', 'heart-outline', '#acc286')

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