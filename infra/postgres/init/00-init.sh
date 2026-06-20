#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE hotel;
    CREATE DATABASE beach;
EOSQL

# Seed beach activities (beach app creates the tables itself on startup).
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname beach \
    -f /seed/seed_activities.sql
