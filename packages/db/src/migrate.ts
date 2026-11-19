import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

const connectionString = process.env.DATABASE_MIGRATION_URL;
if (!connectionString) {
  throw new Error("Set DATABASE_MIGRATION_URL before applying migrations.");
}

const client = new Client({
  connectionString,
  connectionTimeoutMillis: 5000,
  statement_timeout: 60000,
});

try {
  await client.connect();
  // The session holds this lock from the journal read through the final commit.
  await client.query(
    "SELECT pg_advisory_lock($1::integer, $2::integer)",
    [732183543, 1],
  );
  await migrate(drizzle(client), {
    migrationsFolder: fileURLToPath(new URL("../drizzle/", import.meta.url)),
    migrationsSchema: "interview_migrations",
  });
  console.info("PostgreSQL migrations are up to date.");
} finally {
  await client.end();
}
