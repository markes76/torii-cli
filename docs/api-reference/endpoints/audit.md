# Audit API

Base URL: `https://api.toriihq.com/v1.0`

All requests require: `Authorization: Bearer API_KEY`

---

## GET /audit - Get admin audit logs

**Endpoint:** `GET /audit`

**Description:** Retrieve admin audit logs for administrative actions performed in the Torii platform.

**Operation Type:** READ

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| size | integer | No | Number of records per page |
| cursor | string | No | Pagination cursor for next page |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/audit?size=50" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

```json
{
  "audit": [
    {
      "performedBy": 1001,
      "performedByFirstName": "Jane",
      "performedByLastName": "Doe",
      "performedByEmail": "jane.doe@example.com",
      "idTargetOrg": 42,
      "creationTime": "2025-03-14T10:30:00Z",
      "type": "update_workflow",
      "requestDetails": {
        "path": "/workflows/123",
        "method": "PUT",
        "remoteAddress": "192.168.1.1"
      },
      "properties": {}
    }
  ],
  "nextCursor": "eyJpZCI6MTAwMH0",
  "count": 150
}
```

**Response Model:** AuditLog

### auditLog Object

| Field | Type | Description |
|-------|------|-------------|
| performedBy | integer | User ID of the actor |
| performedByFirstName | string | Actor's first name |
| performedByLastName | string | Actor's last name |
| performedByEmail | string | Actor's email |
| idTargetOrg | integer | Target organization ID |
| creationTime | string | ISO 8601 timestamp |
| type | string | Audit event type (enum) |
| requestDetails | object | path, method, remoteAddress |
| properties | object | Event-specific properties |

### Audit Log Types

- `create_workflow`
- `delete_workflow`
- `duplicate_workflow`
- `update_workflow`
- `login`
- `update_settings`
- `invite_member`
- `remove_member`
- `create_integration`
- `update_integration`
- `delete_integration`
- *(and many more)*

**Pagination:** Yes — use `size` and `cursor` for cursor-based pagination. Use `nextCursor` from the response for the next page.

**Notes:**
- Audit logs are read-only; no write operations.
- The `type` enum may include additional values depending on platform version.
