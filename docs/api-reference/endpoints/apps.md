# Apps API

## Overview

Apps represent SaaS applications tracked in Torii. The Apps API supports listing, searching, creating, updating, and managing app metadata and custom fields. All app-related endpoints use the base URL and require Bearer token authentication.

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## GET /apps — List apps

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /apps` |
| **Description** | List all apps in the organization with optional filtering, sorting, pagination, and aggregations. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated field names to return for each app. |
| `sort` | string | No | Field name to sort by. |
| `order` | string | No | Sort order: `asc` or `desc`. |
| `size` | integer | No | Page size (number of results per page). |
| `cursor` | string | No | Pagination cursor from the previous response's `nextCursor`. |
| `filters` | string | No | JSON array of filter objects. |
| `aggs` | string | No | Aggregation JSON for computing aggregations. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/apps?size=50&sort=name&order=asc" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `apps` | App[] | Array of app objects. |
| `aggregations` | number | Aggregation value when aggregations are requested. |
| `count` | integer | Number of items in this response. |
| `total` | integer | Total number of items across all pages. |
| `nextCursor` | string | Cursor for the next page; omit or null when no more pages. |

### App Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique app identifier. |
| `isHidden` | boolean | Whether the app is hidden. |
| `primaryOwner` | object | Primary owner. See PrimaryOwner below. |
| `name` | string | App name. |
| `state` | string | App state. |
| `url` | string | App URL. |
| `category` | string | App category. |
| `description` | string | App description. |
| `tags` | string | App tags. |
| `licenses` | LicenseSummary | License summary. See LicenseSummary below. |

### PrimaryOwner Object

| Field | Type | Description |
|-------|------|-------------|
| `firstName` | string | First name. |
| `lastName` | string | Last name. |
| `photoUrl` | string | Profile photo URL. |
| `lifecycleStatus` | string | Enum: `active`, `offboarding`, `offboarded`. |
| `fullName` | string | Full display name. |
| `isDeletedInIdentitySources` | boolean | Whether deleted in identity sources. |
| `id` | integer | User ID. |
| `email` | string | Email address. |
| `status` | string | Enum: `active`, `invited`, `reporting`, `deleted`. |

### LicenseSummary Object

| Field | Type | Description |
|-------|------|-------------|
| `summary` | object | Contains `totalAmount`, `activeAmount`, `inactiveAmount`, `unassignedAmount`, `pricePerLicense` (object: `value`, `currency`), `annualCost` (object: `value`, `currency`), `potentialSavings` (object: `value`, `currency`). |
| `types` | LicenseType[] | Array of license type objects. |

### Response Example

```json
{
  "apps": [
    {
      "id": 42,
      "isHidden": false,
      "primaryOwner": {
        "firstName": "Jane",
        "lastName": "Doe",
        "photoUrl": "https://...",
        "lifecycleStatus": "active",
        "fullName": "Jane Doe",
        "isDeletedInIdentitySources": false,
        "id": 1001,
        "email": "jane@example.com",
        "status": "active"
      },
      "name": "Slack",
      "state": "active",
      "url": "https://slack.com",
      "category": "Communication",
      "description": "Team messaging",
      "tags": "collaboration",
      "licenses": {
        "summary": {
          "totalAmount": 100,
          "activeAmount": 95,
          "inactiveAmount": 5,
          "unassignedAmount": 10,
          "pricePerLicense": { "value": 12.5, "currency": "USD" },
          "annualCost": { "value": 12000, "currency": "USD" },
          "potentialSavings": { "value": 500, "currency": "USD" }
        },
        "types": []
      }
    }
  ],
  "aggregations": 0,
  "count": 50,
  "total": 120,
  "nextCursor": "WzQyLCJTbGFjayJd"
}
```

### Pagination

- **Supported:** Yes (cursor-based).
- Use `size` to control page size.
- Pass `nextCursor` from the response as the `cursor` query parameter for the next page.

### Notes / Gotchas

- Supports aggregations when requested via `aggs` query parameter.
- Filters use a JSON array; URL-encode when passing in query strings.
- Use `fields` to limit returned fields and reduce payload size.

---

## POST /apps — Add app

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /apps` |
| **Description** | Add an app from the Torii catalog to the organization. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None (path/query). All data in request body.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `idApp` | integer | **Yes** | Torii catalog app ID to add. |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/apps" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"idApp": 42}'
```

### Response Example

```json
{
  "app": {
    "id": 42,
    "isHidden": false,
    "name": "Slack",
    "state": "active",
    "url": "https://slack.com",
    "category": "Communication",
    "description": "Team messaging",
    "tags": "collaboration"
  }
}
```

### Notes / Gotchas

- `idApp` must reference a valid app in the Torii catalog.
- Adding an app that already exists may return an error or be idempotent depending on API behavior.

---

## GET /apps/search — Search apps

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /apps/search` |
| **Description** | Search apps by name (typically against the Torii catalog). |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Yes** | Search query (app name). |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/apps/search?name=Slack" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Example

