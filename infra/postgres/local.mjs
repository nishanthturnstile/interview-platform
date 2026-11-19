import { execFile, execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv, promisify } from "node:util";

const repository = realpathSync(
  fileURLToPath(new URL("../../", import.meta.url)),
);
const run = promisify(execFile);
const passwordVariables = [
  "POSTGRES_PASSWORD",
  "DB_MIGRATOR_PASSWORD",
  "DB_RUNTIME_PASSWORD",
];
const development = {
  name: "interview-studio-dev",
  composeEnv: ".env.compose",
  migrateEnv: ".env.migrate",
};

function readEnv(file) {
  return parseEnv(readFileSync(resolve(repository, file), "utf8"));
}

function inspectDocker(args) {
  return execFileSync("docker", args, {
    cwd: repository,
    encoding: "utf8",
  }).trim();
}

export async function compose(project, ...args) {
  const env = { ...process.env, INTERVIEW_STUDIO_CHECKOUT: repository };
  // Compose normally lets exported variables override an explicit env file.
  for (const key of ["DB_PORT", ...passwordVariables]) delete env[key];

  const { stdout, stderr } = await run(
    "docker",
    [
      "compose",
      "--project-name",
      project.name,
      "--file",
      "compose.yaml",
      "--env-file",
      project.composeEnv,
      ...args,
    ],
    { cwd: repository, env },
  );
  process.stdout.write(stdout);
  process.stderr.write(stderr);
}

function validatePasswords(project) {
  const variables = readEnv(project.composeEnv);
  const passwords = passwordVariables.map((key) => variables[key]);
  if (
    passwords.some((password) => !password) ||
    new Set(passwords).size !== 3
  ) {
    throw new Error(
      "Set three distinct PostgreSQL role passwords in the Compose env file.",
    );
  }
}

export async function startPostgres(project, ...options) {
  validatePasswords(project);
  existingDatabaseVolume(project);
  await compose(
    project,
    "up",
    "-d",
    "--wait",
    "--wait-timeout",
    "45",
    ...options,
    "postgres",
  );
}

function migrationUrl(project) {
  const { DATABASE_MIGRATION_URL: migration } = readEnv(project.migrateEnv);
  const { DB_PORT, DB_MIGRATOR_PASSWORD: password } = readEnv(
    project.composeEnv,
  );
  const url = URL.parse(migration ?? "");

  if (
    !url ||
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    url.hostname !== "127.0.0.1" ||
    (url.port || "5432") !== (DB_PORT || "5432") ||
    url.username !== "interview_migrator" ||
    url.pathname !== "/interview_studio" ||
    url.search ||
    url.hash ||
    !password ||
    decodeURIComponent(url.password) !== password
  ) {
    throw new Error(
      "The migration URL must match the local Compose database and migrator credentials.",
    );
  }
  return url.href;
}

async function applyMigrations(connectionString) {
  const { stdout } = await run(
    process.execPath,
    ["packages/db/src/migrate.ts"],
    {
      cwd: repository,
      env: { ...process.env, DATABASE_MIGRATION_URL: connectionString },
    },
  );
  process.stdout.write(stdout);
}

export async function migratePostgres(project) {
  existingDatabaseVolume(project);
  await applyMigrations(migrationUrl(project));
}

function existingDatabaseVolume(project) {
  const volume = `${project.name}_postgres_data`;
  const volumes = inspectDocker([
    "volume",
    "ls",
    "--filter",
    `name=${volume}`,
    "--format",
    "{{.Name}}",
  ]).split("\n");
  if (!volumes.includes(volume)) return;

  const labels = JSON.parse(
    inspectDocker([
      "volume",
      "inspect",
      "--format",
      "{{json .Labels}}",
      volume,
    ]),
  );
  if (
    labels?.["com.docker.compose.project"] !== project.name ||
    labels?.["com.docker.compose.volume"] !== "postgres_data"
  ) {
    throw new Error(
      `Volume ${volume} does not belong to the expected Compose project.`,
    );
  }

  // Existing M1 volumes can use the Compose label on their service container.
  const owner =
    labels["io.interview-studio.checkout"] ||
    inspectDocker([
      "ps",
      "--all",
      "--filter",
      `volume=${volume}`,
      "--filter",
      `label=com.docker.compose.project=${project.name}`,
      "--filter",
      "label=com.docker.compose.service=postgres",
      "--format",
      '{{.Label "com.docker.compose.project.working_dir"}}',
    ]);
  if (owner !== repository) {
    throw new Error(
      `Volume ${volume} belongs to a different checkout or its owner could not be verified.`,
    );
  }
  return volume;
}

export async function resetPostgres(project) {
  validatePasswords(project);
  const connectionString = migrationUrl(project);
  const contextHost = inspectDocker([
    "context",
    "inspect",
    "--format",
    "{{.Endpoints.docker.Host}}",
  ]);
  if (
    !/^(unix|npipe):\/\//.test(contextHost) ||
    (process.env.DOCKER_HOST &&
      !/^(unix|npipe):\/\//.test(process.env.DOCKER_HOST))
  ) {
    throw new Error("Database reset requires a local Docker socket.");
  }

  const volume = existingDatabaseVolume(project);
  console.info(`Resetting PostgreSQL volume ${project.name}_postgres_data.`);
  await compose(project, "rm", "--stop", "--force", "postgres");
  if (volume) {
    execFileSync("docker", ["volume", "rm", volume], { stdio: "inherit" });
  }
  await startPostgres(project);
  await applyMigrations(connectionString);
}

if (import.meta.main) {
  const command = process.argv[2];
  const commands = {
    up: () => startPostgres(development),
    stop: () => {
      existingDatabaseVolume(development);
      return compose(development, "stop", "postgres");
    },
    migrate: () => migratePostgres(development),
    reset: () => resetPostgres(development),
  };

  try {
    if (!Object.hasOwn(commands, command)) {
      throw new Error("Expected one of up, stop, migrate or reset.");
    }
    await commands[command]();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
