import { open, NITRO_SQLITE_NULL } from 'react-native-nitro-sqlite'
import { PointOfInterest } from '../../types';
import { PointTypeRepository } from './point-type-repository';
import { getDB } from '../db';

export class PointOfInterestRepository {

    db;
    tableName;
    userId;

    constructor (userId: number) {
        const db = getDB();
        this.userId = userId;
        this.db = db;
        this.tableName = 'point_of_interests';
        this.createTable();
    }

    createTable (): void {
        new PointTypeRepository();
        this.db.execute(`
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                notes LONGTEXT DEFAULT NULL,
                point_type_id INTEGER NOT NULL DEFAULT 1,
                latitude DECIMAL(8,6) NOT NULL,
                longitude DECIMAL(8,6) NOT NULL,
                elevation DECIMAL(8,2) DEFAULT NULL,
                created_at NOT NULL DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (point_type_id) REFERENCES point_types(id)
            )
        `);

        // Check if 'elevation' column exists
        // const columns = this.db.execute(`PRAGMA table_info(${this.tableName})`);
        // const hasElevation = columns.rows?._array?.some((col: any) => col.name === 'elevation');
        // if (!hasElevation) {
        //     this.db.execute(`ALTER TABLE ${this.tableName} ADD COLUMN elevation REAL DEFAULT NULL`);
        // }
    }

    get ( limit: number=100 ): Array<PointOfInterest>  {
        const data = this.db.execute(`
            SELECT t.id, t.name, t.notes, t.point_type_id, t.latitude, t.longitude, t.elevation, t.created_at, pt.icon as pt_icon, pt.name as pt_name, pt.colour as pt_colour
            FROM ${this.tableName} t
            JOIN point_types pt ON pt.id = t.point_type_id
            WHERE t.user_id = ${this.userId}
            LIMIT ${limit}
        `);
        
        return data.rows?._array ? 
            data.rows._array.map(row => ({
                id: row.id,
                name: row.name,
                notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
                point_type_id: row.point_type_id,
                point_type: {
                    icon: row.pt_icon,
                    colour: row.pt_colour,
                    name: row.pt_name
                },
                latitude: row.latitude,
                longitude: row.longitude,
                elevation: row.elevation && row.elevation.isNitroSQLiteNull ? undefined : row.elevation,
                created_at: row.created_at
            })) as PointOfInterest[]
            : [];
    }

    find ( id: number ): PointOfInterest|void  {
        const record = this.db.execute(`
            SELECT t.id, t.name, t.notes, t.point_type_id, t.latitude, t.longitude, t.elevation, t.created_at, pt.icon as pt_icon, pt.name as pt_name, pt.colour as pt_colour
            FROM ${this.tableName} t
            JOIN point_types pt ON pt.id = t.point_type_id
            WHERE t.id = ${id} AND t.user_id = ${this.userId}
        `);
        
        const row = record.rows?._array[0] ?? null

        if (!row) return;

        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            point_type_id: row.point_type_id,
            point_type: {
                icon: row.pt_icon,
                colour: row.pt_colour,
                name: row.pt_name
            },
            latitude: row.latitude,
            longitude: row.longitude,
            elevation: row.elevation && row.elevation.isNitroSQLiteNull ? undefined : row.elevation,
            created_at: row.created_at
        }
    }

    findByLatLng ( latitude: number, longitude: number ): PointOfInterest|void  {
        const record = this.db.execute(`
            SELECT t.id, t.name, t.notes, t.point_type_id, t.latitude, t.longitude, t.elevation, t.created_at, pt.icon as pt_icon, pt.name as pt_name, pt.colour as pt_colour
            FROM ${this.tableName} t
            JOIN point_types pt ON pt.id = t.point_type_id
            WHERE t.latitude = ${latitude} AND t.longitude = ${longitude} AND t.user_id = ${this.userId}
        `);
        
        const row = record.rows?._array[0] ?? null

        if (!row) return;

        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            point_type_id: row.point_type_id,
            point_type: {
                icon: row.pt_icon,
                colour: row.pt_colour,
                name: row.pt_name
            },
            latitude: row.latitude,
            longitude: row.longitude,
            elevation: row.elevation && row.elevation.isNitroSQLiteNull ? undefined : row.elevation,
            created_at: row.created_at
        }
    }

    create ( data: PointOfInterest ): PointOfInterest|void {
        const record = this.db.execute(`
            INSERT INTO "${this.tableName}" (name, user_id, notes, point_type_id, latitude, longitude, elevation) VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `, [data.name, this.userId, data.notes || NITRO_SQLITE_NULL, data.point_type_id,  data.latitude, data.longitude, data.elevation || NITRO_SQLITE_NULL]);

        const newPoint = record.rows?._array[0] ?? null

        if (!newPoint) return;

        const row = this.find(newPoint.id);
        
        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            point_type_id: row.point_type_id,
            point_type: {
                id: row.point_type_id,
                icon: row.pt_icon,
                colour: row.pt_colour,
                name: row.pt_name
            },
            latitude: row.latitude,
            longitude: row.longitude,
            elevation: row.elevation && row.elevation.isNitroSQLiteNull ? undefined : row.elevation,
            created_at: row.created_at
        }
    }

    update ( id: number, data: PointOfInterest ): PointOfInterest|void {
        const record = this.db.execute(`
            UPDATE "${this.tableName}" 
            SET name = ?, 
                notes = ?,
                point_type_id = ?, 
                latitude = ?, 
                longitude = ?,
                elevation = ?
            WHERE id = ?
            AND user_id = ${this.userId}
            RETURNING *
        `, [data.name, data.notes || NITRO_SQLITE_NULL, data.point_type_id,  data.latitude, data.longitude, data.elevation || NITRO_SQLITE_NULL, id]);

        const updatedPoint = record.rows?._array[0] ?? null

        if (!updatedPoint) return;

        const row = this.find(updatedPoint.id);

        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            point_type_id: row.point_type_id,
            point_type: {
                id: row.point_type_id,
                icon: row.pt_icon,
                colour: row.pt_colour,
                name: row.pt_name
            },
            latitude: row.latitude,
            longitude: row.longitude,
            elevation: row.elevation && row.elevation.isNitroSQLiteNull ? undefined : row.elevation,
            created_at: row.created_at
        }
    }

    delete ( id: number ): void {
        this.db.execute(`
            DELETE FROM ${this.tableName}
            WHERE id = ? AND user_id = ${this.userId}
        `, [id]);
    }
}