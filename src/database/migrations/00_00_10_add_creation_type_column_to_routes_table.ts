export default `
ALTER TABLE routes ADD COLUMN creation_type TEXT DEFAULT 'CREATED';
`