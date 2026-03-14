# Workflows API

Base URL: `https://api.toriihq.com/v1.0`

All requests require: `Authorization: Bearer API_KEY`

---

## GET /workflows/actionExecutions - Get action execution logs

**Endpoint:** `GET /workflows/actionExecutions`

**Description:** Retrieve action execution history for workflows.

**Operation Type:** READ

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| size | integer | No | Number of records per page |
| cursor | string | No | Pagination cursor for next page |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/workflows/actionExecutions?size=50" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

```json
{
  "actionExecutions": [
    {
      "workflowRunId": 12345,
      "actionStatus": "completed",
      "timestamp": "2025-03-14T10:30:00Z"
    }
  ]
}
```

**Response Model:** WorkflowActionExecution

**Fields include:** Workflow run details, action status, timestamps.

**Pagination:** Yes — use `size` and `cursor` for cursor-based pagination.

---

## GET /workflows/audit - Get workflows edit history

**Endpoint:** `GET /workflows/audit`

**Description:** Retrieve the audit trail of workflow edits.

**Operation Type:** READ

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| size | integer | No | Number of records per page |
| cursor | string | No | Pagination cursor for next page |

### Request Example

```bash
curl -X GET "https://api.toriihq.com/v1.0/workflows/audit?size=50" \
  -H "Authorization: Bearer API_KEY"
```

### Response Example

Returns workflow edit audit trail (structure varies).

**Response Model:** WorkflowsEditHistory

**Pagination:** Yes — use `size` and `cursor` for cursor-based pagination.

---

## POST /workflows/{idWorkflow}/trigger - Run workflow

**Endpoint:** `POST /workflows/{idWorkflow}/trigger`

**Description:** Manually trigger a workflow run.

**Operation Type:** WRITE

**Authentication:** Required

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| idWorkflow | integer | Yes | Workflow ID (path parameter) |

### Request Body (ManuallyRunWorkflow)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| triggerAppId | number | No | App ID (for app-triggered workflows) |
| triggerUserEmail | string | No | User email (for user-triggered workflows) |
| triggerContractId | number | No | Contract ID (for contract-triggered workflows) |
| triggerLicenseName | string | No | License name (for license-triggered workflows) |
| triggerLicenseAppId | number | No | License app ID (for license-triggered workflows) |

**All body fields are optional** — required fields depend on the workflow's trigger type.

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/workflows/123/trigger" \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "triggerAppId": 42,
    "triggerUserEmail": "user@example.com"
  }'
```

### Response Example

```json
{
  "success": true
}
```

**Response Model:** StandardResponse

**Pagination:** No

**Notes:**
- **IMPORTANT:** Different workflows require different trigger fields based on their configuration.
- Provide only the fields relevant to the workflow's trigger type.
- Invalid or missing required trigger data may result in a 400 error or workflow failure.

---

## POST /appCatalog/triggerAppAccessRequestPolicy - Run App Access Request Policy

**Endpoint:** `POST /appCatalog/triggerAppAccessRequestPolicy`

**Description:** Manually trigger the app access request workflow for a user requesting access to an app.

**Operation Type:** WRITE

**Authentication:** Required

### Request Body (ManuallyRunRequestAccessPolicy)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| triggerAppId | number | Yes | App ID |
| triggerUserEmail | string | Yes | User email requesting access |
| description | string | No | Reason for the access request |

### Request Example

```bash
curl -X POST "https://api.toriihq.com/v1.0/appCatalog/triggerAppAccessRequestPolicy" \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "triggerAppId": 42,
    "triggerUserEmail": "user@example.com",
    "description": "Need access for new project"
  }'
```

### Response Example

```json
{
  "success": true
}
```

**Response Model:** StandardResponse

**Pagination:** No

**Notes:**
- Triggers the app access request workflow/policy.
- Both `triggerAppId` and `triggerUserEmail` are required.
