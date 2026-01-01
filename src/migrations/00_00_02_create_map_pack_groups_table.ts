export default `
CREATE TABLE IF NOT EXISTS point_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    colour TEXT NOT NULL
)
`