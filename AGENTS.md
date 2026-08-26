# Beyond the Jar — Project Context

## Purpose of this file

This file is the durable working context for AI-assisted development. Read it before planning, designing, or changing the project. Keep it concise and update it when a product or architecture decision is confirmed.

## Current phase

- Status: product and architecture definition.
- Next phase: UX/UI exploration and visual mockups in Figma.
- Do not start implementation until the initial mockups and main flows have been reviewed.
- No application dependencies have been selected or installed yet, except for the high-level technology decisions recorded below.

## Product summary

Beyond the Jar is a personal mission tracker connected to a physical glass jar containing 150 paper missions. The application never selects a mission: the user physically draws a paper slip, then records that revealed mission in the application.

The application must help the user:

- record and follow revealed missions;
- mark missions as completed;
- see progress across all 150 missions and within each category;
- know when a physical reward may be drawn;
- record the lifecycle of the 15 physical rewards.

The first version is personal, local, single-user, and usable without an Internet connection as long as the local API is running. A later iteration may run on a NAS and be accessed from a phone. A desktop-packaged version is expected later, but its technology must not influence the V1 unnecessarily.

## Language conventions

- Project name and folder: `beyond-the-jar`.
- Code, code comments, commit-oriented technical text, and project documentation: English.
- Initial user interface: French.
- Use stable, language-independent English identifiers for domain values.
- Prepare UI copy for future localization without building a complete multilingual system prematurely.

## Mission rules

### Physical and digital boundary

- There are exactly 150 physical missions: 30 missions in each of five categories.
- Unrevealed missions stay physical and must not be entered individually in the application.
- The application may derive the hidden count from the known total of 150.
- A mission is created digitally only after its paper slip has been physically drawn.

### Mission lifecycle

Conceptual lifecycle: `hidden -> in-progress -> completed`.

- `hidden` is an aggregate state only; hidden mission records do not exist digitally.
- A newly entered revealed mission starts as `in-progress`.
- A completed mission may be corrected back to `in-progress`.
- A mission entered by mistake may be deleted after explicit confirmation.
- All information on a revealed mission remains editable.

### Mission data

Record at least:

- title;
- category;
- difficulty from 1 to 5 stars;
- reveal date, defaulted automatically but editable;
- completion date, set automatically when completed but editable;
- optional notes.

Do not introduce a separate `description` field unless a concrete need appears; it currently overlaps with notes.

## Categories

Category display names are partly temporary. Technical identifiers must remain stable when display names change.

| Stable ID | Initial French label | Color |
| --- | --- | --- |
| `exploration` | Exploration | Green |
| `unusual` | Insolite | Red |
| `yellow` | Catégorie jaune | Yellow |
| `blue` | Catégorie bleue | Blue |
| `orange` | Catégorie orange | Orange |

- Each category contains exactly 30 missions.
- Category colors are meaningful product data, not merely decorative styling.
- Reward visuals use light gray.
- The application brand uses smoky plum, independently from category colors:
  - primary: `#4B3F50`;
  - primary hover/pressed: `#5D4D63`;
  - soft background: `#E9E1E9`;
  - focus outline: `#927D98`;
  - text on primary: `#FFFFFF`.
- Category colors are functional and reserved for their respective categories: green for Exploration, red for Insolite, and yellow, blue, and orange for the temporary categories.
- Category colors must not be used as generic brand accents; use the smoky plum brand palette for global actions, navigation, and overall progress.

## Reward rules

- There are exactly 15 physical rewards.
- Each category grants one reward opportunity at 10, 20, and 30 completed missions: three per category, fifteen overall.
- Reward contents are unknown to the application until the user physically draws them.
- Reward lifecycle: `locked -> available -> drawn -> redeemed`.
- A drawn or otherwise revealed reward can never become hidden again.
- If mission completion is corrected later, an already revealed reward remains acquired.
- A reward can be used only once.

## UX direction

- Touch-friendly, playful, and tactile, while remaining sober and efficient as a tracking application.
- Original but restrained; avoid excessive decoration and avoid relying on a literal jar representation.
- Tailwind CSS is preferred over Angular Material.
- Treat category colors as a central navigation and progress cue.
- Design as a senior UX/UI workflow: clarify flows and validate visual mockups before implementation.

Initial screens to explore in Figma:

- dashboard and overall progress;
- revealed mission list with filters;
- add a revealed mission;
- mission details, editing, and completion;
- progress by category;
- rewards and their lifecycle.

## Validated V1 architecture

### Repository layout

Use a minimal pnpm workspace without Nx or Turborepo:

```text
beyond-the-jar/
|-- apps/
|   |-- web/          Angular PWA
|   `-- api/          TypeScript REST API
|-- docs/
|-- AGENTS.md
|-- package.json
|-- pnpm-workspace.yaml
`-- pnpm-lock.yaml
```

