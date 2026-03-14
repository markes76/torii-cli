# Pagination Strategy

## Overview

The Torii API uses **cursor-based pagination** for list endpoints. The CLI provides flags to control page size, resume from a cursor, and optionally fetch all pages automatically.

---

## Cursor-Based Pagination

Torii list endpoints return:

- `count` — number of items in the current page
- `total` — total items across all pages (when available)
- `nextCursor` — opaque cursor for the next page; `null` or absent when no more pages

To fetch the next page, pass `nextCursor` as the `cursor` query parameter.

---

## CLI Pagination Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--size N` | Page size (number of items per request) | API default (often 50–100) |
| `--cursor <value>` | Resume from a specific cursor | None (start from first page) |
| `--all` | Auto-paginate through all results | Off (return first page only) |

---

## Default Behavior

**Without `--all`:** Return only the first page.

```bash
torii users list
# Returns first page (e.g., 50 users)
# Displays nextCursor in output when more pages exist
```

---

## Auto-Pagination with --all

**With `--all`:** Automatically request subsequent pages until `nextCursor` is null.

```bash
torii users list --all
# Fetches all users across all pages
```

**Progress indication:**

- In verbose mode (`-v`): Log each page request
- Optional: Show "Fetching page N..." or a progress indicator
- For large datasets: Consider a spinner or "Retrieved N items so far..."

---

## Resuming with --cursor

Use `--cursor` to resume from a specific point (e.g., after a previous run):

```bash
# First run
torii users list --size 100 -o json > page1.json

# Extract nextCursor from page1.json, then:
torii users list --size 100 --cursor "WzEwMDEsIjIwMjQtMDEtMTVUMTA6MzA6MDAuMDAwWiJd"
```

---

## Memory Considerations

| Scenario | Recommendation |
|----------|----------------|
| Small datasets (< 1000 items) | In-memory aggregation is fine |
| Large datasets (10k+ items) | Consider streaming or chunked processing |
| `--all` with 50k users | Warn or cap; avoid loading everything into memory at once |

**Options:**

1. **Streaming output:** Emit each page as it arrives (e.g., NDJSON for `--all`)
2. **Configurable cap:** `--all --max-items 10000` to limit auto-pagination
3. **Document limits:** Recommend `--size` + `--cursor` for very large exports

---

## Streaming Output Option

For large `--all` runs, support streaming:

```bash
torii users list --all --output json-stream
# Emits one JSON object per line (NDJSON) as pages are fetched
# Enables: torii users list --all -o json-stream | jq -c '.users[]'
```

---

## Paginated Endpoints

| Endpoint | Supports Pagination |
|----------|---------------------|
| GET /users | Yes |
| GET /apps | Yes |
| GET /apps/{idApp}/users | Yes |
| GET /contracts | Yes |
| GET /audit | Yes |
| GET /workflows/actionExecutions | Yes |
| GET /workflows/audit | Yes |
| GET /scim/v2/Users | Yes (startIndex/count) |

**Note:** SCIM uses `startIndex` and `count`; the CLI may need to translate `--size` and `--cursor` to SCIM parameters or handle SCIM pagination separately.
