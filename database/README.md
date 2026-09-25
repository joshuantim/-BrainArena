# Database

This directory contains the PostgreSQL schema and seed data for BrainArena.

## Files

- `schema.sql` — Table definitions (users, categories, questions, quiz_attempts, quiz_answers)
- `seed.sql` — Seed data with 9 categories and 90 questions

## Usage

From the project root:

```bash
# Create tables
npm run db:migrate

# Seed data (categories + questions + admin user)
npm run db:seed

# Drop all tables (destructive!)
npm run db:reset
```

## Default Admin

After seeding, a default admin user is created:
- **Email**: admin@brainarena.com
- **Password**: admin123

⚠️ Change this password in production!
