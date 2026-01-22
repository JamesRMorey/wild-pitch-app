import { getDB } from "../db";
import { MigrationRepository } from "../repositories/migration-repository";
import { DbMigration } from "../../types";

export class Migration {

    db;
    query;
    name;
    migrationRepo;

    constructor ( migration: DbMigration ) {
        this.db = getDB();
        this.query = migration.query;
        this.name = migration.name;
        this.migrationRepo = new MigrationRepository();
    }

    run (): void {
        if (this.exists()) return;
        this.db.execute(this.query);
        this.migrationRepo.create(this.name);
    }

    exists (): boolean {
        const existing = this.migrationRepo.get(); 
        if (existing.find(e => e.name == this.name)) return true;
        return false
    }
}