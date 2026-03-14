# Access Modes

## Overview

The Torii CLI supports two access modes: **read-only** and **full-access**. The mode is determined by the API key's scope, not by CLI configuration. The CLI provides optional client-side safety gates for users who want extra protection.

---

## Two Access Modes

### Read-Only Mode

- API key has read-only permissions
- All GET endpoints work
- POST, PUT, PATCH, DELETE endpoints return **403 Forbidden**
- Safe for reporting, auditing, and exploratory queries

### Full-Access Mode

- API key has read and write permissions
- All API operations are allowed
- Required for offboarding, contract management, SCIM provisioning, and other write operations

---

## Mode Determination

**Mode is determined by API key scope, not CLI configuration.**

The Torii API does not expose key scope information in responses. The CLI cannot know in advance whether a key is read-only or full-access. Scope is discovered implicitly when a write operation is attempted:

- **Success:** Key has full-access
- **403 Forbidden:** Key is read-only

---

## Handling 403 on Write Operations

When a write command is attempted with a read-only API key, the API returns `403 Forbidden`. The CLI should detect this and display:

```
Error: This operation requires a full-access API key. Your current key only has read permissions.
```

**Implementation notes:**

- Parse the HTTP status code and error response body
- If status is 403 and the operation was a write (POST/PUT/PATCH/DELETE), show the above message
- Optionally suggest: "Generate a full-access API key in Torii Settings → Security → API Access"

---

## Client-Side Safety Gate: TORII_API_MODE

For users who have a full-access key but want to prevent accidental writes, the CLI supports an optional environment variable:

| Variable | Values | Effect |
|----------|--------|--------|
| `TORII_API_MODE` | `readonly` | CLI blocks all write commands before making the request |
| `TORII_API_MODE` | `full` (default) | No client-side restriction; API key scope applies |

**Example:**

```bash
# Block writes even with full-access key
export TORII_API_MODE=readonly
torii users update 1001 --lifecycle-status offboarded
# Error: Write operations are disabled. Set TORII_API_MODE=full or unset it to allow writes.
```

**Use case:** CI/CD pipelines, shared workstations, or scripts where a full key is present but writes should never happen.

---

## Configuration

| Source | Variable / Flag | Description |
|--------|-----------------|-------------|
| Environment | `TORII_API_KEY` | Primary API key |
| Flag | `--api-key` | Overrides env var |
| Environment | `TORII_API_MODE` | Optional: `readonly` or `full` |

---

## Key Scope Detection (Limitations)

The Torii API does not provide an endpoint to query key scope. Options:

1. **Attempt a harmless read first:** `GET /orgs/my` validates the key works but does not reveal scope
2. **Document that scope is implicit:** Users must know their key type from Torii Settings
3. **Fail on first write:** If a write returns 403, show the clear error message above

**Recommendation:** Use option 3. No proactive scope check is possible; handle 403 gracefully and inform the user.
