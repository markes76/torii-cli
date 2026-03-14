# User-App Relationships

## Overview

These endpoints manage the bidirectional relationship between users and applications. You can query which apps a user has, which users belong to an app, and update user-app associations (e.g., marking a user as removed from an app).

**Base URL:** `https://api.toriihq.com/v1.0`
**Authentication:** `Authorization: Bearer API_KEY`

---

## GET /users/{idUser}/apps — List User Applications

**Description:** Returns all applications associated with a specific user.
**Operation Type:** READ

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| idUser | path | integer | Yes | Unique user identifier |
| fields | query | string | No | Comma-separated list of fields to include |
| sort | query | string | No | Field name to sort by |
| order | query | string | No | Sort order: `asc` or `desc` |

### Request Example

```bash
curl -H "Authorization: Bearer API_KEY" \
  "https://api.toriihq.com/v1.0/users/12345/apps"
```

### Response Example

```json
{
  "apps": [
    {
      "id": 101,
      "name": "Slack",
      "isUserRemovedFromApp": false,
      "state": "active"
    },
    {
      "id": 202,
      "name": "Jira",
      "isUserRemovedFromApp": false,
      "state": "active"
    },
    {
      "id": 303,
      "name": "Trello",
      "isUserRemovedFromApp": true,
      "state": "active"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| apps | applicationUser[] | Array of user-app relationship objects |
| apps[].id | integer | Unique app identifier |
| apps[].name | string | Application name |
| apps[].isUserRemovedFromApp | boolean | `true` if user has been removed from this app |
| apps[].state | string | Application state |

### Notes
- Does not support pagination — returns the full list
- Use `fields` to limit which fields are returned
- `isUserRemovedFromApp` reflects whether the user's access was revoked

---

## GET /users/{idUser}/apps/{idApp} — Get User Application

**Description:** Returns the relationship details between a specific user and a specific application.
**Operation Type:** READ

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| idUser | path | integer | Yes | Unique user identifier |
| idApp | path | integer | Yes | Unique app identifier |

### Request Example

```bash
curl -H "Authorization: Bearer API_KEY" \
  "https://api.toriihq.com/v1.0/users/12345/apps/101"
```

### Response Example

```json
{
  "app": {
    "id": 101,
    "name": "Slack",
    "isUserRemovedFromApp": false,
    "state": "active"
  }
}
```

---

## PUT /users/{idUser}/apps/{idApp} — Update User Application

**Description:** Updates the relationship between a user and an application. Primarily used to mark a user as removed from an app.
**Operation Type:** WRITE

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| idUser | path | integer | Yes | Unique user identifier |
| idApp | path | integer | Yes | Unique app identifier |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| isUserRemovedFromApp | boolean | No | Set to `true` to mark the user as removed from the app |

### Request Example

```bash
curl -X PUT \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"isUserRemovedFromApp": true}' \
  "https://api.toriihq.com/v1.0/users/12345/apps/101"
```

### Response Example

```json
{
  "app": {
    "id": 101,
    "name": "Slack",
    "isUserRemovedFromApp": true,
    "state": "active"
  }
}
```

### Side Effects
- Marking a user as removed may trigger offboarding workflows if configured
- This does not actually revoke access in the target application — it records the state in Torii

### Idempotency
- Setting `isUserRemovedFromApp` to the same value is safe and returns the same result

---

## GET /apps/{idApp}/users — List Application Users

**Description:** Returns all users associated with a specific application. Supports pagination.
**Operation Type:** READ

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| idApp | path | integer | Yes | Unique app identifier |
| fields | query | string | No | Comma-separated list of fields to include |
| sort | query | string | No | Field name to sort by |
| order | query | string | No | Sort order: `asc` or `desc` |
| size | query | integer | No | Number of results per page |
| cursor | query | string | No | Pagination cursor from previous response |

### Request Example

```bash
curl -H "Authorization: Bearer API_KEY" \
  "https://api.toriihq.com/v1.0/apps/101/users?size=50"
```

### Response Example

```json
{
  "users": [
    {
      "id": 12345,
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@company.com",
      "lifecycleStatus": "active",
      "activeAppsCount": 24
    },
    {
      "id": 12346,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@company.com",
      "lifecycleStatus": "active",
      "activeAppsCount": 18
    }
  ],
  "count": 50,
  "total": 342,
  "nextCursor": "WzE6NjM1Mzg4NTcsIjY1NFMyMyJd"
}
```

### Pagination
- Supports cursor-based pagination via `size` and `cursor` parameters
- Response includes `nextCursor` when more pages are available
- Paginate until `nextCursor` is absent from the response

### Notes
- Returns full User objects (not applicationUser objects like the /users/{id}/apps endpoint)
- Useful for answering "who uses this app?" queries
- Can return large result sets for popular apps — use pagination
