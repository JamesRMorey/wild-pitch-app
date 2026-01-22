export default `
CREATE TABLE IF NOT EXISTS map_pack_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    description LONGTEXT,
    min_zoom INT NOT NULL DEFAULT 9,
    max_zoom INT NOT NULL DEFAULT 14,
    latitude DECIMAL(8,6) NOT NULL,
    longitude DECIMAL(8,6) NOT NULL,
    bounds LONGTEXT NOT NULL,

    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`