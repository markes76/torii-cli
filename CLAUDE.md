# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Build with tsup → dist/
npm run dev          # Build in watch mode
npm test             # Run Vitest tests
npm run test:watch   # Tests in watch mode
npm run lint         # Type check (tsc --noEmit)
```

Run a single test file: `npx vitest run src/utils/safety.test.ts`

The compiled CLI is at `dist/index.js`. During development, run commands directly: `node dist/index.js <command>`

## Architecture

**Stack:** TypeScript (strict, ESM), Node.js 20+, Commander.js, Axios, Vitest, tsup
**API:** Torii SaaS Management API — `https://api.toriihq.com/v1.0` — REST + SCIM 2.0
**Config:** `~/.torii-cli/config.json` (never committed). Priority: CLI flag > env var > config file > default.

### Source layout

```
src/
├── index.ts              # Commander setup, global flags, command registration
├── config.ts             # Config loading + first-run onboarding (prompts API key, validates via GET /orgs/my)
├── client.ts             # Axios wrapper: auth header, rate limit backoff, 5xx retry, pagination
├── commands/             # One file per resource group (org, users, apps, contracts, scim, etc.)
├── utils/
│   ├── output.ts         # JSON (default) / table / CSV formatting; --fields post-filter; --raw
│   ├── pagination.ts     # Cursor-based auto-paginate; SCIM offset pagination; --limit / --no-paginate
│   ├── rate-limit.ts     # 429 detection, exponential backoff, Retry-After header parsing, max 3 retries
│   ├── safety.ts         # Write gating: mode check → confirmation prompt → --dry-run support
│   └── solutions.ts      # Search solutions/INDEX.md; log unsolved errors to solutions/unsolved/
└── types/index.ts        # TypeScript interfaces for all Torii entities
```

### Data flow

Every command: parse args → `checkWritePermission()` (write only) → `client.get/post/...()` → `paginate()` → `formatOutput()`

The **safety gate** (`utils/safety.ts`) must be called by every write command before the HTTP request. `checkWritePermission({ operation, method, url, body, dryRun, force })` returns `true` (proceed) or `false` (abort).

The **solutions engine** (`utils/solutions.ts`) runs on every error before displaying it: search `solutions/INDEX.md` for matching error/endpoint/tags, show the known fix if found, otherwise auto-log to `solutions/unsolved/`.

## Critical: Read docs/ Before Building

`docs/` contains the authoritative API reference scraped directly from Torii. It overrides anything in this file.

| What | Where |
|------|-------|
| All endpoints + params | `docs/api-reference/endpoints/` |
| Entity schemas (→ TypeScript types) | `docs/api-reference/schemas/` |
| Command structure | `docs/cli-planning/command-map.md` |
| Which params are valid per endpoint | `docs/appendix/valid-params-per-endpoint.md` |
| API gotchas | `docs/appendix/known-quirks.md` |
| Write operations reference | `docs/cli-planning/write-operations.md` |
| OpenAPI spec | `docs/raw/openapi-spec.json` |

## Safety Rules (Non-Negotiable)

**Default mode is `read-only`.** Only GET requests are allowed unless mode is explicitly set to `full`.

**Write operation gating** — every POST/PUT/PATCH/DELETE command must:
1. Call `checkWritePermission()` — exits with code 1 if mode is `read-only`
2. Show a confirmation prompt (`Proceed? [y/N]`) — skipped with `--yes`/`--force`
3. Support `--dry-run`: print the full request (method, URL, headers, body) and exit without sending

**For AI agents:** During development and testing, **only use GET commands**. Test write logic exclusively with `--dry-run`. This is a production environment — writes are not recoverable.

## Testing Rules

- Unit tests: `safety.ts`, `pagination.ts`, `output.ts`, `rate-limit.ts`, `config.ts`
- Integration tests: GET endpoints only against live API
- Write command tests: `--dry-run` only — never send actual POST/PUT/PATCH/DELETE in tests
- Test framework: Vitest (`vitest.config.ts`)

## Knowledge Base

`solutions/` is committed to git. When you hit any error:
1. Check `solutions/INDEX.md` first — show the known fix if it exists
2. If unsolved, auto-log to `solutions/unsolved/` with endpoint, params, status, response, timestamp
3. When you resolve an unsolved issue, move it to the right category and update `solutions/INDEX.md`
4. If the error reveals undocumented API behavior, also update `docs/appendix/known-quirks.md`

Solution file format: Problem / Root Cause / Solution / Prevention / Metadata (date, endpoint, error code, severity, tags)

## Discovering Available Fields

Each resource type has a `fields` endpoint that returns every available field schema — system fields and custom fields — for the org. Use these before building filters or `--fields` args:

```bash
torii apps fields       # 149 fields: systemKey, name, type, options[]
torii users fields      # 68 fields
torii contracts fields  # 39 fields
```

Each field entry has:
- `systemKey` — the API key to use in `--fields`, `--filter`, and API filter params (e.g. `primaryOwner`, `state`, `c_appType_1`)
- `name` — human-readable label shown in the Torii UI
- `type` — `dropdown`, `singleLine`, `multiLine`, `usersDropdown`, `datePicker`, `currency`, `number`, `fileUpload`, `dropdownMulti`, `usersDropdownMulti`, `cardNumber`
- `options` — for `dropdown`/`dropdownMulti` types, the valid `value`/`label` pairs

Fields prefixed `c_` are custom/org-specific (not portable across orgs). System fields (`primaryOwner`, `state`, `category`, etc.) are standard.

### Using field keys

**`--fields` for output shaping** (dot-path supported):
```bash
torii apps list --fields "id,name,primaryOwner.email,state"
torii users list --fields "id,email,firstName,lastName"
```

**`--filter` for client-side filtering:**
```bash
torii apps list --filter "state=discovered"
torii contracts list --filter "status=active"
```

**API-side filters** (sent as URL-encoded JSON via `--api-filters`):
Use `systemKey` values as filter keys. Check `docs/appendix/known-quirks.md` for filter encoding requirements.

## Open Source Requirements

- Zero hardcoded org-specific values (`c_` prefixed custom fields are a platform feature — handle generically)
- API keys must never appear in logs, error messages, or solution files
- `solutions/` IS committed; `~/.torii-cli/config.json` is NOT
