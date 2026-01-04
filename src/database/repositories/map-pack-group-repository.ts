import { MapPackGroup, PointOfInterest } from '../../types';
import { NITRO_SQLITE_NULL } from 'react-native-nitro-sqlite'
import Mapbox from '@rnmapbox/maps';
import { getDB } from '../db';


export class MapPackGroupRepository {

    db;
    tableName;
    userId;

    constructor ( userId: number|undefined ) {
        const db = getDB();
        this.userId = userId;
        this.db = db;
        this.tableName = 'map_pack_groups';
    }

    get ( limit: number=100 ): Array<MapPackGroup>  {
        const data = this.db.execute(`
            SELECT *
            FROM ${this.tableName}
            WHERE user_id = ${this.userId}
            LIMIT ${limit}
        `);

        return data.rows?._array ? 
            data.rows._array.map(row => ({
                id: row.id,
                key: row.key,
                name: row.name,
                description: row.description,
                minZoom: row.min_zoom,
                maxZoom: row.max_zoom,
                center: [row.longitude, row.latitude],
                bounds: JSON.parse(row.bounds),
                packs: [
                    {
                        name: `${row.key}_OUTDOORS`,
                        styleURL: Mapbox.StyleURL.Outdoors
                    }
                ]
            })) as any[]
            : [];
    }

    find ( id: number ): MapPackGroup|void  {
        const record = this.db.execute(`
            SELECT *
            FROM ${this.tableName}
            WHERE id = ${id} AND user_id = ${this.userId}
        `);
        
        const row = record.rows?._array[0] ?? null;
        if (!row) return;

        return {
            id: row.id,
            key: row.key,
            name: row.name,
            description: row.description,
            minZoom: row.min_zoom,
            maxZoom: row.max_zoom,
            center: [row.longitude, row.latitude],
            bounds: JSON.parse(row.bounds),
            packs: [
                {
                    name: `${row.key}_OUTDOORS`,
                    styleURL: Mapbox.StyleURL.Outdoors
                }
            ]
        }
    }

    create ( data: MapPackGroup ): MapPackGroup|void {
        const record = this.db.execute(`
            INSERT OR IGNORE INTO ${this.tableName} (name, user_id, key, description, min_zoom, max_zoom, latitude, longitude, bounds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `, [data.name, this.userId, data.key, data.description ?? NITRO_SQLITE_NULL, data.minZoom, data.maxZoom,  data.center[1], data.center[0], JSON.stringify(data.bounds)]);

        const row = record.rows?._array[0];
        
        return {
            id: row.id,
            key: row.key,
            name: row.name,
            description: row.description,
            minZoom: row.min_zoom,
            maxZoom: row.max_zoom,
            center: [row.longitude, row.latitude],
            bounds: JSON.parse(row.bounds),
            packs: [
                {
                    name: `${row.key}_OUTDOORS`,
                    styleURL: Mapbox.StyleURL.Outdoors
                }
            ]
        }
    }

    update ( id: number, data: PointOfInterest ): PointOfInterest|void {
        const record = this.db.execute(`
            UPDATE ${this.tableName} 
            SET name = ?, 
                notes = ?,
                point_type_id = ?, 
                latitude = ?, 
                longitude = ?
            WHERE id = ?
            AND user_id = ${this.userId}
            RETURNING *
        `, [data.name, data.notes ?? NITRO_SQLITE_NULL, data.point_type_id,  data.latitude, data.longitude, id]);

        const updatedPoint = record.rows?._array[0];
        const row = this.find(updatedPoint.id);

        return {
            id: row.id,
            name: row.name,
            notes: row.notes,
            point_type_id: row.point_type_id,
            point_type: {
                id: row.point_type_id,
                icon: row.pt_icon,
                colour: row.pt_colour,
                name: row.pt_name
            },
            latitude: row.latitude,
            longitude: row.longitude,
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