```json
{
  "apps": [
    {
      "id": 42,
      "name": "Slack",
      "category": "Communication",
      "imageUrl": "https://...",
      "url": "https://slack.com"
    }
  ]
}
```

### Notes / Gotchas

- `name` is required; omit or empty may return an error.
- Results may include catalog apps not yet added to the organization.

---

## GET /apps/{idApp} — Get app

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /apps/{idApp}` |
| **Description** | Retrieve a single app by ID. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idApp` | integer | **Yes** | Path parameter. Unique app identifier. |
| `fields` | string | No | Comma-separated field names to return. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/apps/42" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

Returns the full App object (see App Object Fields above).

### Response Example

```json
{
  "id": 42,
  "isHidden": false,
  "primaryOwner": { "firstName": "Jane", "lastName": "Doe", "id": 1001, "email": "jane@example.com", "lifecycleStatus": "active", "fullName": "Jane Doe", "isDeletedInIdentitySources": false, "photoUrl": "", "status": "active" },
  "name": "Slack",
  "state": "active",
  "url": "https://slack.com",
  "category": "Communication",
  "description": "Team messaging",
  "tags": "collaboration",
  "licenses": { "summary": {}, "types": [] }
}
```

### Notes / Gotchas

- Returns 404 if the app does not exist.
- Use `fields` to limit returned fields and reduce payload size.

---

## PUT /apps/{idApp} — Update app

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /apps/{idApp}` |
| **Description** | Update an existing app. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idApp` | integer | **Yes** | Path parameter. Unique app identifier. |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | integer | No | **DEPRECATED.** Primary owner user ID. |
| `isHidden` | boolean | No | Whether to hide the app. |
| `name` | string | No | App name. |
| `state` | string | No | App state. |
| `url` | string | No | App URL. |
| `category` | string | No | App category. |
| `description` | string | No | App description. |
| `tags` | string | No | App tags. |

All body fields are optional. Only include fields you want to update.

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/apps/42" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Slack Workspace", "isHidden": false}'
```

### Response Example

```json
{
  "app": {
    "id": 42,
    "isHidden": false,
    "name": "Slack Workspace",
    "state": "active",
    "url": "https://slack.com",
    "category": "Communication",
    "description": "Team messaging",
    "tags": "collaboration"
  }
}
```

### Notes / Gotchas

- `owner` is deprecated; avoid using it.
- Partial updates supported; omit fields to leave them unchanged.

---

## POST /apps/custom — Create app

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /apps/custom` |
| **Description** | Create a custom app (not from the Torii catalog). |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None (path/query). All data in request body.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | App name. |
| `state` | string | No | App state. |
| `url` | string | No | App URL. |
| `category` | string | No | App category. |
| `description` | string | No | App description. |
| `tags` | string | No | App tags. |

