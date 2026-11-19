# BU Interview Studio

BU Interview Studio is a local, synthetic-data proof of concept for structured technical interviews. The workspace includes a Next.js app, a Node worker entry point and a TypeScript package for shared domain rules. The [M1 implementation plan](docs/m1-workspace-foundation.md) tracks the foundation work.

## Start the scaffold

Use Node.js `24.22.3` from `.node-version` and pnpm `12.21.0` from `package.json`. Run the commands from the repository root.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:3000`. Pass `--port 3001` to `pnpm dev` if that port is occupied. The scaffold runs with Node and pnpm alone.

The staff workspace is at `/staff`, the candidate preview is at `/candidate`, and the component reference is at `/staff/design-system`. Use the Dark mode button in either header to change the theme. The app remembers the setting across both layouts.

## Verify the scaffold

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

## Design system

The web app uses the official shadcn/ui Radix Nova components with Tailwind CSS v4. Add components with `pnpm dlx shadcn@latest add <component>` from `apps/web`. The app loads its light and dark tokens from `apps/web/src/app/globals.css` and uses local system font stacks. [Design system specification](docs/design-system.md) · [shadcn/ui theming](https://ui.shadcn.com/docs/theming)

## Workspace layout

| Directory | Contents |
| --- | --- |
| `apps/web` | Next.js App Router app with Tailwind CSS v4 and the Turbopack loader |
| `apps/worker` | Standalone TypeScript worker entry point |
| `packages/domain` | Package boundary for shared domain rules |
| `tests` | Vitest checks and Playwright production smoke tests |

The scaffold uses the official generators and tooling. [pnpm init](https://pnpm.io/cli/init) · [Create Next App](https://nextjs.org/docs/app/api-reference/cli/create-next-app) · [Biome](https://biomejs.dev/installation/quick-start/) · [Vitest](https://vitest.dev/guide/) · [Playwright](https://playwright.dev/docs/intro)
