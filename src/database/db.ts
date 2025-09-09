import * as NitroSQLite from 'react-native-nitro-sqlite'

let dbInstance: any = null;

export function getDB() {
    if (!dbInstance) {
        dbInstance = NitroSQLite.open({ name: `database.sqlite` });
    }
    return dbInstance;
}

export function resetDB() {
    dbInstance = null;
}