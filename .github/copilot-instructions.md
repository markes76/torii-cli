# Torii CLI — Build Instructions

## Section 0: BEFORE YOU BUILD ANYTHING — Study This Project

**This instruction file is your starting point, NOT your source of truth.**

This file was written before any agent touched this project. It contains architecture
decisions, safety rules, and build order. But it was written by a human summarizing
what they EXPECTED the docs to contain. The actual docs in `docs/` were scraped
directly from Torii's API documentation and OpenAPI spec. They may contain endpoints,
parameters, schemas, behaviors, and edge cases that this file doesn't mention.

Before writing a single line of code, you MUST:

1. **Read the entire `docs/` directory tree.** List all files and understand the full
   scope of what was pulled. There may be files you don't expect.
2. **Read `docs/api-reference/endpoints/` cover to cover.** Every endpoint file contains
   params, response schemas, request bodies, and gotchas that this instruction file
   only summarizes. If an endpoint exists in docs/ but isn't mentioned here, build it anyway.
3. **Read `docs/appendix/valid-params-per-endpoint.md` and `docs/appendix/known-quirks.md`.**
   These two files prevent the most common bugs. They contain hard-won knowledge from
   real production usage that may NOT be in the OpenAPI spec.
4. **Read `docs/api-reference/schemas/`** to understand every entity model before defining
   TypeScript types. The schemas in docs/ are the authoritative source for type definitions.
5. **If anything in this instruction file conflicts with what you find in `docs/`, the
   `docs/` directory wins.** Always. No exceptions.
6. **Read `docs/cli-planning/command-map.md`** to see the proposed command structure. You
   may discover endpoints or commands not mentioned here. Build them anyway.
7. **Read `docs/raw/` if structured docs seem incomplete.** The raw scraped pages from
   Torii's developer site are preserved there.
8. **After your initial read-through, create a brief `DISCOVERY.md` in the project root**
   listing anything you found in `docs/` that this instruction file didn't cover. This
   helps the maintainer know what gaps existed in the original instructions.

The goal: by the time you start coding, you should understand the Torii API better than
this file describes it. This file tells you HOW to build. `docs/` tells you WHAT to build.

---

## Section 1: Project Overview

- This is `torii-cli`, a CLI tool wrapping the Torii SaaS Management API.
- Purpose: Give AI agents and humans structured, safe access to Torii for SaaS management
  tasks including user management, app tracking, contract management, license optimization,
  compliance, offboarding, and shadow IT discovery.
- The full API documentation lives in `docs/`. Read it before building anything.
- The CLI is designed to be used by IT admins, BizOps teams, SaaS managers, and AI agents
  (Claude Code, Cursor, Codex, etc.).
- Base URL: `https://api.toriihq.com/v1.0`
- The API uses REST semantics, JSON encoding, and standard HTTP status codes.
- Both proprietary REST endpoints and SCIM 2.0 provisioning endpoints are supported.

---

## Section 2: Architecture

- **Language:** TypeScript (Node.js 20+).
- **CLI framework:** Commander.js.
- **Installable globally** via npm: `npm install -g torii-cli`, runnable as `torii <command>`.
- **Module format:** ESM.

### Codebase structure

