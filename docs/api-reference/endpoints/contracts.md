# Contracts API

Base URL: `https://api.toriihq.com/v1.0`

All requests require: `Authorization: Bearer API_KEY`

---

## GET /contracts - List contracts

**Endpoint:** `GET /contracts`

**Description:** Retrieve a paginated, filterable list of contracts.

**Operation Type:** READ

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fields | string | No | Comma-separated list of fields to return |
| sort | string | No | Field to sort by |
| order | string | No | Sort order (asc/desc) |
| size | integer | No | Page size for pagination |
| cursor | string | No | Pagination cursor for next page |
| filters | object | No | Filter criteria |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/contracts?size=20&sort=name&order=asc" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

```json
{
  "contracts": [
    {
      "id": 12345,
      "name": "Enterprise License",
      "status": "active"
    }
  ]
}
```

**Response Model:** Model11

**Pagination:** Yes — use `size` and `cursor` for cursor-based pagination.

**Notes:**
- Contracts support custom fields with `c_` prefix.
- Use `filters` to narrow results by status, app, or other criteria.

---

## POST /contracts - Create contract

**Endpoint:** `POST /contracts`

**Description:** Create a new contract.

**Operation Type:** WRITE

**Authentication:** Required

### Request Body (Model26)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Contract name |
| idApp | integer | Yes | App identifier |
| status | string | Yes | Contract status |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/contracts" \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise License",
    "idApp": 42,
    "status": "active"
  }'
```

### Response Example

```json
{
  "contract": {
    "id": 12345,
    "name": "Enterprise License",
    "status": "active"
  }
}
```

**Response Model:** CreateContract

**Pagination:** No

---

## GET /contracts/{idContract} - Get contract

**Endpoint:** `GET /contracts/{idContract}`

**Description:** Retrieve a single contract by ID.

**Operation Type:** READ

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| idContract | integer | Yes | Contract ID (path parameter) |
| fields | string | No | Comma-separated list of fields to return |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/contracts/12345" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

```json
{
  "id": 12345,
  "name": "Enterprise License",
  "status": "active"
}
```

**Pagination:** No

---

## PUT /contracts/{idContract} - Update contract

**Endpoint:** `PUT /contracts/{idContract}`

**Description:** Update an existing contract.

**Operation Type:** WRITE

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| idContract | integer | Yes | Contract ID (path parameter) |

### Request Body (UpdateContract)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| idApp | integer | No | App identifier |
| ... | ... | No | Additional contract fields can be updated |

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/contracts/12345" \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "idApp": 42,
    "status": "renewed"
  }'
```

### Response Example

```json
{
  "contract": {
    "id": 12345,
    "name": "Enterprise License",
    "status": "renewed"
  }
}
```

**Response Model:** Model34

**Pagination:** No

---

## DELETE /contracts/{idContract} - Delete contract

**Endpoint:** `DELETE /contracts/{idContract}`

**Description:** Permanently delete a contract.

**Operation Type:** WRITE

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| idContract | integer | Yes | Contract ID (path parameter) |

### Request Example

```bash
curl -X DELETE "https://api.toriihq.com/v1.0/contracts/12345" \
  -H "Authorization: Bearer API_KEY"
```

### Response

- **Success:** HTTP 200 with no response body
- **Error:** Standard error response with message

**Pagination:** No

**Notes:**
- Deletion is permanent and cannot be undone.

---

## GET /contracts/fields - List contract fields

**Endpoint:** `GET /contracts/fields`

**Description:** Retrieve contract field definitions.

**Operation Type:** READ

**Authentication:** Required

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/contracts/fields" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

Returns contract field definitions (structure varies by tenant configuration).

**Pagination:** No

---

## GET /contracts/metadata - List contract fields metadata

**Endpoint:** `GET /contracts/metadata`

**Description:** Retrieve predefined and custom field metadata for contracts.

**Operation Type:** READ

**Authentication:** Required

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/contracts/metadata" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

Returns predefined and custom field metadata (structure varies by tenant configuration).

**Pagination:** No
