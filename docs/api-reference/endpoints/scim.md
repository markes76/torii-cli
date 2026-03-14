# SCIM 2.0 Provisioning Endpoints

Base URL: `https://api.toriihq.com/v1.0/scim/v2`

All requests require the `Authorization: Bearer API_KEY` header.

**Overview:** Torii provides a SCIM 2.0 REST API for managing users. The SCIM API requires a **separate API key** enabled on the [Security page](https://app.toriihq.com/team/settings/security). Standard Torii API keys do not work for SCIM endpoints.

---

## GET /scim/v2/ResourceTypes — List Resource Types

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /scim/v2/ResourceTypes` |
| **Description** | Returns SCIM resource type definitions. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/scim/v2/ResourceTypes" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY"
```

### Response

Returns `SCIMResourceTypes` array.

### Notes / Gotchas

- Requires SCIM-enabled API key from the Security page.

---

## GET /scim/v2/Schemas — List Schemas

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /scim/v2/Schemas` |
| **Description** | Returns SCIM schema definitions with attributes. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/scim/v2/Schemas" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY"
```

### Response

Returns `SCIMSchemas` — schema definitions with attributes.

### Notes / Gotchas

- Requires SCIM-enabled API key.

---

## GET /scim/v2/ServiceProviderConfig — Get Service Provider Configuration

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /scim/v2/ServiceProviderConfig` |
| **Description** | Returns SCIM service provider configuration. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/scim/v2/ServiceProviderConfig" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY"
```

### Response Schema (SCIMServiceProviderConfigSchema)

| Capability | Supported | Notes |
|------------|-----------|-------|
| `patch` | true | PATCH operations supported |
| `bulk` | false | maxOperations: 0, maxPayloadSize: 0 |
| `filter` | false | maxResults: 0 |
| `changePassword` | false | Not supported |
| `sort` | false | Not supported |
| `etag` | false | Not supported |
| `authenticationSchemes` | — | Available auth schemes |

### Notes / Gotchas

- Use this endpoint to discover supported SCIM capabilities before integration.

---

## GET /scim/v2/Users — List Users

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /scim/v2/Users` |
| **Description** | Returns paginated list of SCIM users. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

Standard SCIM pagination parameters (e.g., `startIndex`, `count`) may apply.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/scim/v2/Users" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY"
```

### Response Schema (SCIMResponse)

| Field | Type | Description |
|-------|------|-------------|
| `schemas` | string[] | SCIM schema URIs |
| `totalResults` | integer | Total number of users |
| `itemsPerPage` | integer | Items per page |
| `startIndex` | integer | Pagination start index |
| `Resources` | SCIMUser[] | Array of user objects |

### SCIMUser Object

| Field | Type | Description |
|-------|------|-------------|
| `schemas` | string[] | Schema URIs |
| `id` | string | Torii user ID |
| `userName` | string | Email address |
| `name` | object | `familyName`, `givenName` |
| `active` | boolean | Admin status |
| `emails` | array | `primary`, `value` |
| `userType` | string | Torii role |
| `meta` | object | `created` timestamp |

### Response Example

```json
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
  "totalResults": 100,
  "itemsPerPage": 50,
  "startIndex": 1,
  "Resources": [
    {
      "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
      "id": "12345",
      "userName": "jane.doe@example.com",
      "name": { "familyName": "Doe", "givenName": "Jane" },
      "active": true,
      "emails": [{ "primary": true, "value": "jane.doe@example.com" }],
      "userType": "Member",
      "meta": { "created": "2024-01-15T10:30:00.000Z" }
    }
  ]
}
```

### Notes / Gotchas

- Requires SCIM-enabled API key.

---

## POST /scim/v2/Users — Create User (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /scim/v2/Users` |
| **Description** | Creates a new SCIM user. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Request Body (SCIMCreateUser)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schemas` | string[] | **Yes** | Must be `["urn:ietf:params:scim:schemas:core:2.0:User"]` |
| `userName` | string | **Yes** | Must be valid email with valid domain. **Cannot be changed after creation.** |
| `name` | object | No | `familyName`, `givenName` |
| `userType` | string | No | Valid Torii role name or custom role |
| `active` | boolean | No | Admin status |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/scim/v2/Users" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
    "userName": "jane.doe@example.com",
    "name": { "familyName": "Doe", "givenName": "Jane" },
    "userType": "Member",
    "active": true
  }'
```

### Response

Returns the created `SCIMUser` object.

### Notes / Gotchas

- **IMPORTANT:** `userName` must be a valid email address with a valid domain.
- **IMPORTANT:** `userName` cannot be changed after creation.
- Requires SCIM-enabled API key with write permissions.

---

## GET /scim/v2/Users/{idUser} — Get User By ID

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /scim/v2/Users/{idUser}` |
| **Description** | Retrieve a single SCIM user by ID. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idUser` | string | Yes | Path parameter. Torii user ID. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/scim/v2/Users/12345" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY"
```

### Response

Returns a single `SCIMUser` object.

### Notes / Gotchas

- Returns 404 if the user does not exist.

---

## PUT /scim/v2/Users/{idUser} — Update User PUT (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /scim/v2/Users/{idUser}` |
| **Description** | Full update of a SCIM user. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idUser` | string | Yes | Path parameter. Torii user ID. |

### Request Body (SCIMUpdateUser)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schemas` | string[] | **Yes** | SCIM schema URIs |
| `id` | number | Yes | Torii user ID |
| `userName` | string | **Yes** | Email address |
| `userType` | string | No | Role; won't change if omitted |
| `active` | boolean | No | Set `false` to deactivate user |

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/scim/v2/Users/12345" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
    "id": 12345,
    "userName": "jane.doe@example.com",
    "userType": "Member",
    "active": false
  }'
