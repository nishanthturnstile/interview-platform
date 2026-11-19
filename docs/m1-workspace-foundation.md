# M1 · Workspace foundation

M1 delivers a local BU Interview Studio that a developer can start from a clean checkout, migrate, inspect in a browser, stop and restart with its data intact. Engineering signs off when a second person can reproduce that sequence using the README. The planning baseline consisted of four documents in a directory without an initialized Git repository. [Delivery plan](./implementation-plan.md#3-work-packages-and-acceptance)

## Scope and implementation decisions

- Run the web app on the host and PostgreSQL in Compose for this increment. Use Next.js App Router, TypeScript, pnpm, Tailwind v4, Radix-based shadcn/ui, Lucide, PostgreSQL, `pg` and Drizzle. Start version selection with Node 24 LTS and PostgreSQL 18. Verify compatibility, then record exact tool versions, package resolutions and the Postgres image digest in the scaffold. [Architecture](./architecture.md#2-technology-decisions) · [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- Establish a Node worker entry point and a shared server-side domain package. Compile and smoke-test the worker entry point with a successful exit. M2 starts the long-running process, adds Graphile Worker, and introduces BU identity, roles, tenant policies, storage and brief extraction. M4 adds candidate grants and HTTPS ingress. [Delivery plan](./implementation-plan.md#3-work-packages-and-acceptance)
- Use `/staff` and `/candidate` for the two loopback previews. Use light mode by default and store an explicit light or dark choice in a same-origin cookie. Use the product wordmark and local system font stacks. [Design system](./design-system.md#1-foundation-and-setup)
- Make the first migration establish the application namespace and schema permissions. Verify ordinary reads and writes with a test table owned by the migration role in a disposable Compose database. Use a regular table so the persistence check crosses connections and restarts. M2 supplies the first hiring records and extends the synthetic reset with fixtures. [Architecture](./architecture.md#3-domain-modules-and-durable-records)

## Proposed repository layout

| Path | Responsibility |
| --- | --- |
| `apps/web` | Next.js entry point, root theme, independent staff and candidate layouts, server-only database adapter and readiness route |
| `apps/worker` | Plain Node entry point, build and one-shot smoke check. M2 turns it into a separate worker process. |
| `packages/domain` | Shared TypeScript package for business rules used by web server and worker code as those rules arrive |
| `packages/db` | Drizzle schema, `pg` pool, migration configuration and versioned SQL migrations with their generated metadata |
| `infra/postgres` and `compose.yaml` | Local PostgreSQL service, Docker volume, health check and bootstrap for the database roles |
| `tests` | Vitest unit and database integration checks, plus Playwright shell smoke tests |
| Root workspace files and `README.md` | Package and runtime pins, `pnpm-workspace.yaml`, lockfile, `biome.json`, shared TypeScript defaults, environment examples and developer commands |

## 1. Scaffold and prove the workspace

1. Establish the project Git root with the four existing documents. Create a private pnpm workspace with `apps/*` and `packages/*`, one lockfile, exact Node and pnpm pins and `workspace:*` links where a package has a real consumer. Keep commands rooted at the repository so each contributor runs the same entry points.
2. Scaffold `apps/web` with App Router, strict TypeScript and the `src` directory. Select Biome as the only formatter and linter for supported files. Check in an exact `@biomejs/biome` version and root `biome.json`. Exclude generated build outputs and browser test artifacts from repository checks. Keep package scripts and imports resolving through explicit package exports.
3. Add `apps/worker` and `packages/domain` boundaries and include them in type checking and production builds. Keep database imports behind a server-only adapter in the web app. Keep the database package itself usable from ordinary Node so M2 can call it from the worker. Set the workspace build order according to package dependencies.
4. Wire Vitest, a separate database test entry point and Playwright. Make the default `test` command independent of running services. Make `build` succeed with PostgreSQL stopped and without database environment files. Keep database configuration and connections lazy until a server request needs them.

**Ready for review when** a frozen install, Biome check, type check, unit suite and production build all pass. The built worker entry point exits successfully as a one-shot smoke check.

## 2. Establish PostgreSQL, migration and reset

1. Pin the official PostgreSQL image and mount a named, Compose-owned volume at the location documented for that major version. For PostgreSQL 18, mount `/var/lib/postgresql`. Publish only on `127.0.0.1`, with a configurable local port. Check readiness over TCP so a socket used during initialization cannot satisfy the check. Bound the database start wait. Stop and restart preserve the volume. [PostgreSQL image documentation](https://hub.docker.com/_/postgres) · [Compose startup and health checks](https://docs.docker.com/compose/how-tos/startup-order/)
2. Use bootstrap credentials only inside the database provisioning path. Create two separate non-superuser login roles with distinct passwords. Give the migrator database `CONNECT` and `CREATE` so it can own the application and migration schemas. Give the runtime role `CONNECT` and schema `USAGE`, with explicit per-table grants as each feature lands. Remove public creation rights where applicable and keep the runtime role out of ownership and migration-role membership. Use three credential scopes in the environment examples. [PostgreSQL privileges](https://www.postgresql.org/docs/18/ddl-priv.html)

   | Local file | Example variables | Reader |
   | --- | --- | --- |
   | `.env.compose` | `POSTGRES_PASSWORD`, `DB_MIGRATOR_PASSWORD`, `DB_RUNTIME_PASSWORD`, `DB_PORT` | Compose and bootstrap script |
   | `.env.migrate` | `DATABASE_MIGRATION_URL` | `db:migrate` |
   | `apps/web/.env.local` | `DATABASE_URL` | Web server |

   Commit example files with placeholders and ignore populated files. Document exactly which file each command reads and how to build URLs with encoded passwords. Limit each process to its own configuration. Treat changes to bootstrap variables on an existing volume as a documented credential update or an explicit local reset. [PostgreSQL image initialization](https://hub.docker.com/_/postgres)

3. Declare the `interview` schema in `packages/db`, generate the initial migration with Drizzle Kit and review the SQL and metadata. Include the schema grant in that migration. Configure the migration journal in a private schema owned by the migrator. Run migrations through one explicit command before starting the app and serialize migration execution. Confirm that the next schema generation will recognize the application namespace. [Drizzle PostgreSQL schemas](https://orm.drizzle.team/docs/schemas) · [Drizzle migration log](https://orm.drizzle.team/docs/drizzle-kit-migrate)
4. Add a server-side `pg` pool with Drizzle and one uncached Node readiness route at `GET /api/health/ready`. Use the runtime role to check connectivity and confirm access to the migrated schema. Return a generic `200` when ready or `503` on missing configuration, unavailable PostgreSQL or an unapplied migration. Bound connection and query waits. Handle errors on idle connections so the pool can recover across a database restart. Keep credentials and database error details out of the response. [node-postgres pool](https://node-postgres.com/apis/pool)
5. Define `db:reset` as an explicit local operation. Target the known development Compose project and its Postgres volume using the checked-in Compose configuration and local environment. Validate the target before removal and surface the volume being removed. Recreate PostgreSQL, wait for bootstrap and reapply migrations. Exercise the same reset logic through the integration harness with its own Compose project, volume and local port.

**Ready for review when** migrations apply on a fresh volume and a repeat leaves the journal unchanged. A row written using runtime credentials survives a stop, start and forced container recreation. The runtime role can use granted objects and receives database permission denials for schema creation, DDL on migration-owned tables, and migration journal writes. The local reset starts with a fresh database and reapplies the migration.

## 3. Build the two layouts and apply the theme

1. Keep a single root App Router layout for HTML, default metadata and the global stylesheet. Use `(staff)/staff` and `(candidate)/candidate` for the layout branches. Redirect `/` to `/staff`. Treat the candidate preview as a direct route with fixture-free content and its own compact header. Place any future staff context inside the staff layout boundary. [Next.js route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
2. Initialize the official shadcn/ui registry with Radix, Nova, Neutral, Lucide, small radius, solid menus and subtle menu accent. Commit the generated `components.json` and source for the components used by the shells, starting with Button, Sidebar and its Sheet dependency. Merge the design system's CSS into the configured global stylesheet once. Preserve the Tailwind and shadcn imports. Use the project's exact theme mappings and shared focus styles. [Design system tokens](./design-system.md#2-color-and-theme-contract) · [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
3. Give the staff shell a 64px header, approximately 240px collapsible desktop sidebar, 24–32px workspace gutters, a labelled current destination and a simple empty workspace state. Below 768px, use a titled Sheet and 16px gutters. Use meaningful landmark names, a skip link and one H1. The candidate surface has its own page title, a compact header and a short empty state. Render staff navigation and BU context only on `/staff`.
4. Read the validated theme cookie at the root and set `.dark` on `<html>` before paint. Let a labelled keyboard-operable control update the preference and refresh the rendered theme across both layouts. Verify the mobile Sheet uses the same theme through its portal. Remove its sliding transition when reduced motion is requested. Check the actual computed hover, pressed and focus colors on rendered controls. Use locally available styles, fonts and icons. [Next.js cookies](https://nextjs.org/docs/app/api-reference/functions/cookies) · [Design system accessibility](./design-system.md#6-validation-and-acceptance)

**Ready for review when** both routes load directly in both themes. The candidate DOM has its own landmarks and no staff controls. Staff navigation works with keyboard only, including opening the mobile Sheet, closing it with Escape and returning focus to the trigger. Both pages fit at 320 CSS px and at 200% text zoom. Rendered text and meaningful visual indicators meet the design system targets of 4.5:1 and 3:1 respectively for the M1 controls. [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) · [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

## 4. Document and verify the developer workflow

Document prerequisite versions, environment setup and expected URLs in the README. The following commands are the proposed entry points for the implementation.

```sh
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:migrate
pnpm dev
```

`pnpm dev` serves the web app on loopback and prints its URL. `pnpm db:stop` stops PostgreSQL with its data intact. `pnpm db:reset` explicitly recreates the disposable development database. `pnpm start` serves the production build on loopback. Document Playwright browser installation and how to rerun the production smoke tests on a distinct web port.

| Check | Proposed command or procedure | Pass condition |
| --- | --- | --- |
| Reproducible workspace | `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` | Install preserves the lockfile. All checks pass, and production build succeeds with no running database or database credentials. |
| Migration and runtime grants | `pnpm test:db` against actual PostgreSQL | Clean migration and repeat pass. On a test table that has explicit runtime permissions, a runtime write succeeds. Schema creation and access to the migration journal are denied. |
| Persistence and reset | `pnpm test:db` in a disposable Compose project | Insert a unique marker into a regular test table, read it after restarting and recreating PostgreSQL, then reset the test project and confirm the fresh migrated baseline. |
| Readiness and recovery | `pnpm test:db` or documented request sequence against the running app | The readiness route returns `503` before migration and while PostgreSQL is stopped. After migration or restart it returns `200` using runtime credentials and recovers without restarting the web process. |
| Shell smoke | `pnpm test:e2e` against `pnpm start` | `/` redirects to `/staff`. Both pages render in light and dark. Theme choice survives reload and direct navigation. Candidate renders without the staff sidebar or BU controls. |
| Accessibility and local assets | Playwright assertions plus a short manual review | Verify keyboard focus and Sheet behavior, 320 CSS px layout, 200% text zoom, reduced motion and computed contrast. Record zero external asset requests when visiting either page. |
| Independent reproduction | Second developer follows the README from a clean checkout | Both shells and readiness work, persistent restart is repeatable, and the commands and expected output are sufficient to diagnose a missing variable or port conflict. |

## Review order and handoff

Review the scaffold first. Database setup and shell implementation can proceed independently after that. The final review combines the database, UI and production smoke checks using the same README. Record the Git revision, environment, verification commands and observed outcomes. M1 is complete when all entries in the verification table pass.

M2 starts from the verified database role and schema convention, the staff layout for BU context, and the worker entry point. Add BU tables, row-level policies, scoped transactions, synthetic staff and the reset fixtures together so access is testable through the real workflow. [M2 work package](./implementation-plan.md#m2--build-bu-ownership-standards-and-openings)
