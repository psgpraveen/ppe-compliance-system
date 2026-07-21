# Database Maintenance

This folder contains all manual SQL files for maintaining the PostgreSQL database.

## Files
- `schema.sql`: Core table structures.
- `seed.sql`: Initial seed data for development.
- `functions.sql`: Custom functions and triggers.
- `views.sql`: Custom views.
- `indexes.sql`: Index definitions for performance.

## Execution
Since no ORM or migration tool is used, these files must be run manually against the Supabase instance using `psql` or the Supabase dashboard.