```

### Response

Returns the updated `SCIMUser` object.

### Notes / Gotchas

- **IMPORTANT:** If `active: false`, the user will be deactivated.
- Requires SCIM-enabled API key with write permissions.

---

## PATCH /scim/v2/Users/{idUser} — Update User PATCH (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PATCH /scim/v2/Users/{idUser}` |
| **Description** | Partial update of a SCIM user using PATCH operations. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idUser` | string | Yes | Path parameter. Torii user ID. |

### Request Body (SCIMPATCHRequest)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schemas` | string[] | **Yes** | Must be `["urn:ietf:params:scim:api:messages:2.0:PatchOp"]` |
| `Operations` | array | Yes | Array of operations |

### Operation Object

| Field | Type | Description |
|-------|------|-------------|
| `op` | enum | `add`, `remove`, or `replace` |
| `path` | string | JSON path to the attribute |
| `value` | string | Value for add/replace |

### Request Example

```bash
curl -X PATCH "https://api.toriihq.com/v1.0/scim/v2/Users/12345" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    "Operations": [
      { "op": "replace", "path": "active", "value": "false" }
    ]
  }'
```

### Response

Returns the updated `SCIMUser` object.

### Notes / Gotchas

- Requires SCIM-enabled API key with write permissions.

---

## DELETE /scim/v2/Users/{idUser} — Delete User (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `DELETE /scim/v2/Users/{idUser}` |
| **Description** | Permanently removes a user from SCIM. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY` — SCIM key) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idUser` | string | Yes | Path parameter. Torii user ID. |

### Request Example

```bash
curl -X DELETE "https://api.toriihq.com/v1.0/scim/v2/Users/12345" \
  -H "Authorization: Bearer YOUR_SCIM_API_KEY"
```

### Response

No response body on success. Returns 204 No Content or similar.

### Notes / Gotchas

- **Destructive operation.** User is permanently removed from SCIM.
- Requires SCIM-enabled API key with write permissions.
