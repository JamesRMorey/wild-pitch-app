import m000 from './00_00_00_create_point_types_table';
import m001 from './00_00_01_create_point_of_interests_table';
import m002 from './00_00_02_create_map_pack_groups_table';
import m003 from './00_00_03_create_routes_table';
import m004 from './00_00_04_add_server_id_column_to_routes_table';
import m006 from './00_00_06_add_published_at_column_to_routes_table';
import m007 from './00_00_07_add_entry_type_column_to_routes_table';

export default [
    { name: '00_00_00_create_point_types_table', query: m000 },
    { name: '00_00_01_create_point_of_interests_table', query: m001 },
    { name: '00_00_02_create_map_pack_groups_table', query: m002 },
    { name: '00_00_03_create_routes_table', query: m003 },
    { name: '00_00_04_add_server_id_column_to_routes_table', query: m004 },
    { name: '00_00_06_add_published_at_column_to_routes_table', query: m006 },
    { name: '00_00_07_add_entry_type_column_to_routes_table', query: m007 },
]