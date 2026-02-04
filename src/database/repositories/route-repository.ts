import { NITRO_SQLITE_NULL } from 'react-native-nitro-sqlite'
import { RouteData } from '../../types';
import { getDB } from '../db';
import { CREATION_TYPE, ROUTE_ENTRY_TYPE } from '../../consts/enums';
import { Format } from '../../services/formatter';

export class RouteRepository {

    db;
    tableName;
    userId;

    constructor ( userId: number|undefined ) {
        const db = getDB();
        this.userId = userId;
        this.db = db;
        this.tableName = 'routes';
    }

    get ( entryType: ROUTE_ENTRY_TYPE=ROUTE_ENTRY_TYPE.ROUTE ): Array<RouteData>  {
        const data = this.db.execute(`
            SELECT *
            FROM ${this.tableName} t
            WHERE t.user_id = ${this.userId}
            AND t.entry_type = '${entryType}'
        `);
        
        return data.rows?._array ? 
            data.rows._array.map(row => ({
                id: row.id,
                user_id: row.user_id,
                name: row.name,
                notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
                markers: JSON.parse(row.markers),
                latitude: row.latitude,
                longitude: row.longitude,
                distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
                elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
                elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
                created_at: row.created_at,
                updated_at: row.updated_at,
                published_at: row.published_at && row.published_at.isNitroSQLiteNull ? undefined : row.published_at,
                server_id: row.server_id && row.server_id.isNitroSQLiteNull ? undefined : row.server_id,
                status: row.status,
                entry_type: row.entry_type,
                type: row.type && row.type.isNitroSQLiteNull ? undefined : row.type,
                difficulty: row.difficulty && row.difficulty.isNitroSQLiteNull ? undefined : row.difficulty,
                creation_type: row.creation_type
            })) as RouteData[]
            : [];
    }

    create ( data: RouteData, entryType: ROUTE_ENTRY_TYPE=ROUTE_ENTRY_TYPE.ROUTE, updated: string=Format.currentTimestamp() ): RouteData|void {
        const record = this.db.execute(`
            INSERT INTO "${this.tableName}" (
                name, 
                user_id, 
                notes,
                markers, 
                latitude, 
                longitude, 
                distance, 
                elevation_gain, 
                elevation_loss, 
                server_id, 
                published_at,
                created_at,
                updated_at,
                status,
                entry_type,
                type,
                difficulty,
                creation_type
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)
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
            data.elevation_loss || NITRO_SQLITE_NULL,
            data.server_id || NITRO_SQLITE_NULL,
            data.published_at || NITRO_SQLITE_NULL,
            updated || Format.currentTimestamp(),
            data.status || 'PRIVATE',
            entryType || ROUTE_ENTRY_TYPE.ROUTE,
            data.type || NITRO_SQLITE_NULL,
            data.difficulty || NITRO_SQLITE_NULL,
            data.creation_type || CREATION_TYPE.CREATED
        ]);

        const row = record.rows?._array[0];

        return {
            id: row.id,
            user_id: row.user_id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at,
            updated_at: row.updated_at,
            published_at: row.published_at && row.published_at.isNitroSQLiteNull ? undefined : row.published_at,
            server_id: row.server_id && row.server_id.isNitroSQLiteNull ? undefined : row.server_id,
            status: row.status,
            entry_type: row.entry_type,
            type: row.type && row.type.isNitroSQLiteNull ? undefined : row.type,
            difficulty: row.difficulty && row.difficulty.isNitroSQLiteNull ? undefined : row.difficulty,
            creation_type: row.creation_type
        }
    }


    update( id: number, data: RouteData, updated: string=Format.currentTimestamp() ): RouteData | void {
        const record = this.db.execute(`
            UPDATE "${this.tableName}"
            SET name = ?,
                notes = ?,
                markers = ?,
                latitude = ?,
                longitude = ?,
                distance = ?,
                elevation_gain = ?,
                elevation_loss = ?,
                server_id = ?,
                published_at = ?,
                status = ?,
                updated_at = ?,
                type = ?,
                difficulty = ?,
                creation_type = ?
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
            data.server_id || NITRO_SQLITE_NULL,
            data.published_at || NITRO_SQLITE_NULL,
            data.status || 'PRIVATE',
            updated || Format.currentTimestamp(),
            data.type || NITRO_SQLITE_NULL,
            data.difficulty || NITRO_SQLITE_NULL,
            data.creation_type || CREATION_TYPE.CREATED,
            id
        ]);

        const row = record.rows?._array[0];

