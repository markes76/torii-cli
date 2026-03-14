# GDPR / Anonymization Endpoints

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## POST /anonymizeRequest — Create User Anonymization Request (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /anonymizeRequest` |
| **Description** | Creates a user anonymization request for GDPR compliance. Anonymizes user data. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (AnonymizeUser)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | **Yes** | Email of the user to anonymize |
| `fields` | string[] | No | Specific fields to anonymize; omit if anonymizing all |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/anonymizeRequest" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "fields": ["firstName", "lastName", "email"]
  }'
```

### Response Schema (AnonymizationRequestResponse)

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Request ID |
| `status` | string | Request status |

### Response Example

```json
{
  "id": 1001,
  "status": "pending"
}
```

### Notes / Gotchas

- **This is a destructive operation that cannot be undone.**
- Used for GDPR compliance — anonymizes user data.
- Ensure the API key has write permissions.
- Use `fields` to limit anonymization to specific fields, or omit to anonymize all user data.
