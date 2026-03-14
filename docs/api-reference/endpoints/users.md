# Users API

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## GET /users — List users

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /users` |
| **Description** | List all users in the organization with optional filtering, sorting, and pagination. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated field names to return for each user. |
| `sort` | string | No | Field name to sort by. |
| `order` | string | No | Sort order: `asc` or `desc`. |
| `size` | integer | No | Page size (number of results per page). |
| `cursor` | string | No | Pagination cursor from the previous response's `nextCursor`. |
| `filters` | string | No | JSON array of filter objects. Each filter: `{ "key": "fieldName", "op": "equals|notEquals|contains|...", "value": "..." }`. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/users?size=50&sort=email&order=asc" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

With filters:

```bash
curl -X GET "https://api.toriihq.com/v1.0/users?filters=%5B%7B%22key%22%3A%22lifecycleStatus%22%2C%22op%22%3A%22equals%22%2C%22value%22%3A%22active%22%7D%5D&size=100" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema (Model13)

| Field | Type | Description |
|-------|------|-------------|
| `users` | User[] | Array of user objects. |
| `aggregations` | number | Aggregation value when aggregations are requested. |
| `count` | integer | Number of items in this response. |
| `total` | integer | Total number of items across all pages. |
| `nextCursor` | string | Cursor for the next page; omit or null when no more pages. |

### User Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique user identifier. |
| `idOrg` | number | Organization ID. |
| `firstName` | string | First name. |
| `lastName` | string | Last name. |
| `email` | string | Email address. |
| `creationTime` | string | Creation timestamp (ISO 8601). |
| `idRole` | number | Role ID. |
| `role` | string | Role name. |
| `lifecycleStatus` | string | Enum: `active`, `offboarding`, `offboarded`. |
| `isDeletedInIdentitySources` | boolean | Whether the user has left the organization in identity sources. |
| `isExternal` | boolean | Whether the user is external. |
| `activeAppsCount` | integer | Number of active applications. |
| `additionalEmails` | string[] | Additional email addresses. |

### Response Example

```json
{
  "users": [
    {
      "id": 1001,
      "idOrg": 10,
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "creationTime": "2024-01-15T10:30:00.000Z",
      "idRole": 2,
      "role": "Member",
      "lifecycleStatus": "active",
      "isDeletedInIdentitySources": false,
      "isExternal": false,
      "activeAppsCount": 12,
      "additionalEmails": []
    }
  ],
  "aggregations": 0,
  "count": 50,
  "total": 253,
  "nextCursor": "WzEwMDEsIjIwMjQtMDEtMTVUMTA6MzA6MDAuMDAwWiJd"
}
```

### Pagination

- **Supported:** Yes (cursor-based).
- Use `size` to control page size.
- Pass `nextCursor` from the response as the `cursor` query parameter for the next page.
- Continue until `nextCursor` is null or absent.

### Notes / Gotchas

- Supports aggregations when requested via query parameters.
- Filters use a JSON array; URL-encode when passing in query strings.
- Default sort/order may vary; specify explicitly for predictable results.

---

## GET /users/{idUser} — Get user

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /users/{idUser}` |
| **Description** | Retrieve a single user by ID. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idUser` | integer | Yes | Path parameter. Unique user identifier. |
| `fields` | string | No | Comma-separated field names to return. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/users/1001" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

Returns a single `User` object (see User Object Fields above).

### Response Example

```json
{
  "id": 1001,
  "idOrg": 10,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "creationTime": "2024-01-15T10:30:00.000Z",
  "idRole": 2,
  "role": "Member",
  "lifecycleStatus": "active",
  "isDeletedInIdentitySources": false,
  "isExternal": false,
  "activeAppsCount": 12,
  "additionalEmails": []
}
```

### Pagination

- **Supported:** No.

### Notes / Gotchas

- Returns 404 if the user does not exist.
- Use `fields` to limit returned fields and reduce payload size.

---

## PUT /users/{idUser} — Update user

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /users/{idUser}` |
| **Description** | Update a user. Only `lifecycleStatus` can be modified. Typically used for offboarding workflows. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idUser` | integer | Yes | Path parameter. Unique user identifier. |

### Request Body (EditableUser)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lifecycleStatus` | string | **Yes** | Enum: `active`, `offboarding`, `offboarded`. |

**Important:** Only `lifecycleStatus` can be updated. Other user fields are read-only.

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/users/1001" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lifecycleStatus": "offboarding"}'
```

### Response

Returns the updated user object (wrapped in `user` when applicable).

### Response Example

```json
{
  "user": {
    "id": 1001,
    "idOrg": 10,
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "creationTime": "2024-01-15T10:30:00.000Z",
    "idRole": 2,
    "role": "Member",
    "lifecycleStatus": "offboarding",
    "isDeletedInIdentitySources": false,
    "isExternal": false,
    "activeAppsCount": 12,
    "additionalEmails": []
  }
}
```

### Pagination

- **Supported:** No.

### Notes / Gotchas

- **Only `lifecycleStatus` is editable.** Use for offboarding workflows: `active` → `offboarding` → `offboarded`.
- Attempting to update other fields may be ignored or return an error.
- Ensure the API key has write permissions.