        return {
            id: row.id,
            user_id: row.user_id ?? this.userId,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at,
            updated_at: row.updated_at,
            published_at: row.published_at && row.published_at.isNitroSQLiteNull ? undefined : row.published_at,
            server_id: row.server_id && row.server_id.isNitroSQLiteNull ? undefined : row.server_id,
            status: row.status,
            entry_type: row.entry_type,
            type: row.type && row.type.isNitroSQLiteNull ? undefined : row.type,
            difficulty: row.difficulty && row.difficulty.isNitroSQLiteNull ? undefined : row.difficulty,
            creation_type: row.creation_type
        };
    }

    find ( id: number ): RouteData|void  {
        const record = this.db.execute(`
            SELECT *
            FROM ${this.tableName} t
            WHERE t.id = ? OR t.server_id = ?
            AND t.user_id = ${this.userId}
            AND t.entry_type = 'ROUTE'
            LIMIT 1
        `, [id, id]);

        const row = record.rows?._array[0] ?? null
        if (!row) return;

        return {
            id: row.id,
            user_id: row.user_id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at,
            updated_at: row.updated_at,
            published_at: row.published_at && row.published_at.isNitroSQLiteNull ? undefined : row.published_at,
            server_id: row.server_id && row.server_id.isNitroSQLiteNull ? undefined : row.server_id,
            status: row.status,
            entry_type: row.entry_type,
            type: row.type && row.type.isNitroSQLiteNull ? undefined : row.type,
            difficulty: row.difficulty && row.difficulty.isNitroSQLiteNull ? undefined : row.difficulty,
            creation_type: row.creation_type
        }
    }

    findByLatLng ( latitude: number, longitude: number, entryType: ROUTE_ENTRY_TYPE=ROUTE_ENTRY_TYPE.ROUTE ): RouteData|void  {
        const record = this.db.execute(`
            SELECT *
            FROM ${this.tableName} t
            WHERE t.latitude = ${latitude} 
            AND t.longitude = ${longitude} 
            AND t.user_id = ${this.userId}
            AND t.entry_type = '${entryType}'
            LIMIT 1
        `);
        
        const row = record.rows?._array[0] ?? null;
        if (!row) return;

        return {
            id: row.id,
            user_id: row.user_id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at,
            updated_at: row.updated_at,
            published_at: row.published_at && row.published_at.isNitroSQLiteNull ? undefined : row.published_at,
            server_id: row.server_id && row.server_id.isNitroSQLiteNull ? undefined : row.server_id,
            status: row.status,
            entry_type: row.entry_type,
            type: row.type && row.type.isNitroSQLiteNull ? undefined : row.type,
            difficulty: row.difficulty && row.difficulty.isNitroSQLiteNull ? undefined : row.difficulty,
            creation_type: row.creation_type
        }
    }

    delete ( id: number, entryType: ROUTE_ENTRY_TYPE=ROUTE_ENTRY_TYPE.ROUTE ): RouteData|void {
        const record = this.db.execute(`
            DELETE FROM ${this.tableName}
            WHERE id = ?
            AND user_id = ${this.userId}
            AND entry_type = '${entryType}'
            RETURNING *
        `, [id]);

        const row = record.rows?._array[0];
        if (!row) return;

        return {
            id: row.id,
            user_id: row.user_id,
            name: row.name,
            notes: row.notes && row.notes.isNitroSQLiteNull ? undefined : row.notes,
            markers: JSON.parse(row.markers),
            latitude: row.latitude,
            longitude: row.longitude,
            distance: row.distance && row.distance.isNitroSQLiteNull ? undefined : row.distance,
            elevation_gain: row.elevation_gain && row.elevation_gain.isNitroSQLiteNull ? undefined : row.elevation_gain,
            elevation_loss: row.elevation_loss && row.elevation_loss.isNitroSQLiteNull ? undefined : row.elevation_loss,
            created_at: row.created_at,
            updated_at: row.updated_at,
            published_at: row.published_at && row.published_at.isNitroSQLiteNull ? undefined : row.published_at,
            server_id: row.server_id && row.server_id.isNitroSQLiteNull ? undefined : row.server_id,
            status: row.status,
            entry_type: row.entry_type,
            type: row.type && row.type.isNitroSQLiteNull ? undefined : row.type,
            difficulty: row.difficulty && row.difficulty.isNitroSQLiteNull ? undefined : row.difficulty,
            creation_type: row.creation_type
        };
    }

    generateSlug( name: string ): string {
        const baseSlug = `${this.userId}-${name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
        let slug = baseSlug;
        let i = 1;

        while (this.slugExists(slug)) {
            slug = `${baseSlug}-${i++}`;
        }

        return slug;
    }

    private slugExists( slug: string ): boolean {
        const record = this.db.execute(`
            SELECT COUNT(*) as count
            FROM ${this.tableName}
            WHERE slug = ?
            AND user_id = ${this.userId}
        `, [slug]);

        return record.rows?._array[0]?.count > 0;
    }
}