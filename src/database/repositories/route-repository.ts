import { NITRO_SQLITE_NULL } from 'react-native-nitro-sqlite'
import { Route } from '../../types';
import { getDB } from '../db';

export class RouteRepository {

    db;
    tableName;
    userId;

    constructor ( userId: number ) {
        const db = getDB();
        this.userId = userId;
        this.db = db;
        this.tableName = 'routes';
        this.createTable();
    }

    createTable (): void {
        this.db.execute(`
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                notes LONGTEXT DEFAULT NULL,
                markers JSON NOT NULL,
                latitude DECIMAL(8,6) NOT NULL,
                longitude DECIMAL(8,6) NOT NULL,
                distance DECIMAL(10,2) DEFAULT NULL,
                elevation_gain INTEGER DEFAULT NULL,
                elevation_loss INTEGER DEFAULT NULL,
                created_at NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    get ( limit: number=100 ): Array<Route>  {
        const data = this.db.execute(`
            SELECT id, name, notes, markers, latitude, longitude, distance, elevation_gain, elevation_loss, created_at
            FROM ${this.tableName} t
            WHERE t.user_id = ${this.userId}
            LIMIT ${limit}
        `);
        return data.rows?._array ? 
            data.rows._array.map(row => ({
                id: row.id,
                name: row.name,
                notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
                markers: JSON.parse(row.markers),
                latitude: row.latitude,
                longitude: row.longitude,
                distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
                elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
                elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
                created_at: row.created_at
            })) as Route[]
            : [];
    }

    create ( data: Route ): Route|void {
        const record = this.db.execute(`
            INSERT INTO "${this.tableName}" (name, user_id, notes, markers, latitude, longitude, distance, elevation_gain, elevation_loss) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `, [
            data.name, 
            this.userId,
            data.notes || NITRO_SQLITE_NULL, 
            JSON.stringify(data.markers), 
            data.latitude, 
            data.longitude, 
            data.distance || NITRO_SQLITE_NULL, 
            data.elevation_gain || NITRO_SQLITE_NULL, 
            data.elevation_loss || NITRO_SQLITE_NULL
        ]);

        const row = record.rows?._array[0] ?? null
        if (!row) return;
        
        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at
        }
    }


    update(id: number, data: Route): Route | void {
        const record = this.db.execute(`
            UPDATE "${this.tableName}"
            SET name = ?,
                notes = ?,
                markers = ?,
                latitude = ?,
                longitude = ?,
                distance = ?,
                elevation_gain = ?,
                elevation_loss = ?
            WHERE id = ? 
            AND user_id = ${this.userId}
            RETURNING *
        `, [
            data.name,
            data.notes || NITRO_SQLITE_NULL,
            JSON.stringify(data.markers),
            data.latitude,
            data.longitude,
            data.distance || NITRO_SQLITE_NULL,
            data.elevation_gain || NITRO_SQLITE_NULL,
            data.elevation_loss || NITRO_SQLITE_NULL,
            id
        ]);

        const row = record.rows?._array[0] ?? null;
        if (!row) return;

        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at
        };
    }

    find ( id: number ): Route|void  {
        const record = this.db.execute(`
            SELECT id, name, notes, markers, latitude, longitude, distance, elevation_gain, elevation_loss, created_at
            FROM ${this.tableName} t
            WHERE t.id = ?
            AND t.user_id = ${this.userId}
            LIMIT 1
        `);
        
        const row = record.rows?._array[0] ?? null

        if (!row) return;

        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at
        }
    }

    findByLatLng ( latitude: number, longitude: number ): Route|void  {
        const record = this.db.execute(`
            SELECT id, name, notes, markers, latitude, longitude, distance, elevation_gain, elevation_loss, created_at
            FROM ${this.tableName} t
            WHERE t.latitude = ${latitude} AND t.longitude = ${longitude} AND t.user_id = ${this.userId}
            LIMIT 1
        `);
        
        const row = record.rows?._array[0] ?? null

        if (!row) return;

        return {
            id: row.id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at
        }
    }

    delete ( id: number ): void {
        this.db.execute(`
            DELETE FROM ${this.tableName}
            WHERE id = ?
            AND user_id = ${this.userId}
        `, [id]);
    }
}