```
src/
├── index.ts              # Entry point, CLI setup, Commander program definition
├── config.ts             # Config loading (API key, base URL, mode) from file/env/flags
├── client.ts             # HTTP client wrapper (auth headers, rate limits, pagination, retries)
├── commands/
│   ├── org.ts            # torii org get
│   ├── users.ts          # torii users list|get|update|metadata|fields
│   ├── apps.ts           # torii apps list|get|search|add|create|update|match|users|fields
│   ├── contracts.ts      # torii contracts list|get|create|update|delete|fields|metadata
│   ├── user-apps.ts      # torii users apps list|get|update
│   ├── audit.ts          # torii audit list
│   ├── roles.ts          # torii roles list
│   ├── workflows.ts      # torii workflows executions|history|run|request-access
│   ├── scim.ts           # torii scim resource-types|schemas|config|users (list|get|create|update|patch|delete)
│   ├── files.ts          # torii files upload-url|get|download|store|upload
│   ├── parsings.ts       # torii parsings get|auto|manual
│   ├── plugins.ts        # torii plugins fields|create|apikey|update|delete
│   ├── gdpr.ts           # torii gdpr anonymize
│   ├── integrations.ts   # torii integrations sync-custom|sync-gluu
│   └── solutions.ts      # torii solutions list|search|show
├── utils/
│   ├── pagination.ts     # Cursor-based pagination helper (auto-paginate, --limit, --no-paginate)
│   ├── output.ts         # Output formatting: JSON (default), table, CSV, --fields, --raw
│   ├── rate-limit.ts     # Rate limit detection (429), exponential backoff, Retry-After header
│   ├── safety.ts         # Write operation gating: mode check, confirmation prompts, --dry-run
│   └── solutions.ts      # Solutions knowledge base engine: read INDEX.md, search, log unsolved
└── types/
    └── index.ts          # TypeScript interfaces for all Torii entities (User, App, Contract, etc.)
```

### Key architectural decisions

- **Every command file** registers its subcommands with Commander and imports the shared
  HTTP client from `client.ts`.
- **The HTTP client** (`client.ts`) handles: Authorization header injection, X-API-VERSION
  header where needed, automatic pagination (cursor-based), rate limit detection with
  backoff, and retry logic for 5xx errors.
- **The safety gate** (`utils/safety.ts`) is called by every write command before making
  the HTTP request. It checks the mode, prompts for confirmation, and handles `--dry-run`.
- **Output formatting** (`utils/output.ts`) is the last step in every command. It takes
  raw API response data and formats it as JSON, table, or CSV based on flags.

---

## Section 3: Configuration & Authentication

### First-run onboarding

On first run (when no config exists), the CLI MUST prompt the user interactively:

1. Prompt: "Enter your Torii API key:"
2. Prompt: "Base URL (press Enter for default https://api.toriihq.com/v1.0):"
3. Validate the key by calling `GET /orgs/my`
4. On success: display the org name, confirm setup, save config
5. On failure: display a clear error and exit

### Config file

Store config in `~/.torii-cli/config.json`:

```json
{
  "apiKey": "user-provided-key",
  "baseUrl": "https://api.toriihq.com/v1.0",
  "mode": "read-only"
}
```

### Environment variables (override config file)

| Variable | Description | Default |
|----------|-------------|---------|
| `TORII_API_KEY` | API key | (none — required) |
| `TORII_BASE_URL` | Base URL override | `https://api.toriihq.com/v1.0` |
| `TORII_MODE` | `read-only` or `full` | `read-only` |

### Priority order

CLI flag > environment variable > config file > default value.

### Config commands

- `torii config show` — display current config (mask API key)
- `torii config set <key> <value>` — update a config value
- `torii config init` — re-run onboarding flow

---

## Section 4: Safety Rules (READ THIS CAREFULLY)

### Default mode is `read-only`

Only GET requests are allowed unless the operator explicitly sets mode to `full`.

### Write operation gating (every write command must do this)

1. **Check mode.** If mode is `read-only`:
   - Print: `Error: This operation requires full access mode. Your current mode is read-only.`
   - Print: `To enable write operations: torii config set mode full`
   - Print: `Or set environment variable: TORII_MODE=full`
   - Exit with code 1. Do NOT send the request.

2. **If mode is `full`:** Show a confirmation prompt before executing:
   ```
   You are about to [describe operation] on [resource].
   This will modify data in your production Torii environment.
   Proceed? [y/N]
   ```
   - If user answers `y` or `Y`: proceed
   - If user answers anything else or presses Enter: abort
   - The `--yes` or `--force` flag skips this prompt

3. **`--dry-run` flag (ALL write commands must support this):**
   - Build the full HTTP request (method, URL, headers, body)
   - Print it to stdout in a readable format
   - Exit WITHOUT sending the request
   - Works regardless of mode setting

### Safety gate implementation

The safety gate logic lives in `src/utils/safety.ts`. Every write command calls
`checkWritePermission()` before making the HTTP request. The function signature:

```typescript
async function checkWritePermission(options: {
  operation: string;        // e.g., "update user 12345"
  method: string;           // HTTP method
  url: string;              // Full URL
  body?: unknown;           // Request body
  dryRun: boolean;          // --dry-run flag
  force: boolean;           // --yes/--force flag
}): Promise<boolean>;       // true = proceed, false = abort
```

### Rules for AI agents building/testing this CLI

- **During development and testing: you MUST only use GET commands.**
- Do NOT test write operations against the live API. Use `--dry-run` to verify write logic.
- This is a production environment. Accidental updates or deletions are not recoverable.
- This applies regardless of which agent you are (Claude Code, Cursor, Codex, Gemini,
  Aider, Cline, or anything else).

---

## Section 5: Build Instructions

### Pre-build checklist

- [ ] Read `docs/api-reference/endpoints/` — every endpoint file
- [ ] Read `docs/appendix/valid-params-per-endpoint.md` — prevents 422 errors
- [ ] Read `docs/appendix/known-quirks.md` — API behaviors not obvious from spec
- [ ] Read `docs/api-reference/schemas/` — entity models for TypeScript types
- [ ] Read `docs/cli-planning/command-map.md` — proposed command structure with flags

### Build order

Build in this order. Each step should be testable before moving to the next.

**Phase 1: Foundation**
1. `src/config.ts` — config loading, first-run onboarding
2. `src/client.ts` — HTTP client with auth header, basic error handling
3. `src/types/index.ts` — TypeScript interfaces from `docs/api-reference/schemas/`
4. `src/utils/output.ts` — JSON, table, CSV output formatting
5. `src/utils/safety.ts` — write operation gating logic
6. `src/utils/pagination.ts` — cursor-based pagination helper
7. `src/utils/rate-limit.ts` — rate limit detection and backoff
8. `src/index.ts` — Commander setup, global flags, command registration

**Phase 2: Core read commands (test each against live API)**
1. `torii org get` — validates connection, simplest command
2. `torii users list` — tests pagination, filtering, output formatting
3. `torii users get <id>` — tests path params and field selection
4. `torii apps list` — tests aggregations support
5. `torii apps get <id>` — tests complex nested response (licenses, primaryOwner)
6. `torii apps search <name>` — tests simple query param
7. `torii contracts list` / `torii contracts get <id>`
8. `torii users apps <userId>` — tests relationship endpoints
9. `torii roles list` — simple list, no pagination
10. `torii audit list` — tests pagination-only endpoint

**Phase 3: Remaining read commands**
- Build all remaining GET-based commands from the command map
- `torii apps users <appId>`, field/metadata endpoints, SCIM reads, workflows reads,
  files reads, parsings reads, plugins reads

**Phase 4: Write commands (test with --dry-run ONLY)**
- Build all POST/PUT/PATCH/DELETE commands with safety gates
- Every write command must: check mode, prompt for confirmation, support --dry-run
- Test exclusively with `--dry-run`. Never send actual write requests during development.

**Phase 5: Solutions knowledge base CLI**
- `torii solutions list` / `search` / `show`
- Runtime error matching from `solutions/INDEX.md`

**Phase 6: Polish**
- Unit tests (safety gate, pagination, output formatting)
- Integration tests (GET-only against live API)
- Error message refinement
- Help text for every command

---

## Section 6: Output Formatting

| Flag | Output | Description |
|------|--------|-------------|
| (default) | JSON | Pretty-printed JSON. Default when stdout is a pipe. |
| `--format table` | Table | Human-readable table. Default when stdout is a TTY. |
| `--format csv` | CSV | Comma-separated values for spreadsheet/pipe usage. |
| `--fields` | (any) | Comma-separated list of fields to include in output. |
| `--raw` | JSON | Unprocessed API response (no formatting, no field filtering). |
| `--no-header` | CSV | Omit the header row in CSV output. |

### Implementation notes

- JSON output should be valid JSON that can be piped to `jq`.
- Table output should use `cli-table3` or similar for alignment.
- CSV output should properly escape fields containing commas or quotes.
- `--fields` filters the output AFTER receiving the full API response. It does not
  modify the API request (the `fields` query param does that separately).
