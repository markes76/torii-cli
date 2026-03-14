# Torii CLI Documentation Corpus

## What This Is

Complete API documentation for building a CLI tool that wraps the Torii SaaS Management REST API. This corpus covers every endpoint, schema, authentication method, pagination pattern, error code, and operational quirk in the Torii API.

---

## Quick Links

- [Authentication](api-reference/authentication.md)
- [API Reference - Endpoints](api-reference/endpoints/)
- [CLI Command Map](cli-planning/command-map.md)
- [Known Quirks](appendix/known-quirks.md) ← **Read this first**
- [Valid Params per Endpoint](appendix/valid-params-per-endpoint.md)

---

## Directory Structure

```
docs/
├── README.md
├── api-reference/
│   ├── authentication.md
│   ├── pagination.md
│   ├── rate-limits.md
│   ├── error-codes.md
│   └── endpoints/
│       ├── org.md
│       ├── users.md
│       ├── apps.md
│       ├── contracts.md
│       ├── audit.md
│       ├── roles.md
│       ├── scim.md
│       ├── workflows.md
│       ├── files.md
│       ├── parsings.md
│       ├── plugins.md
│       ├── webhooks.md
│       ├── integrations.md
│       ├── user-app-relationships.md
│       └── gdpr.md
│   └── schemas/
│       ├── user.md
│       ├── app.md
│       ├── contract.md
│       ├── license.md
│       ├── workflow.md
│       └── common.md
├── cli-planning/
│   ├── command-map.md
│   ├── auth-strategy.md
│   ├── pagination-strategy.md
│   ├── output-formats.md
│   ├── access-modes.md
│   └── write-operations.md
├── appendix/
│   ├── field-reference.md
│   ├── custom-fields.md
│   ├── valid-params-per-endpoint.md
│   └── known-quirks.md
└── raw/
    ├── openapi-spec.json
    ├── reference-pages/
    └── guides/
```

| Directory | Description |
|-----------|-------------|
| `api-reference/` | Endpoint docs, schemas, auth, pagination, errors, rate limits |
| `cli-planning/` | CLI design, command mapping, auth strategy, output formats |
| `appendix/` | Field reference, custom fields, valid params, known quirks |
| `raw/` | Source artifacts: OpenAPI spec, crawled reference pages, guides |

---

## API Overview

| Property | Value |
|----------|-------|
| **Base URL** | `https://api.toriihq.com/v1.0` |
| **Auth** | Bearer token in `Authorization` header |
| **Format** | JSON |
| **Pagination** | Cursor-based (`size`, `cursor`, `nextCursor`) |
| **Endpoints** | 60 total: 34 READ, 26 WRITE |

---

## How to Use This Documentation

1. **Start with** [appendix/known-quirks.md](appendix/known-quirks.md) — saves hours of debugging
2. **Check** [appendix/valid-params-per-endpoint.md](appendix/valid-params-per-endpoint.md) — prevents 422 errors
3. **Use** [cli-planning/command-map.md](cli-planning/command-map.md) as your implementation checklist
4. **Reference** individual endpoint docs for parameter details and examples
5. **Check** [cli-planning/write-operations.md](cli-planning/write-operations.md) for request body schemas

---

## Sources

- **OpenAPI spec:** `raw/openapi-spec.json`
- **Crawled reference pages:** `raw/reference-pages/`
- **Crawled guide pages:** `raw/guides/`
- **Developer docs:** https://developers.toriihq.com/reference

---

## Coverage

- 60/60 endpoints documented
- All schemas documented
- All SCIM endpoints with equal depth
- Filters, aggregations, pagination patterns documented
- Write operations fully documented with request body schemas
