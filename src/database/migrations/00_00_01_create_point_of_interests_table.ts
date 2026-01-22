export default `
CREATE TABLE IF NOT EXISTS point_of_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    notes LONGTEXT DEFAULT NULL,
    point_type_id INTEGER NOT NULL DEFAULT 1,
    latitude DECIMAL(8,6) NOT NULL,
    longitude DECIMAL(8,6) NOT NULL,
    elevation DECIMAL(8,2) DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'PRIVATE',
    
    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (point_type_id) REFERENCES point_types(id)
)
`