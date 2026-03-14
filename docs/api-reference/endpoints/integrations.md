# Integration Endpoints

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## PUT /services/sync/custom — Sync Custom Integration (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /services/sync/custom` |
| **Description** | Triggers sync of a custom integration data file. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (CustomIntegrationSyncConfiguration)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `idFile` | integer | **Yes** | File ID. The file must be uploaded first via `/files` endpoints. |
| `idAppAccount` | integer | **Yes** | App account ID. |

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/services/sync/custom" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "idFile": 12345,
    "idAppAccount": 67890
  }'
```

### Response

Returns sync status or confirmation.

### Notes / Gotchas

- The file must be uploaded first via the `/files` endpoints.
- Ensure the file exists and is associated with the correct app account before triggering sync.

---

## PUT /services/sync/gluu — Sync Gluu Custom Integration (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /services/sync/gluu` |
| **Description** | Triggers sync of a Gluu identity management custom integration. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (GluuCustomIntegrationSyncConfiguration)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `idFile` | integer | **Yes** | File ID. |
| `idAppAccount` | integer | **Yes** | App account ID. |

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/services/sync/gluu" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "idFile": 12345,
    "idAppAccount": 67890
  }'
```

### Response

Returns sync status or confirmation.

### Notes / Gotchas

- Specific to Gluu identity management integration.
- Use the same file upload flow as custom integrations: upload via `/files` first, then pass `idFile` here.
