# Authentication Strategy

## Overview

The Torii CLI authenticates to the Torii API using API keys. Keys can be provided via environment variables, flags, or a config file. A separate key is required for SCIM endpoints.

---

## Key Sources (Priority Order)

| Priority | Source | Description |
|----------|--------|-------------|
| 1 | `--api-key` flag | Overrides all other sources |
| 2 | `TORII_API_KEY` env var | Primary source for most use cases |
| 3 | Config file | `~/.torii/config.json` or `.torii.json` in project root |

---

## Config File

**Locations (checked in order):**

1. `./.torii.json` (current directory / project root)
2. `~/.torii/config.json` (user home)

**Format:**

```json
{
  "apiKey": "pk_xxxxxxxxxxxxxxxxxxxxxxxx",
  "baseUrl": "https://api.toriihq.com/v1.0",
  "defaultOutput": "json",
  "scimApiKey": "pk_scim_xxxxxxxxxxxxxxxx"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `apiKey` | Yes | Main Torii API key |
| `baseUrl` | No | Override base URL (default: https://api.toriihq.com/v1.0) |
| `defaultOutput` | No | `json`, `table`, or `csv` |
| `scimApiKey` | No | SCIM-specific key (for `torii scim *` commands) |

---

## SCIM Authentication

SCIM endpoints require a **separate API key** enabled on the Torii Security page. Standard Torii API keys do not work for SCIM.

| Source | Variable / Config | Description |
|--------|-------------------|-------------|
| Environment | `TORII_SCIM_API_KEY` | SCIM API key |
| Flag | `--scim-api-key` | Overrides env var |
| Config | `scimApiKey` | From config file |

When running `torii scim *` commands, the CLI uses the SCIM key. If none is configured, show:

```
Error: SCIM commands require TORII_SCIM_API_KEY or --scim-api-key. Enable a SCIM key in Torii Settings → Security.
```

---

## Key Validation on Startup

**Optional:** Before the first API call, validate the key with a quick request:

```
GET /orgs/my
```

- **200:** Key is valid; proceed
- **401:** Key is invalid or expired; show: "Error: Invalid API key. Check TORII_API_KEY or --api-key."
- **403:** Key may be valid but lacks permission; could still proceed for read commands

**Recommendation:** Validate on first use (lazy validation) rather than every invocation, to avoid extra latency for simple commands.

---

## Secure Storage Recommendations

- **Do not** commit API keys to version control
- **Do not** log or print API keys (mask in `--verbose` output)
- Prefer `TORII_API_KEY` env var over config file for CI/CD
- Config file should have restricted permissions: `chmod 600 ~/.torii/config.json`
- Document in README: "Add `~/.torii/` to `.gitignore` if storing keys in project-local config"

---

## Base URL Override

| Source | Description |
|--------|-------------|
| `--base-url` flag | Override for single command |
| Config `baseUrl` | Default override |
| Default | `https://api.toriihq.com/v1.0` |

Use case: staging or custom deployments.
