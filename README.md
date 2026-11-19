# BU Interview Studio

BU Interview Studio is a local, synthetic-data proof of concept for structured technical interviews. The workspace includes a Next.js app, a Node worker entry point and a TypeScript package for shared domain rules. The [M1 implementation plan](docs/m1-workspace-foundation.md) tracks the foundation work.

## Run locally

Use Node.js `24.22.3` from `.node-version` and pnpm `12.21.0` from `package.json`. Run the commands from the repository root.

For database setup, start Docker with the Compose plugin. On first setup, copy the three environment examples.

```sh
cp .env.compose.example .env.compose
cp .env.migrate.example .env.migrate
cp apps/web/.env.local.example apps/web/.env.local
```

Run `openssl rand -hex 24` once per role for three distinct local passwords. Set the passwords in `.env.compose` and use the corresponding migrator and runtime passwords in the two connection URLs. The examples use port `5432`. If you change `DB_PORT`, update both URLs. Hex passwords can be inserted as written. Percent-encode reserved characters if you choose a different password format.

| File | Reader |
| --- | --- |
| `.env.compose` | Compose and the PostgreSQL bootstrap script |
| `.env.migrate` | `pnpm db:migrate` |
| `apps/web/.env.local` | Next.js server |

```sh
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:migrate
pnpm dev
```

Open `http://127.0.0.1:3000`. Pass `--port 3001` to `pnpm dev` if that port is occupied. `GET /api/health/ready` returns `200` once the runtime role can use the migrated schema and `503` while the database is unavailable or unmigrated. The workspace previews can run independently of the database.

The staff workspace is at `/staff`, the candidate preview is at `/candidate`, and the component reference is at `/staff/design-system`. Use the Dark mode button in either header to change the theme. The app remembers the setting across both layouts.

## Manage the development database

- `pnpm db:stop` stops PostgreSQL and preserves its volume. `pnpm db:up` starts PostgreSQL again and waits for its TCP health check.
- `pnpm db:generate --name=description` generates a migration from the Drizzle schema. Review the SQL and include it with the generated metadata. `pnpm db:migrate` applies pending migrations under the migration role.
- `pnpm db:reset` **deletes the local development PostgreSQL volume**, recreates it and reapplies the migrations. Use it for disposable synthetic data. Bootstrap passwords are set when the volume is initialized. To change credentials while retaining data, update the roles in PostgreSQL and the environment files together, then restart the web process.

The development Compose project is scoped to one checkout per Docker context. Database commands verify volume ownership before reusing or removing it. Use `pnpm db:stop` to retain both the volume and its associated service container.

## Verify the workspace

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke:worker
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm build` builds all workspace packages. Run `pnpm start` to serve the built web app on loopback. `pnpm smoke:worker` runs the built Node entry point once and exits. The Playwright suite starts and stops its own production server on port `3100`. It checks the theme, rendered colors, navigation and focus in Chromium. Set `PLAYWRIGHT_PORT` to use a different port.

Run `pnpm test:db` with Docker running to check migrations, runtime grants, readiness, volume persistence and reset. It creates and removes a disposable Compose project and starts its own production web process with generated credentials and separate loopback ports.

## Design system

The web app uses the official shadcn/ui Radix Nova components with Tailwind CSS v4. Add components with `pnpm dlx shadcn@latest add <component>` from `apps/web`. The app loads its light and dark tokens from `apps/web/src/app/globals.css` and uses local system font stacks. [Design system specification](docs/design-system.md) · [shadcn/ui theming](https://ui.shadcn.com/docs/theming)

## Workspace layout

| Directory | Contents |
| --- | --- |
| `apps/web` | Next.js App Router app with Tailwind CSS v4 and the Turbopack loader |
| `apps/worker` | Standalone TypeScript worker entry point |
| `packages/domain` | Package boundary for shared domain rules |
| `packages/db` | Drizzle schema and SQL migrations, node-postgres pool and migration runner |
| `infra/postgres` | Local Compose commands and bootstrap for the database roles |
| `tests` | Vitest unit and PostgreSQL integration checks, and Playwright production smoke tests |

The scaffold uses the official generators and tooling. [pnpm init](https://pnpm.io/cli/init) · [Create Next App](https://nextjs.org/docs/app/api-reference/cli/create-next-app) · [Biome](https://biomejs.dev/installation/quick-start/) · [Vitest](https://vitest.dev/guide/) · [Playwright](https://playwright.dev/docs/intro)