- When outputting paginated results with `--format table`, show a progress indicator
  while fetching additional pages.

---

## Section 7: Pagination

Torii uses cursor-based pagination. See `docs/api-reference/pagination.md` for full details.

### Parameters

| Param | Description |
|-------|-------------|
| `size` | Number of results per page (sent to API) |
| `cursor` | Opaque cursor string from `nextCursor` in previous response |

### CLI behavior

| Flag | Behavior |
|------|----------|
| (default) | Auto-paginate: fetch ALL pages, merge results, return combined output |
| `--limit N` | Fetch pages until N total results are accumulated, then stop |
| `--no-paginate` | Fetch only the first page |
| `--size N` | Set the per-page size sent to the API |
| `--cursor X` | Start from a specific cursor (for manual pagination) |

### Implementation

```typescript
async function* paginate<T>(endpoint: string, params: Record<string, string>): AsyncGenerator<T[]> {
  let cursor: string | undefined;
  do {
    const response = await client.get(endpoint, { ...params, cursor });
    yield response.data[resourceKey]; // e.g., response.data.users
    cursor = response.data.nextCursor;
  } while (cursor);
}
```

### SCIM pagination is different

SCIM uses `startIndex`/`itemsPerPage`/`totalResults` instead of `cursor`/`nextCursor`.
The pagination helper must handle both patterns and normalize the interface for callers.

---

## Section 8: Error Handling

See `docs/api-reference/error-codes.md` for the full reference.

### Error response format

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Missing required query parameter 'state'"
}
```

### HTTP status handling

| Status | Behavior |
|--------|----------|
| 200/201 | Success. Return data. |
| 400 | Print error message. Show which params were sent. |
| 401 | `Authentication failed. Check your API key with 'torii config show'.` |
| 403 | `Access denied. Your API key may not have permission for this operation.` |
| 404 | `Resource not found. Verify the ID exists.` |
| 422 | `Invalid request parameters.` Print which params were sent. Check `docs/appendix/valid-params-per-endpoint.md`. |
| 429 | Auto-retry with exponential backoff. Read `Retry-After` header. Max 3 retries. |
| 5xx | Retry once after 2 seconds. On second failure, show error and exit. |

### Solutions integration

Before displaying ANY error to the user:
1. Search `solutions/INDEX.md` for a matching solution (by error code, endpoint, or tags)
2. If found: display both the error AND the known solution
3. If not found: display the error, then auto-log to `solutions/unsolved/` with full context

---

## Section 9: Testing

### Unit tests

Write unit tests for:
- `safety.ts` — mode checking, confirmation flow, dry-run output
- `pagination.ts` — cursor iteration, limit enforcement, SCIM normalization
- `output.ts` — JSON, table, CSV formatting, field filtering
- `rate-limit.ts` — backoff calculation, retry logic
- `config.ts` — priority order (flag > env > file > default)

### Integration tests (GET-only)

- Test against the live API using ONLY GET endpoints
- Verify: authentication works, pagination returns all results, field filtering works,
  output formats are correct, rate limit headers are parsed
- Do NOT make POST/PUT/PATCH/DELETE requests in integration tests

### Write command tests (--dry-run only)

- Verify that write commands in `read-only` mode print the error and exit
- Verify that `--dry-run` prints the request without sending it
- Verify that confirmation prompts work correctly
- Do NOT send actual write requests to the production API

### Test framework

Use **Vitest**. Configure in `vitest.config.ts`.

---

## Section 10: Self-Learning Knowledge Base

This is a core architectural feature, not a nice-to-have. The CLI learns from its own
failures, documents solutions, and references them automatically when the same problem
occurs again.

### Directory structure (committed to git)

```
solutions/
├── INDEX.md                           # Auto-maintained index of all known solutions
├── api-quirks/                        # Unexpected API behaviors
├── error-resolutions/                 # Specific error codes and their fixes
├── workarounds/                       # Known issues with temporary solutions
├── patterns/                          # Successful patterns worth reusing
└── unsolved/                          # Problems encountered but not yet resolved
```

### Solution file template

Every solution file MUST follow this format:

```markdown
# [Short descriptive title]

