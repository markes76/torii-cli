# Organization API

## Overview

The Organization API provides read-only access to the authenticated organization's profile and settings. Use it to retrieve organization details such as name, ID, and configuration.

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## GET /orgs/my — Get organization

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /orgs/my` |
| **Description** | Retrieve the organization profile for the authenticated API key. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None. The endpoint uses the API key to identify the organization.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/orgs/my" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

Returns an Organization object with organization profile details (e.g., name, id, settings). Structure varies by tenant configuration.

### Response Example

```json
{
  "id": 10,
  "name": "Acme Corp",
  "settings": {},
  "createdAt": "2023-01-15T00:00:00.000Z"
}
```

### Pagination

- **Supported:** No.

### Notes / Gotchas

- Read-only endpoint; organization cannot be updated via this API.
- Returns info about the organization associated with the Bearer token.
