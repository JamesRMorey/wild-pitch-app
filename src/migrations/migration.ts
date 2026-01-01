import { getDB } from '../database/db';

export class Migration {

    db;
    query;

    constructor ( query: string ) {
        this.db = getDB();
        this.query = query
    }

    run (): void {
        this.db.execute(this.query);
    }
}