All fields are optional. At minimum, provide `name` for a useful custom app.

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/apps/custom" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Internal Tool", "url": "https://internal.example.com", "category": "Productivity"}'
```

### Response Example

```json
{
  "app": {
    "id": 999,
    "isHidden": false,
    "name": "Internal Tool",
    "state": "active",
    "url": "https://internal.example.com",
    "category": "Productivity",
    "description": "",
    "tags": ""
  }
}
```

### Notes / Gotchas

- Custom apps are organization-specific and do not come from the Torii catalog.
- Use this for shadow IT or uncatalogued apps.

---

## POST /apps/match — Match apps

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /apps/match` |
| **Description** | Match a list of app names against the Torii catalog. Returns matched apps with IDs. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None (path/query). All data in request body.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apps` | array | **Yes** | Array of objects. Each object must have `name` (string, required). |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/apps/match" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"apps": [{"name": "Slack"}, {"name": "Notion"}]}'
```

### Response Example

```json
{
  "apps": [
    {
      "idApp": 42,
      "name": "Slack",
      "url": "https://slack.com",
      "searchedBy": "Slack"
    },
    {
      "idApp": 88,
      "name": "Notion",
      "url": "https://notion.so",
      "searchedBy": "Notion"
    }
  ]
}
```

### Notes / Gotchas

- `name` is required for each entry in `apps`.
- Unmatched apps may be omitted or returned with null/empty `idApp` depending on API behavior.
- Use before `POST /apps` to resolve catalog IDs from names.

---

## App Fields Endpoints

### GET /apps/fields — List app fields

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /apps/fields` |
| **Description** | List custom and predefined app field definitions. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/apps/fields" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

Returns an array of app field definitions (structure varies by tenant configuration).

### Notes / Gotchas

- Fields define metadata that can be attached to apps (e.g., custom dropdowns, user assignments).

---

### POST /apps/fields — Create field

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /apps/fields` |
| **Description** | Create a new custom app field. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None (path/query). All data in request body.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Field name. |
| `formQuestion` | string | No | Question text for forms. |
| `type` | string | **Yes** | Enum: `multiLine`, `number`, `datePicker`, `dropdown`, `dropdownMulti`, `user`, `usersPersonal`. |
| `idGroup` | integer | No | Group ID for grouping fields. |
| `options` | array/object | No | Options for dropdown types. |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/apps/fields" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Business Unit", "type": "dropdown", "options": ["Engineering", "Sales", "Marketing"]}'
```

### Response

Returns the created field object.

### Notes / Gotchas

- `type` must be one of the supported enum values.
- For `dropdown` and `dropdownMulti`, provide `options` as appropriate.

---

### DELETE /apps/fields/{idField} — Delete field

| Property | Value |
|----------|-------|
| **Endpoint** | `DELETE /apps/fields/{idField}` |
| **Description** | Permanently delete a custom app field. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idField` | integer | **Yes** | Path parameter. Field identifier. |

### Request Example

```bash
curl -X DELETE "https://api.toriihq.com/v1.0/apps/fields/5" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

- **Success:** HTTP 200 (or 204) with no response body or minimal confirmation.
- **Error:** Standard error response if field is in use or does not exist.

### Notes / Gotchas

- Deletion may fail if the field is in use by apps.
- System/predefined fields may not be deletable.

---

### PUT /apps/fields/{idField} — Update field

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /apps/fields/{idField}` |
| **Description** | Update an existing app field. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idField` | integer | **Yes** | Path parameter. Field identifier. |

### Request Body

Same fields as `POST /apps/fields`: `name`, `formQuestion`, `type`, `idGroup`, `options`. All optional for update; only include fields to change.

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/apps/fields/5" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Business Unit (Updated)", "options": ["Engineering", "Sales", "Marketing", "Support"]}'
```

### Response

Returns the updated field object.

### Notes / Gotchas

- Changing `type` may require compatible `options` or cause data migration issues.
- System fields may have restricted updatability.

---

### GET /apps/metadata — List app fields metadata

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /apps/metadata` |
| **Description** | Retrieve predefined and custom app field metadata. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/apps/metadata" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

Returns app field metadata (structure varies by tenant configuration).

### Notes / Gotchas

- Use this to discover available fields and their schemas before creating or updating apps.
