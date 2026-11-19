import { spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { once } from "node:events";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "vitest";
import {
  compose,
  migratePostgres,
  resetPostgres,
  startPostgres,
} from "../../infra/postgres/local.mjs";
import { createDatabase } from "../../packages/db/dist/index.js";

async function freePort() {
  const listener = createServer().listen(0, "127.0.0.1");
  await once(listener, "listening");
  const { port } = listener.address();
  const closed = once(listener, "close");
  listener.close();
  await closed;
  return port;
}

function newPassword() {
  return randomBytes(24).toString("hex");
}

async function expectReadiness(url, status) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  expect(response.status).toBe(status);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual({
    status: status === 200 ? "ready" : "unavailable",
  });
}

test("migrates a fresh database and recovers the web readiness check after restart and reset", async () => {
  const [databasePort, webPort] = await Promise.all([freePort(), freePort()]);
  const folder = await mkdtemp(join(tmpdir(), "interview-postgres-"));
  const project = {
    name: `interview-studio-test-${randomUUID()}`,
    composeEnv: join(folder, ".env.compose"),
    migrateEnv: join(folder, ".env.migrate"),
  };
  const migratorPassword = newPassword();
  const runtimePassword = newPassword();
  const database = `127.0.0.1:${databasePort}/interview_studio`;
  const migratorUrl = `postgresql://interview_migrator:${migratorPassword}@${database}`;
  const runtimeUrl = `postgresql://interview_runtime:${runtimePassword}@${database}`;
  await writeFile(
    project.composeEnv,
    [
      `DB_PORT=${databasePort}`,
      `POSTGRES_PASSWORD=${newPassword()}`,
      `DB_MIGRATOR_PASSWORD=${migratorPassword}`,
      `DB_RUNTIME_PASSWORD=${runtimePassword}`,
    ].join("\n"),
    { mode: 0o600 },
  );
  await writeFile(
    project.migrateEnv,
    `DATABASE_MIGRATION_URL=${migratorUrl}\n`,
    {
      mode: 0o600,
    },
  );

  const migrator = createDatabase(migratorUrl).pool;
  const runtime = createDatabase(runtimeUrl).pool;
  const journal = "interview_migrations.__drizzle_migrations";
  const appliedMigrations = async () =>
    (
      await migrator.query(
        `SELECT id, hash, created_at FROM ${journal} ORDER BY id`,
      )
    ).rows;
  let web;

  try {
    await startPostgres(project);
    web = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(webPort),
      ],
      {
        cwd: new URL("../../apps/web/", import.meta.url),
        env: { ...process.env, DATABASE_URL: runtimeUrl },
        stdio: "inherit",
      },
    );
    const readiness = `http://127.0.0.1:${webPort}/api/health/ready`;
    await expect
      .poll(
        async () => {
          try {
            return (
              await fetch(readiness, { signal: AbortSignal.timeout(1000) })
            ).status;
          } catch {
            return 0;
          }
        },
        { timeout: 15_000 },
      )
      .toBe(503);
    await expectReadiness(readiness, 503);

    await Promise.all([migratePostgres(project), migratePostgres(project)]);
    const applied = await appliedMigrations();
    const { entries } = JSON.parse(
      await readFile(
        new URL(
          "../../packages/db/drizzle/meta/_journal.json",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    expect(applied.map(({ created_at }) => String(created_at))).toEqual(
      entries.map(({ when }) => String(when)),
    );
    await migratePostgres(project);
    expect(await appliedMigrations()).toEqual(applied);
    await expectReadiness(readiness, 200);

    const {
      rows: [role],
    } = await runtime.query(`
      SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolbypassrls,
             pg_has_role(current_user, 'interview_migrator', 'MEMBER') AS inherits_migrator
      FROM pg_roles WHERE rolname = current_user
    `);
    expect(role).toEqual({
      rolname: "interview_runtime",
      rolsuper: false,
      rolcreatedb: false,
      rolcreaterole: false,
      rolbypassrls: false,
      inherits_migrator: false,
    });

    await migrator.query(
      "CREATE TABLE interview.persistence_probe (id uuid PRIMARY KEY)",
    );
    await migrator.query(
      "GRANT INSERT, SELECT ON interview.persistence_probe TO interview_runtime",
    );
    for (const statement of [
      "CREATE SCHEMA runtime_schema",
      "CREATE TABLE public.runtime_table (id integer)",
      "CREATE TABLE interview.runtime_table (id integer)",
      "ALTER TABLE interview.persistence_probe ADD COLUMN surprise integer",
      `SELECT * FROM ${journal}`,
      `DELETE FROM ${journal}`,
    ]) {
      await expect(runtime.query(statement)).rejects.toMatchObject({
        code: "42501",
      });
    }

    const marker = randomUUID();
    await runtime.query(
      "INSERT INTO interview.persistence_probe (id) VALUES ($1)",
      [marker],
    );
    const persisted = async () =>
      (await runtime.query("SELECT id FROM interview.persistence_probe")).rows;
    expect(await persisted()).toEqual([{ id: marker }]);

    const otherScript = join(
      folder,
      "other-checkout",
      "infra",
      "postgres",
      "local.mjs",
    );
    await mkdir(dirname(otherScript), { recursive: true });
    await copyFile(
      new URL("../../infra/postgres/local.mjs", import.meta.url),
      otherScript,
    );
    const other = await import(pathToFileURL(otherScript).href);
    await expect(other.startPostgres(project)).rejects.toThrow(
      "different checkout",
    );
    await expect(other.resetPostgres(project)).rejects.toThrow(
      "different checkout",
    );
    expect(await persisted()).toEqual([{ id: marker }]);

    await compose(project, "stop", "postgres");
    await expectReadiness(readiness, 503);
    await startPostgres(project);
    await expectReadiness(readiness, 200);
    expect(await persisted()).toEqual([{ id: marker }]);
    await startPostgres(project, "--force-recreate");
    expect(await persisted()).toEqual([{ id: marker }]);

    const wrongTarget = join(folder, ".env.migrate.wrong");
    await writeFile(
      wrongTarget,
      `DATABASE_MIGRATION_URL=${migratorUrl.replace("127.0.0.1", "localhost")}\n`,
      {
        mode: 0o600,
      },
    );
    await expect(
      resetPostgres({ ...project, migrateEnv: wrongTarget }),
    ).rejects.toThrow("must match the local Compose database");
    expect(await persisted()).toEqual([{ id: marker }]);

    await resetPostgres(project);
    const { rows } = await runtime.query(
      "SELECT to_regclass('interview.persistence_probe') AS probe",
    );
    expect(rows).toEqual([{ probe: null }]);
    expect(await appliedMigrations()).toEqual(applied);
    await expectReadiness(readiness, 200);
  } finally {
    if (web && web.exitCode === null && web.signalCode === null) {
      const exited = once(web, "exit");
      web.kill();
      await exited;
    }
    await Promise.all([migrator.end(), runtime.end()]);
    try {
      await compose(project, "down", "--volumes");
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  }
});
