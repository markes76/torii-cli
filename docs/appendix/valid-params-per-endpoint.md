# Valid Parameters per Endpoint

**CRITICAL:** Invalid query parameters cause `422 Unprocessable Entity` errors. Use this reference to ensure only supported parameters are sent.

---

## List Endpoints

| Endpoint | fields | sort | order | size | cursor | filters | aggs |
|----------|:------:|:----:|:-----:|:----:|:------:|:-------:|:----:|
| GET /apps | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /users | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /contracts | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? |
| GET /audit | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ |
| GET /apps/{id}/users | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| GET /users/{id}/apps | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| GET /scim/v2/Users | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| GET /workflows/actionExecutions | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ |
| GET /workflows/audit | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ |

**Notes:**

- `?` = Support unclear or endpoint-specific; verify before use
- SCIM uses `startIndex` and `count` (not `size`/`cursor`)
- GET /users/{id}/apps does not support pagination params

---

## Get-by-ID Endpoints

| Endpoint | fields |
|----------|:------:|
| GET /apps/{idApp} | ✓ |
| GET /users/{idUser} | ✓ |
| GET /contracts/{idContract} | ✓ |
| GET /users/{idUser}/apps/{idApp} | ✓ |
| GET /scim/v2/Users/{id} | ✗ |
| GET /files/{id} | ✗ |
| GET /parsings/{id} | ✗ |
| GET /workflows/{id} | ✗ |

---

## Endpoints with No Query Parameters

These endpoints accept no query params. Sending any will cause errors.

### Organization & Roles

- GET /orgs/my
- GET /roles

### Metadata & Fields

- GET /apps/fields
- GET /apps/metadata
- GET /users/fields
- GET /users/metadata
- GET /contracts/fields
- GET /contracts/metadata

### Search

- GET /apps/search — **only** accepts `name` (required)

### SCIM Discovery

- GET /scim/v2/ResourceTypes
- GET /scim/v2/Schemas
- GET /scim/v2/ServiceProviderConfig

---

## Special Cases

### GET /apps/search

| Parameter | Required | Description |
|-----------|----------|-------------|
| `name` | ✓ | Search term for app name |

### SCIM GET /scim/v2/Users

| Parameter | Description |
|-----------|-------------|
| `startIndex` | 1-based start index |
| `count` | Items per page |
| `filter` | SCIM filter expression (different syntax from REST filters) |

### Version Header

Some endpoints require or benefit from:

```
X-API-VERSION: 1.1
```

Examples: apps list with filters, aggregations. When in doubt, include this header for list endpoints that support `filters` or `aggs`.

---

## Parameter Reference

| Parameter | Type | Description |
|-----------|------|-------------|
| `fields` | string | Comma-separated field names to return |
| `sort` | string | Field name to sort by |
| `order` | string | `asc` or `desc` |
| `size` | number | Page size (max varies by endpoint) |
| `cursor` | string | Pagination cursor from previous response |
| `filters` | string | URL-encoded JSON array of filter objects |
| `aggs` | string | Aggregation configuration (JSON) |
