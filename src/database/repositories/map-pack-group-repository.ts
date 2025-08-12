import { open } from 'react-native-nitro-sqlite'
import { MapPackGroup, PointOfInterest } from '../../types';
import { NITRO_SQLITE_NULL } from 'react-native-nitro-sqlite'
import { PointTypeRepository } from './point-type-repository';
import Mapbox from '@rnmapbox/maps';


export class MapPackGroupRepository {

    db;
    tableName;

    constructor () {
        const db = open({ name: `database.sqlite` })
        this.db = db;
        this.tableName = 'map_pack_groups';
        this.createTable();
    }

    createTable (): void {
        new PointTypeRepository();
        this.db.execute(`
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                key TEXT NOT NULL UNIQUE,
                description LONGTEXT,
                min_zoom INT NOT NULL DEFAULT 9,
                max_zoom INT NOT NULL DEFAULT 14,
                latitude DECIMAL(8,6) NOT NULL,
                longitude DECIMAL(8,6) NOT NULL,
                bounds LONGTEXT NOT NULL,
                created_at NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);        
    }

    async get ( limit: number=100 ): Promise<Array<MapPackGroup>>  {
        const data = this.db.execute(`
            SELECT *
            FROM ${this.tableName}
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
                    },
                    {
                        name: `${row.key}_SATELLITE`,
                        styleURL: Mapbox.StyleURL.SatelliteStreet
                    }
                ]
            })) as any[]
            : [];
    }

    find ( id: number ): PointOfInterest|void  {
        const record = this.db.execute(`
            SELECT t.id, t.name, t.notes, t.point_type_id, t.latitude, t.longitude, t.created_at, pt.icon as pt_icon, pt.name as pt_name, pt.colour as pt_colour
            FROM ${this.tableName} t
            JOIN point_types pt ON pt.id = t.point_type_id
            WHERE t.id = ${id}
        `);
        
        const row = record.rows?._array[0] ?? null

        if (!row) return;

        return {
            id: row.id,
            name: row.name,
            notes: row.notes,
            point_type_id: row.point_type_id,
            point_type: {
                icon: row.pt_icon,
                colour: row.pt_colour,
                name: row.pt_name
            },
            latitude: row.latitude,
            longitude: row.longitude,
            created_at: row.created_at
        }
    }

    create ( data: MapPackGroup ): MapPackGroup|void {
        const record = this.db.execute(`
            INSERT OR IGNORE INTO ${this.tableName} (name, key, description, min_zoom, max_zoom, latitude, longitude, bounds) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `, [data.name, data.key, data.description ?? NITRO_SQLITE_NULL, data.minZoom, data.maxZoom,  data.center[1], data.center[0], JSON.stringify(data.bounds)]);

        const row = record.rows?._array[0] ?? null
        
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
                },
                {
                    name: `${row.key}_SATELLITE`,
                    styleURL: Mapbox.StyleURL.SatelliteStreet
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
            RETURNING *
        `, [data.name, data.notes ?? NITRO_SQLITE_NULL, data.point_type_id,  data.latitude, data.longitude, id]);

        const updatedPoint = record.rows?._array[0] ?? null

        if (!updatedPoint) return;

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
            WHERE id = ?
        `, [id]);
    }
}