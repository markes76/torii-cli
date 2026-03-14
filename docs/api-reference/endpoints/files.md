# Files API

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## GET /files/url — Get Parameters for Uploading Files

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /files/url` |
| **Description** | Returns pre-signed upload URL parameters for file uploads. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/files/url" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema (UploadFileParameters)

Returns upload configuration including pre-signed URL and parameters.

### Response Example

```json
{
  "url": "https://...",
  "fields": {
    "key": "...",
    "policy": "...",
    "signature": "..."
  }
}
```

### Notes / Gotchas

- Use these parameters to upload files to the storage backend (e.g., S3).
- Typically used in conjunction with `POST /files` to store file metadata after upload.

---

## GET /files/{id} — Get File Information

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /files/{id}` |
| **Description** | Returns file metadata for a given file ID. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Path parameter. File ID. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/files/12345" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Schema (FileEntity)

Returns file metadata (path, type, size, etc.).

### Response Example

```json
{
  "id": 12345,
  "path": "2024-01-15T10:30:00.000Z/expense-report.csv",
  "type": "customIntegrationData",
  "size": 1024
}
```

### Notes / Gotchas

- Returns 404 if the file does not exist.

---

## GET /files/{id}/download — Download File

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /files/{id}/download` |
| **Description** | Downloads the file content. |
| **Operation Type** | READ |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Path parameter. File ID. |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/files/12345/download" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o downloaded-file.csv
```

### Response

Returns the raw file content (binary or text depending on file type).

### Notes / Gotchas

- Use `-o` or redirect to save the file to disk.
- Returns 404 if the file does not exist.

---

## POST /files — Store File Information in DB (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /files` |
| **Description** | Stores file metadata in the database after upload. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None.

### Request Body (StoreFileInformation)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | **Yes** | S3 path in format: `Timestamp/Filename` (e.g., `2024-01-15T10:30:00.000Z/expense-report.csv`) |
| `type` | string | **Yes** | Enum: `attachment`, `expenseReport`, `customIntegrationData`, `pluginLogo`, `pluginResource`, `logo` |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/files" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "2024-01-15T10:30:00.000Z/expense-report.csv",
    "type": "customIntegrationData"
  }'
```

### Response Schema (FileId)

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | File ID for use in other endpoints |

### Response Example

```json
{
  "id": 12345
}
```

### Notes / Gotchas

- Use the returned `id` with integration sync endpoints (e.g., `PUT /services/sync/custom`) and parsing endpoints.
- Path format must match what was used during upload.

---

## POST /files/upload — Upload File (WRITE)

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /files/upload` |
| **Description** | Multipart file upload. Max size: 3MB. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Parameters

None. Uses multipart form data.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | **Yes** | The file to upload (multipart) |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/files/upload" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@/path/to/expense-report.csv"
```

### Response

Returns file information including ID and metadata.

### Notes / Gotchas

- **Max file size: 3MB.** Larger files may need to use `GET /files/url` for pre-signed upload.
- Use multipart form encoding.
- After upload, you may need to call `POST /files` to store metadata with the correct `type` for integration or parsing workflows.
