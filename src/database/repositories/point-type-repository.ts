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
            ('Point of Interest', 'location', '#FFD700'),
            ('Meeting Point', 'people', '#1E90FF'),
            ('Camp Spot', 'bonfire-outline', '#228B22'),
            ('Parking', 'car', '#808080'),
            ('Food & Drink', 'restaurant', '#FF4500'),
            ('Other', 'heart', '#A9A9A9')

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