- Do not create a generic `packages/shared` directory preemptively.
- Add a narrowly named workspace package, such as `packages/api-contracts`, only when actual sharing justifies it.
- Root pnpm scripts may orchestrate the two applications using workspace filters.

### Web application

- Use the latest stable Angular version available when implementation begins.
- Build a PWA.
- Use Tailwind CSS following the current Angular-compatible setup at implementation time.
- UI is client-rendered; no SSR requirement has been identified.

### API

- Use a TypeScript REST API built with NestJS and its default Express adapter.
- Keep the NestJS architecture proportional to this small application; do not introduce CQRS, generic base layers, or extra modules without a concrete need.
- In V1, bind the API to `localhost` only and use no authentication.
- During development, Angular proxies `/api` to the API development server.
- For normal local use, serve the built Angular application and `/api` from one origin and one port.
- If the application later becomes reachable on a LAN or NAS, revisit authentication and network security before exposing it.

### Persistence

- SQLite is the single source of truth.
- The SQLite file must live in a clearly identified persistent filesystem location, outside browser-managed storage.
- Do not use IndexedDB as a V1 domain-data store.
- Do not add manual import/export as a substitute for durable persistence.
- Use small repository interfaces at the domain/application boundary so the persistence implementation can evolve without adding ceremonial layers.
- Track schema evolution through versioned migrations from the beginning.
- The exact SQLite driver or data-access tool is intentionally deferred until implementation. Evaluate direct SQL, Drizzle, and Prisma against simplicity, migration support, current stability, pnpm compatibility, and later desktop packaging.

### Availability and offline behavior

- V1 needs no Internet connection because the web application, API, and database are local.
- V1 does not support operation without the API.
- If the API is unavailable, the PWA may render its cached shell, but it must not present cached domain data as reliable or allow modifications.
- Show a clear French-language server-unavailable state.
- Do not build offline editing, synchronization queues, or conflict resolution in V1.

## Explicitly deferred decisions

- Final names for the yellow, blue, and orange categories.
- Exact SQLite driver or ORM/data-access library.
- Automated database backups and NAS snapshot policy.
- NAS deployment topology and authentication.
- Desktop packaging technology, such as Tauri or Electron.
- Full offline editing and synchronization.
- Complete internationalization implementation.

## Desktop V2 intent

Do not design V1 around a detailed desktop solution, but preserve these future acceptance criteria:

- launchable from the Windows Start menu;
- automatically starts its required local backend;
- uses persistent local SQLite storage;
- works without an Internet connection;
- reuses the Angular user interface where practical.

Choose the desktop technology later through a small technical prototype.

## Engineering guardrails

- Use ECMAScript modules (ESM) throughout the workspace; do not introduce CommonJS modules.
- Prefer the simplest implementation that preserves the validated product rules.
- Avoid speculative abstractions, generic shared packages, CQRS, microservices, and distributed synchronization in V1.
- Keep mission and reward invariants enforced by the API, not only by the UI.
- Use database constraints where they materially protect known invariants.
- Validate API inputs and outputs.
- Make dates explicit and test correction scenarios.
- Treat reward irreversibility as a domain rule.
- Do not silently introduce cloud services, telemetry, authentication, or online dependencies.
- Keep `.gitignore` aligned with tools that are actually introduced. Ignore generated artifacts and local data, but keep source files, shared configuration, examples, and lockfiles tracked.

## Decision log

- Product name selected: Beyond the Jar (`beyond-the-jar`).
- Physical jar remains the source of mission selection.
- Total inventory fixed at 150 missions and 15 rewards.
- Tailwind CSS selected over Angular Material.
- pnpm selected as package manager.
- Angular PWA selected for the web client.
- SQLite plus a local NestJS REST API selected over browser-only storage and MongoDB.
- V1 is localhost-only, unauthenticated, single-user, and requires the local API.
- Visual design in Figma precedes application implementation.

## Runtime version policy

- Use Node.js `24.x` for local development, scripts, builds, and CI.
- Move to a newer Node.js major version only after an explicit project decision and compatibility verification.
- When application scaffolding begins, add an appropriate version-pinning file and keep package metadata aligned with this policy.

## TypeScript version policy

- Use TypeScript `7.x` whenever the project requires TypeScript.
- Verify Angular and NestJS compatibility with TypeScript `7.x` before scaffolding or upgrading either application.
- Never silently downgrade to TypeScript `6.x` or an earlier major version; stop and report any compatibility blocker.

## Git conventions

- Write commit messages in English.
- Follow the Conventional Commits specification for every commit.
- Keep commits focused and describe the user-visible or architectural intent.
