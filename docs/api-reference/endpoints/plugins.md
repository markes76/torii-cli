# Plugins API

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## GET /plugins/{idPlugin}/fields — List Plugin Fields

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /plugins/{idPlugin}/fields` |
| **Description** | Returns field definitions for a plugin. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPlugin` | integer | Yes | Path parameter. Plugin ID. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/plugins/123/fields" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema (PluginFields)

Returns field definitions for the plugin.

### Response Example

```json
{
  "fields": [
    {
      "id": 1,
      "name": "apiEndpoint",
      "type": "string",
      "required": true
    }
  ]
}
```

### Notes / Gotchas

- Returns 404 if the plugin does not exist.

---

## POST /plugins — Create Plugin (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /plugins` |
| **Description** | Creates a new Torii marketplace plugin. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (Model27)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Plugin name. |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/plugins" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Custom Integration"}'
```

### Response

Returns the created plugin object.

### Response Example

```json
{
  "id": 123,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Custom Integration",
  "version": 1
}
```

### Notes / Gotchas

- Ensure the API key has write permissions.

---

## POST /plugins/{uuidPlugin}/apikey — Generate API Key for Private Plugin (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /plugins/{uuidPlugin}/apikey` |
| **Description** | Generates an API key for a private plugin. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uuidPlugin` | string | Yes | Path parameter. Plugin UUID. |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/plugins/550e8400-e29b-41d4-a716-446655440000/apikey" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema (ApiKey)

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | API key ID |
| `idOrg` | integer | Organization ID |
| `createdBy` | integer | User ID of creator |
| `token` | string | The actual API key — store securely |

### Response Example

```json
{
  "id": 456,
  "idOrg": 10,
  "createdBy": 1001,
  "token": "pk_xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Notes / Gotchas

- **Store the `token` securely.** It may only be returned once.
- Use this for private plugins that require their own API key for authentication.

---

## PUT /plugins/{uuidPlugin} — Update Plugin / Publish New Version (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `PUT /plugins/{uuidPlugin}` |
| **Description** | Updates a plugin or publishes a new version. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uuidPlugin` | string | Yes | Path parameter. Plugin UUID. |

### Request Body

See API documentation for full request body schema. Typically includes plugin configuration and version metadata.

### Request Example

```bash
curl -X PUT "https://api.toriihq.com/v1.0/plugins/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Custom Integration", "version": 2}'
```

### Response

Returns the updated plugin object.

### Notes / Gotchas

- Publishes a new version of an existing plugin.
- Ensure the API key has write permissions.

---

## DELETE /plugins/{uuidPlugin} — Delete Plugin (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `DELETE /plugins/{uuidPlugin}` |
| **Description** | Permanently deletes a plugin. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uuidPlugin` | string | Yes | Path parameter. Plugin UUID. |

### Request Example

```bash
curl -X DELETE "https://api.toriihq.com/v1.0/plugins/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

No response body on success. Returns 204 No Content or similar.

### Notes / Gotchas

- **Destructive operation.** Plugin is permanently removed.
- Ensure the API key has write permissions.
