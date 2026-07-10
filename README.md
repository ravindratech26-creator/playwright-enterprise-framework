# Playwright Enterprise Framework

Playwright + TypeScript UI test automation framework with MongoDB-backed test data, Allure reporting, Winston logging, and a shared execution pipeline across local, Docker, GitHub Actions, and Jenkins.

Currently covers the **login module**; additional modules (cart, checkout, ...) will be added incrementally.

## Architecture

- `pages/` — Page Object Models (`BasePage`, `LoginPage`, `InventoryPage`)
- `tests/` — spec files, organized by module (`tests/login/`)
- `fixtures/pages.ts` — Playwright fixture wiring page objects into `test`
- `hooks/` — `beforeEach`/`afterEach` (logging, navigation, failure screenshots), wired via `hooks/index.ts`
- `utils/` — `Logger` (Winston), `Database`/`MongoDBClient`, `TestContext`
- `globalSetup.ts` / `globalTeardown.ts` — seeds the test user into MongoDB automatically before every run, in every environment
- `scripts/copyAllureHistory.ts` — carries Allure trend history (Duration/Retries/Categories/Trend graphs) across report generations

## Prerequisites

- Node.js 24+
- Docker (for Docker/Jenkins execution)
- A running MongoDB instance (or use `docker-compose.yml`, which provisions one)

## Environment variables

Set in `.env.local` (local) or `.env.docker` (Docker/Jenkins) — both gitignored, never commit real values.

| Variable           | Purpose                           |
| ------------------ | --------------------------------- |
| `BASE_URL`         | URL of the application under test |
| `MONGO_URI`        | MongoDB connection string         |
| `MONGO_DATABASE`   | MongoDB database name             |
| `MONGO_COLLECTION` | Collection holding the test user  |
| `TEST_USER`        | Username seeded/used for login    |
| `TEST_PASSWORD`    | Password seeded/used for login    |

Optional tuning variables (all have safe defaults): `RETRIES`, `WORKERS`, `REPORT_SUFFIX`, `ENV_FILE`.

## Running tests locally

```bash
npm install
npm run test:local          # uses .env.local
npm run test:chromium       # single browser
npm run test:smoke          # tests tagged @smoke
npm run test:regression     # tests tagged @regression
```

Reports: `playwright-report/` (HTML), `reports/json`, `reports/junit`, `allure-results/`.

```bash
npm run allure:generate     # generate ./allure-report (carries forward trend history)
npm run allure:open
```

## Running with Docker

```bash
npm run docker:test
```

Starts MongoDB, waits for its healthcheck, then runs the Playwright suite (seeding happens automatically via `globalSetup.ts` — no separate seed step needed). Reports land in the same `playwright-report/`, `test-results/`, `allure-results/` folders via bind mounts.

`docker:test` runs `docker compose up --build --abort-on-container-exit --exit-code-from playwright`. The `--abort-on-container-exit` flag is important: `mongo` has `restart: unless-stopped`, so without it Compose would keep `mongo` running forever after the tests finish and never return control to your terminal. `--exit-code-from playwright` also makes the command's own exit code match the test run's pass/fail status, so it composes cleanly with CI/scripts.

Plain `docker compose up --build` still works, but you'll need to manually stop it (`Ctrl+C`, then `npm run docker:down`) once you see the test summary — Mongo won't stop on its own.

## GitHub Actions

Workflow: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

- Triggers: push/PR to `main`, or manual `workflow_dispatch` (optional `tag` input to filter `@smoke`/`@regression`)
- **`lint`** job runs ESLint + Prettier check first
- **`playwright-tests`** runs as a `chromium`/`firefox`/`webkit` matrix in parallel (`fail-fast: false`), each with its own MongoDB service container
- **`merge-reports`** downloads all three browsers' Allure results, merges them, and publishes one combined Allure report with trend history preserved via `actions/cache`

Required repo Secrets: `BASE_URL`, `MONGO_URI`, `MONGO_DATABASE`, `MONGO_COLLECTION`, `TEST_USER`, `TEST_PASSWORD`.

## Jenkins

Pipeline: [`Jenkinsfile`](Jenkinsfile)

Parameters:

- `ENVIRONMENT` — `dev` / `qa` / `uat` (see below)
- `BROWSER` — `chromium` / `firefox` / `webkit` / `all` (runs all three in parallel branches)
- `TEST_SUITE` — `all` / `tests/login`
- `TAG` — `all` / `smoke` / `regression`

Pipeline stages: checkout → lint & format check → generate `.env.docker` from credentials → build Docker image → start MongoDB → run tests (parallel per-browser when `BROWSER=all`) → archive reports & publish Allure.

### Dev / QA / UAT (Jenkins only)

Jenkins is the only pipeline that supports targeting multiple environments. The `ENVIRONMENT` parameter selects which set of Jenkins credentials to inject into `.env.docker` at build time — local runs and GitHub Actions remain single-environment (their existing `.env.local` / repo Secrets).

Create these Jenkins credentials (Secret Text), one set per environment, named `<environment>-<VAR>`:

| Variable         | dev                    | qa                    | uat                    |
| ---------------- | ---------------------- | --------------------- | ---------------------- |
| Base URL         | `dev-BASE_URL`         | `qa-BASE_URL`         | `uat-BASE_URL`         |
| Mongo DB name    | `dev-MONGO_DATABASE`   | `qa-MONGO_DATABASE`   | `uat-MONGO_DATABASE`   |
| Mongo collection | `dev-MONGO_COLLECTION` | `qa-MONGO_COLLECTION` | `uat-MONGO_COLLECTION` |
| Test user        | `dev-TEST_USER`        | `qa-TEST_USER`        | `uat-TEST_USER`        |
| Test password    | `dev-TEST_PASSWORD`    | `qa-TEST_PASSWORD`    | `uat-TEST_PASSWORD`    |

(15 credentials total.) `MONGO_URI` is not environment-specific — it always points at the `mongo` container on the Docker Compose network.

## Visual regression

`tests/login/login.spec.ts` asserts a screenshot baseline of the login form (`toHaveScreenshot`, threshold `maxDiffPixelRatio: 0.02` in `playwright.config.ts`).

**Snapshots are OS-specific.** A baseline captured on Windows will not match Linux CI. Always (re)generate baselines inside the Docker image so they match what CI renders:

```bash
docker compose run --rm playwright npx playwright test --update-snapshots
```

Commit the resulting `tests/**/*-snapshots/` folder — it is not gitignored.

## Linting & formatting

```bash
npm run lint          # ESLint
npm run lint:fix
npm run format        # Prettier --write
npm run format:check  # Prettier --check (used in CI)
```

A Husky pre-commit hook runs `lint-staged` (ESLint + Prettier) on staged `*.ts` files automatically. Both GitHub Actions and Jenkins run lint/format checks before tests.

## Test tags

Tests are tagged via Playwright's native `{ tag: [...] }` option (`@smoke`, `@regression`), filterable anywhere with `--grep @tag` — already wired into the local npm scripts, the GitHub Actions `tag` input, and the Jenkins `TAG` parameter.
