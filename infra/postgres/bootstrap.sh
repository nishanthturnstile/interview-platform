#!/bin/sh
set -eu

if [ "$POSTGRES_PASSWORD" = "$DB_MIGRATOR_PASSWORD" ] ||
   [ "$POSTGRES_PASSWORD" = "$DB_RUNTIME_PASSWORD" ] ||
   [ "$DB_MIGRATOR_PASSWORD" = "$DB_RUNTIME_PASSWORD" ]; then
  echo "Use distinct passwords for the bootstrap, migration and runtime users." >&2
  exit 1
fi

psql -X --set=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
\getenv migrator_password DB_MIGRATOR_PASSWORD
\getenv runtime_password DB_RUNTIME_PASSWORD

BEGIN;
CREATE ROLE interview_migrator LOGIN PASSWORD :'migrator_password'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
CREATE ROLE interview_runtime LOGIN PASSWORD :'runtime_password'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;

REVOKE CONNECT, TEMPORARY ON DATABASE interview_studio FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT CONNECT, CREATE ON DATABASE interview_studio TO interview_migrator;
GRANT CONNECT ON DATABASE interview_studio TO interview_runtime;
COMMIT;
SQL
