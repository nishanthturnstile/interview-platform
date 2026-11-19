import "server-only";
import { createDatabase } from "@interview-studio/db";

let database: ReturnType<typeof createDatabase> | undefined;

export async function isDatabaseReady() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return false;

  try {
    database ??= createDatabase(connectionString);
    return await database.isSchemaReady();
  } catch {
    return false;
  }
}