## Problem
[What happened. Include the exact error message, HTTP status, endpoint, and params.]

## Root Cause
[Why it happened. Be specific.]

## Solution
[What fixed it. Include code snippets or config changes.]

## Prevention
[How to avoid hitting this again. Include any validation rules to add.]

## Metadata
- Date discovered: [ISO date]
- Endpoint: [API path]
- Error code: [HTTP status if applicable]
- Severity: [low|medium|high|critical]
- Tags: [comma-separated: e.g., pagination, rate-limit, params, auth]
```

### INDEX.md format

```markdown
# Torii CLI — Known Solutions Index

| ID | Title | Category | Severity | Tags |
|----|-------|----------|----------|------|
| 001 | [title] | api-quirks | medium | params, user-apps |
```

### Self-healing runtime loop

1. **On error:** Before showing the error, search `solutions/INDEX.md` for a match
   by error code, endpoint, or tags.
2. **If match found:** Show the original error AND the known solution:
   ```
   ERROR: 422 Unprocessable Entity on GET /users/123/apps?fields=name

   KNOWN SOLUTION (api-quirks/001):
   The /users/{id}/apps endpoint does not support the "fields" parameter.
   Remove the --fields flag for this command.
   ```
3. **If no match:** Show the error, then auto-log to `solutions/unsolved/` with full
   context (endpoint, params, status code, response body, timestamp).

### CLI commands for the knowledge base

- `torii solutions list` — display all known solutions from INDEX.md
- `torii solutions search <keyword>` — search by tags and content
- `torii solutions show <id>` — display a specific solution in full

### Rules for AI agents building this CLI

1. When you hit ANY error, document it immediately in `solutions/`.
2. Create the solution file BEFORE moving on to the next task.
3. Update `solutions/INDEX.md` every time you add a new solution.
4. When you fix something from `unsolved/`, move it to the right category.
5. When you discover API behavior not in `docs/`, add a solution file AND update
   `docs/appendix/known-quirks.md`.
6. Your solutions persist across agents, sessions, and contributors. The next AI agent
   that works on this project inherits everything you learned.

---

## Section 11: Open Source Readiness

This project will be published as an open-source tool on GitHub.

### Requirements

1. **Zero hardcoded org-specific values.** No company-specific logic, custom field names,
   or internal URLs anywhere in the codebase. Custom `c_` prefixed fields are a Torii
   platform feature all orgs can use — handle them generically.

2. **First-run onboarding flow.** See Section 3.

3. **README.md is public-facing.** Written for someone who's never heard of this project.

4. **CONTRIBUTING.md exists** with dev setup, how to add commands, how to add solutions,
   testing rules, and PR expectations.

5. **LICENSE is MIT.**

6. **GitHub templates exist** for bug reports, feature requests, and pull requests.

7. **No secrets in the repo. Ever.**
   - `.env` is gitignored
   - `~/.torii-cli/config.json` is never committed
   - `solutions/` IS committed (helps all users)
   - API keys must never appear in logs, error messages, or solution files

---

## Quick Reference: Key File Paths

| What | Where |
|------|-------|
| Full API docs | `docs/api-reference/endpoints/` |
| Entity schemas | `docs/api-reference/schemas/` |
| Command map | `docs/cli-planning/command-map.md` |
| Valid params | `docs/appendix/valid-params-per-endpoint.md` |
| Known quirks | `docs/appendix/known-quirks.md` |
| Auth guide | `docs/api-reference/authentication.md` |
| Pagination | `docs/api-reference/pagination.md` |
| Rate limits | `docs/api-reference/rate-limits.md` |
| Error codes | `docs/api-reference/error-codes.md` |
| Write ops reference | `docs/cli-planning/write-operations.md` |
| Filters guide | `docs/raw/guides/filters-detailed.md` |
| Aggregations guide | `docs/raw/guides/aggregations-detailed.md` |
| OpenAPI spec | `docs/raw/openapi-spec.json` |
| Solutions knowledge base | `solutions/` |
