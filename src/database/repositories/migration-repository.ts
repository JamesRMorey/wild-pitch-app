import { Migration } from '../../types';
import { getDB } from '../db';


export class MigrationRepository {

    db;
    tableName;

    constructor () {
        const db = getDB();
        this.db = db;
        this.tableName = 'migrations';
        this.createTable();
    }

    createTable (): void {
        this.db.execute(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )`
        )
    }

    get (): Array<Migration>  {
        const data = this.db.execute(`
            SELECT *
            FROM ${this.tableName}
        `);

        return data.rows?._array;
    }

    find ( name: string ): Migration|void  {
        const record = this.db.execute(`
            SELECT *
            FROM ${this.tableName}
            WHERE name = ${name}
        `);
        
        const row = record.rows?._array[0] ?? null;
        if (!row) return;

        return {
            id: row.id,
            name: row.name,
        }
    }

    create ( name: string ): void {
        this.db.execute(`
            INSERT OR IGNORE INTO ${this.tableName} (name) VALUES (?)
            RETURNING *
        `, [name]);
    }
}