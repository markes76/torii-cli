# Roles API

Base URL: `https://api.toriihq.com/v1.0`

All requests require: `Authorization: Bearer API_KEY`

---

## GET /roles - List roles

**Endpoint:** `GET /roles`

**Description:** Retrieve all roles defined in the Torii platform.

**Operation Type:** READ

**Authentication:** Required

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/roles" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

```json
{
  "roles": [
    {
      "id": 1,
      "systemKey": "admin",
      "name": "Administrator",
      "description": "Full platform access",
      "isAdmin": true,
      "usersCount": 3
    },
    {
      "id": 2,
      "systemKey": "viewer",
      "name": "Viewer",
      "description": "Read-only access",
      "isAdmin": false,
      "usersCount": 15
    }
  ]
}
```

**Response Model:** Model12

### Role Object

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Role ID |
| systemKey | string | System identifier for the role |
| name | string | Display name |
| description | string | Role description |
| isAdmin | boolean | Whether the role has admin privileges |
| usersCount | number | Number of users assigned to this role |

**Pagination:** No

**Notes:**
- This is a read-only endpoint; roles cannot be created, updated, or deleted via this API.
- Role definitions are typically managed through the Torii admin UI.
