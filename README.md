# torii-cli

<p align="center">
  <img src="assets/hero.png" alt="torii-cli" width="220" />
</p>

A command-line interface for the [Torii](https://www.toriihq.com/) SaaS Management Platform API. Manage users, applications, contracts, licenses, workflows, and compliance directly from your terminal or from AI agents.

> **Version 1.0 — Early Release**
> This is the initial public release. The core feature set is complete and tested against the Torii v1.0 API. Expect rapid iteration — new commands, output improvements, and bug fixes will land frequently in the coming days. Pin your version in production environments.

---

## Features

- **Full API coverage** — 16 command groups, 60+ commands across all Torii endpoints
- **Safety-first** — read-only mode by default; all write operations require explicit opt-in
- **10 output formats** — `json` (default), `jsonl`, `table`, `csv`, `tsv`, `yaml`, `raw`, `quiet`, `count`, `ids`
- **Dot-path field extraction** — `--fields "id,name,primaryOwner.email"` flattens nested objects
- **Client-side filter & sort** — `--filter "state=Sanctioned"` and `--sort-by "name:desc"`
- **Auto-pagination** — fetches all pages automatically; control with `--limit` and `--no-paginate`
- **Rate limit handling** — automatic backoff and retry on 429 responses
- **Self-healing knowledge base** — matches errors against `solutions/` and suggests known fixes
- **AI-agent ready** — structured JSON stdout, predictable exit codes, agent instruction files included

---

## Prerequisites

- **Node.js** 20.0.0 or higher
- **A Torii account** with API access ([generate your API key](https://app.toriihq.com/team/settings/apiAccess))

---

## Installation

```bash
npm install -g torii-cli
```

Or run without installing:

```bash
npx torii-cli config init
```

---

## Quick Start

```bash
# 1. Interactive setup — enter your API key, validates connection immediately
torii config init

# 2. Verify it works
torii org get

# 3. Start exploring
torii apps list --limit 10
torii users list --limit 5 -o table
torii contracts list --filter "status=active" -o table
```

---

## Safety Modes

torii-cli is **read-only by default**. Write operations are blocked unless you explicitly enable `full` mode.

| Mode | Allowed | How to set |
|------|---------|------------|
| `read-only` (default) | GET requests only | Default — no action needed |
| `full` | All methods | `torii config set mode full` or `TORII_MODE=full` |

Every write command also supports:
- `--dry-run` — prints the exact request (method, URL, body) without sending it
- `--yes` / `-y` — skips the confirmation prompt
- Confirmation prompt by default when neither flag is set

---

## Configuration

### Interactive setup (recommended)

```bash
torii config init
```

Prompts for your API key, validates it, and saves to `~/.torii-cli/config.json`.

### Manual setup

```bash
torii config set apiKey  YOUR_API_KEY
torii config set baseUrl https://api.toriihq.com/v1.0
torii config set mode    read-only
```

### Environment variables

```bash
export TORII_API_KEY="your-api-key"
export TORII_MODE="read-only"            # or "full"
export TORII_BASE_URL="https://api.toriihq.com/v1.0"
export TORII_SCIM_API_KEY="your-scim-key"  # SCIM commands only
```

### Per-command override

```bash
torii apps list --api-key YOUR_KEY --mode read-only
```

**Priority order:** CLI flag > environment variable > config file > default

Config is stored at `~/.torii-cli/config.json` — **never** committed to this repo.

---

## Output Formats

Use `-o <format>` on any command:

| Format | Description | Best for |
|--------|-------------|---------|
| `json` | Pretty-printed JSON **(default)** | `jq`, AI agents, scripting |
| `jsonl` | One JSON object per line | Streaming, log pipelines |
| `table` | ASCII table with column headers | Human reading in terminal |
| `csv` | Comma-separated with header | Excel, spreadsheet import |
| `tsv` | Tab-separated values | `cut`, `awk`, Unix tools |
| `yaml` | YAML output | Config files, readable diffs |
| `raw` | Unprocessed API response | Debugging |
| `quiet` | No output (exit code only) | Scripts that just need pass/fail |
| `count` | Integer count of results | Conditional scripting |
| `ids` | One ID per line | Shell loops |

### Output modifiers

```bash
# Select fields (dot-path for nested objects)
torii apps list --fields "id,name,primaryOwner.email,state"

# Client-side filter (case-insensitive)
torii apps list --filter "state=Sanctioned"
torii contracts list --filter "status=active"

# Client-side sort
torii apps list --sort-by "name"
torii contracts list --sort-by "amount:desc"

# Request only specific fields from the API (smaller payloads)
torii apps list --api-fields "id,name,state,primaryOwner"

# Suppress CSV/TSV header row
torii users list -o csv --no-header
```

---

## Command Reference

### `torii org`
```bash
torii org get                                      # Get your organization details
```

### `torii users`
```bash
torii users list                                   # List all users
torii users get <id>                               # Get user by ID
torii users update <id> --lifecycle-status inactive  # Update lifecycle status (full mode)
torii users fields                                 # List all available user fields
torii users metadata                               # User field metadata
torii users apps <id>                              # Apps a user has access to
```

### `torii apps`
```bash
torii apps list                                    # List all apps
torii apps get <id>                                # Get app by ID
torii apps search <query>                          # Search app catalog
torii apps users <id>                              # Users with access to an app
torii apps fields                                  # All app fields (system + custom)
torii apps metadata                                # App field metadata
torii apps add                                     # Add app to catalog (full mode)
torii apps create                                  # Create app record (full mode)
torii apps update <id>                             # Update app fields (full mode)
torii apps match                                   # Match app accounts to apps (full mode)
```

### `torii contracts`
```bash
torii contracts list                               # List all contracts
torii contracts get <id>                           # Get contract by ID
torii contracts create                             # Create a contract (full mode)
torii contracts update <id>                        # Update a contract (full mode)
torii contracts delete <id>                        # Delete a contract (full mode)
torii contracts fields                             # All available contract fields
torii contracts metadata                           # Contract field metadata
```

### `torii audit`
```bash
torii audit list                                   # Audit log entries
torii audit list --limit 100                       # Last 100 entries
```

### `torii roles`
```bash
torii roles list                                   # List all roles
```

### `torii user-apps`
```bash
torii user-apps get <userId> <appId>               # Get user-app relationship
torii user-apps update <userId> <appId>            # Update user-app relationship (full mode)
```

### `torii workflows`
```bash
torii workflows executions                         # Workflow execution log
torii workflows history                            # Workflow run history
torii workflows run <id>                           # Trigger a workflow (full mode)
torii workflows request-access                     # Request app access (full mode)
```

### `torii scim`
```bash
torii scim resource-types                          # SCIM resource types
torii scim schemas                                 # SCIM schemas
torii scim config                                  # Service provider config
torii scim users list                              # List SCIM-provisioned users
torii scim users get <id>                          # Get SCIM user
torii scim users create                            # Provision a user (full mode)
torii scim users update <id>                       # Replace user (full mode)
torii scim users patch <id>                        # Patch user attributes (full mode)
torii scim users delete <id>                       # Deprovision user (full mode)
```

### `torii files`
```bash
torii files upload-url                             # Get pre-signed upload URL
torii files get <id>                               # Get file metadata
torii files download <id>                          # Download a file
torii files store                                  # Store a file (full mode)
```

### `torii parsings`
```bash
torii parsings get <id>                            # Get a parsing result
torii parsings auto                                # Trigger automatic parsing (full mode)
torii parsings manual                              # Trigger manual parsing (full mode)
```

### `torii plugins`
```bash
torii plugins fields                               # List plugin fields
torii plugins create                               # Create a plugin (full mode)
torii plugins apikey <id>                          # Get plugin API key
torii plugins update <id>                          # Update a plugin (full mode)
torii plugins delete <id>                          # Delete a plugin (full mode)
```

### `torii gdpr`
```bash
torii gdpr anonymize <userId>                      # Anonymize user for GDPR (full mode)
```

### `torii integrations`
```bash
torii integrations sync-custom                     # Sync custom integration file (full mode)
torii integrations sync-gluu                       # Sync Gluu identity integration (full mode)
```

### `torii solutions`
```bash
torii solutions list                               # Browse all known solutions
torii solutions search <keyword>                   # Search by keyword, tag, or error code
torii solutions show <id>                          # View full solution detail
```

### `torii config`
```bash
torii config init                                  # Interactive setup wizard
torii config show                                  # Show config (API key masked)
torii config set <key> <value>                     # Set a config value
```

Valid config keys: `apiKey`, `baseUrl`, `mode`, `scimApiKey`

---

## Global Flags

| Flag | Description |
|------|-------------|
| `--api-key <key>` | Override API key for this command only |
| `--base-url <url>` | Override base URL for this command only |
| `--mode <mode>` | Override mode for this command only |
| `-v, --verbose` | Show HTTP request and response details |
| `-q, --quiet` | Suppress all non-data output |

---

## Discovering Available Fields

Every Torii org has a different set of custom fields. Use the `fields` commands to see what's available before writing queries or filters:

```bash
torii apps fields       # Returns every app field: systemKey, name, type, options
torii users fields      # User fields
torii contracts fields  # Contract fields
```

The `systemKey` is what you pass to `--fields`, `--filter`, and `--api-fields`:

```bash
# Output only the fields you need
torii apps list --fields "id,name,state,primaryOwner.email"

# Filter by a field value
torii apps list --filter "state=Sanctioned"

# Request fewer fields from the API (faster, smaller payloads)
torii apps list --api-fields "id,name,state,primaryOwner"
```

Fields prefixed `c_` are custom fields specific to your org and will vary between tenants.

---

## Self-Healing Knowledge Base

The `solutions/` directory contains documented fixes for known API quirks and errors. The CLI automatically searches it on every error:

```
Error: 422 on /users/123/apps

KNOWN SOLUTION (api-quirks/001):
The /users/{id}/apps endpoint does not support --api-fields.
Remove --api-fields from this command.
```

```bash
torii solutions list                  # Browse all documented solutions
torii solutions search "422"          # Search by error code or keyword
torii solutions show 001              # Full solution detail
```

Unsolved errors are automatically logged to `solutions/unsolved/` with full context (endpoint, params, status, response body, timestamp) for later documentation.

---

## AI Agent Compatibility

Instruction files for major AI coding agents are included in the repo root:

| Agent | File | Auto-loaded |
|-------|------|:-----------:|
| Claude Code | `CLAUDE.md` | ✅ |
| Cursor | `.cursorrules` | ✅ |
| GitHub Copilot | `.github/copilot-instructions.md` | ✅ |
| Codex / OpenAI Codex | `AGENTS.md` | ✅ |
| Aider | `AGENTS.md` | `--read AGENTS.md` |
| Cline / Continue / Warp | `AGENTS.md` | add to context |

---

## Project Structure

```
torii-cli/
├── src/
│   ├── index.ts          # CLI entry point, global flags, command registration
│   ├── client.ts         # Axios wrapper: auth, retry, rate limiting
│   ├── config.ts         # Config load/save, priority merging
│   ├── commands/         # One file per resource group (org, users, apps, ...)
│   └── utils/
│       ├── output.ts     # 10-format output engine, field extraction, filter, sort
│       ├── pagination.ts # Cursor + SCIM offset pagination
│       ├── safety.ts     # Write gating: mode check, dry-run, confirmation
│       └── solutions.ts  # Runtime error matching + unsolved logging
├── solutions/            # Self-healing knowledge base (committed to git)
├── docs/                 # Full Torii API reference docs
├── CLAUDE.md             # Instructions for Claude Code
├── AGENTS.md             # Instructions for all other AI agents
└── CONTRIBUTING.md       # Development setup and contribution guide
```

---

## Contributing

```bash
git clone https://github.com/markes76/torii-cli
cd torii-cli
npm install
npm run build
node dist/index.js config init
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for coding guidelines, how to add solutions, and PR process.

---

## License

[MIT](LICENSE)
