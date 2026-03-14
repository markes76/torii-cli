# Parsings API

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## GET /parsings/{id} — Get Parse Request Status

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /parsings/{id}` |
| **Description** | Returns the status and results of a parsing request. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Path parameter. Parsing request ID. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/parsings/12345" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema (ParsingStatus)

Returns parsing status and results.

### Response Example

```json
{
  "id": 12345,
  "status": "completed",
  "idFile": 67890,
  "results": { ... }
}
```

### Notes / Gotchas

- Poll this endpoint to check if parsing has completed (status may be `pending`, `processing`, `completed`, or `failed`).
- Returns 404 if the parsing request does not exist.

---

## PUT /parsings/automatic — Parse Automatically (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /parsings/automatic` |
| **Description** | Automatically detects columns and parses an expense file. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (AutomaticParseConfiguration)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `idFile` | integer | **Yes** | File ID (from `POST /files` or `POST /files/upload`) |

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/parsings/automatic" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"idFile": 12345}'
```

### Response Schema (ParsingId)

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Parsing request ID for status polling |

### Response Example

```json
{
  "id": 67890
}
```

### Notes / Gotchas

- Use `GET /parsings/{id}` to poll for completion.
- File must be uploaded and stored first via `/files` endpoints.
- Best for files where column structure can be auto-detected.

---

## PUT /parsings/manual — Parse Manually (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /parsings/manual` |
| **Description** | Parses an expense file with explicit column mapping and format configuration. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (ManualParseConfiguration)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `parseConfig` | object | **Yes** | Parse configuration (see below) |
| `parseConfig.transactionDateColumn` | string | **Yes** | Column name or index for transaction date |
| `parseConfig.descriptionColumn` | string | **Yes** | Column name or index for description |
| `parseConfig.amountColumn` | string | **Yes** | Column name or index for amount |
| `parseConfig.dateFormat` | string | **Yes** | Enum: `DD/MM/YYYY`, `MM/DD/YYYY`, etc. |
| `parseConfig.currencyColumn` | string | No | Column for currency (if applicable) |
| `parseConfig.reportingUserColumn` | string | No | Column for reporting user |
| `parseConfig.currency` | string | No | ISO currency code enum (default if not in file) |
| `parseConfig.idFile` | integer | **Yes** | File ID |

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/parsings/manual" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "parseConfig": {
      "idFile": 12345,
      "transactionDateColumn": "Date",
      "descriptionColumn": "Description",
      "amountColumn": "Amount",
      "dateFormat": "MM/DD/YYYY",
      "currency": "USD"
    }
  }'
```

### Response Schema (ParsingId)

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Parsing request ID for status polling |

### Response Example

```json
{
  "id": 67890
}
```

### Notes / Gotchas

- Use when automatic parsing fails or when you need precise control over column mapping.
- `dateFormat` values include: `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`, etc.
- File must be uploaded and stored first via `/files` endpoints.
- Use `GET /parsings/{id}` to poll for completion.
