# Write Operations Reference

## Overview

This document provides a deep reference for all write operations in the Torii API. For each operation: endpoint, required/optional fields, validation rules, idempotency, return value, side effects, and gotchas.

---

## Apps

### POST /apps — Add app from catalog

| Property | Value |
|----------|-------|
| **Endpoint** | POST /apps |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `idApp` | integer | **Required.** Torii catalog app ID. |

**Optional fields:** None.

**Validation:** `idApp` must reference a valid app in the Torii catalog. Use `GET /apps/search` or `POST /apps/match` to resolve names to IDs.

**Idempotency:** Adding an app that already exists may return an error or be idempotent; behavior is tenant-dependent.

**Returns:** Created app object.

**Side effects:** App appears in organization's app list; may trigger discovery workflows.

**Gotchas:** Catalog ID differs from org-specific app ID in some contexts; ensure you use the catalog ID from search/match.

---

### POST /apps/custom — Create custom app

| Property | Value |
|----------|-------|
| **Endpoint** | POST /apps/custom |
| **Method** | POST |

**Required fields:** None. At minimum, provide `name` for a useful app.

**Optional fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | — | App name. |
| `state` | string | — | App state. |
| `url` | string | — | App URL. |
| `category` | string | — | App category. |
| `description` | string | — | App description. |
| `tags` | string | — | App tags. |

**Validation:** All fields optional; `name` recommended.

**Idempotency:** Not idempotent; each call creates a new app.

**Returns:** Created app object with `id`.

**Side effects:** Custom app is organization-specific; does not come from catalog.

**Gotchas:** Use for shadow IT or uncatalogued apps.

---

### POST /apps/match — Match app names to catalog

| Property | Value |
|----------|-------|
| **Endpoint** | POST /apps/match |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `apps` | array | **Required.** Array of objects. Each object must have `name` (string, required). |

**Optional fields:** None.

**Validation:** Each element: `{ "name": "AppName" }`. `name` is required per entry.

**Idempotency:** Idempotent; same input returns same matches.

**Returns:** Array of matched apps with `idApp`, `name`, `url`, `searchedBy`. Unmatched apps may be omitted or have null `idApp`.

**Side effects:** None; read-like operation that returns catalog IDs.

**Gotchas:** Use before `POST /apps` to resolve catalog IDs from names.

---

### PUT /apps/{idApp} — Update app

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /apps/{idApp} |
| **Method** | PUT |

**Required fields:** None. Only include fields to update.

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `owner` | integer | **DEPRECATED.** Primary owner user ID. |
| `isHidden` | boolean | Whether to hide the app. |
| `name` | string | App name. |
| `state` | string | App state. |
| `url` | string | App URL. |
| `category` | string | App category. |
| `description` | string | App description. |
| `tags` | string | App tags. |

**Validation:** Partial updates supported; omit fields to leave unchanged.

**Idempotency:** Idempotent for same payload.

**Returns:** Updated app object.

**Side effects:** May affect app visibility, reporting, and workflows.

**Gotchas:** Avoid `owner`; it is deprecated.

---

## App Fields

### POST /apps/fields — Create app field

| Property | Value |
|----------|-------|
| **Endpoint** | POST /apps/fields |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Field name. |
| `type` | string | **Required.** Enum: `multiLine`, `number`, `datePicker`, `dropdown`, `dropdownMulti`, `user`, `usersPersonal`. |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `formQuestion` | string | Question text for forms. |
| `idGroup` | integer | Group ID for grouping fields. |
| `options` | array/object | Options for dropdown types. |

**Validation:** `type` must be one of the enum values. For `dropdown` and `dropdownMulti`, provide `options`.

**Idempotency:** Not idempotent; creates new field.

**Returns:** Created field object.

**Side effects:** Field available for app metadata.

**Gotchas:** Changing `type` later (via PUT) may require compatible `options` or cause data migration issues.

---

### PUT /apps/fields/{idField} — Update app field

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /apps/fields/{idField} |
| **Method** | PUT |

**Required fields:** None.

**Optional fields:** Same as POST: `name`, `formQuestion`, `type`, `idGroup`, `options`. Only include fields to change.

**Validation:** System fields may have restricted updatability.

**Idempotency:** Idempotent for same payload.

**Returns:** Updated field object.

**Side effects:** May affect apps using this field.

**Gotchas:** Changing `type` may require compatible `options`.

---

### DELETE /apps/fields/{idField} — Delete app field

| Property | Value |
|----------|-------|
| **Endpoint** | DELETE /apps/fields/{idField} |
| **Method** | DELETE |

**Required fields:** `idField` (path).

**Optional fields:** None.

**Validation:** Deletion may fail if field is in use. System/predefined fields may not be deletable.

**Idempotency:** Idempotent; second delete returns 404.

**Returns:** 200/204, no body or minimal confirmation.

**Side effects:** Field removed; data in apps may be cleared.

**Gotchas:** Check if field is in use before deleting.

---

## Contracts

### POST /contracts — Create contract

| Property | Value |
|----------|-------|
| **Endpoint** | POST /contracts |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Contract name. |
| `idApp` | integer | **Required.** App identifier. |
| `status` | string | **Required.** Contract status. |

**Optional fields:** Additional contract fields per tenant schema.

**Validation:** All three required fields must be present.

**Idempotency:** Not idempotent; creates new contract.

**Returns:** Created contract object.

**Side effects:** Contract linked to app; may trigger license workflows.

**Gotchas:** Ensure `idApp` exists in the organization.

---

### PUT /contracts/{idContract} — Update contract

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /contracts/{idContract} |
| **Method** | PUT |

**Required fields:** None.

**Optional fields:** `idApp`, `status`, and other updatable contract fields per tenant.

**Validation:** Partial updates supported.

**Idempotency:** Idempotent for same payload.

**Returns:** Updated contract object.

**Side effects:** May affect license calculations and renewals.

**Gotchas:** Check tenant-specific field schema.

---

### DELETE /contracts/{idContract} — Delete contract

| Property | Value |
|----------|-------|
| **Endpoint** | DELETE /contracts/{idContract} |
| **Method** | DELETE |

**Required fields:** `idContract` (path).

**Optional fields:** None.

**Validation:** Contract must exist.

**Idempotency:** Idempotent; second delete returns 404.

**Returns:** 200, no body.

**Side effects:** **Permanent.** Contract and associated data removed.

**Gotchas:** Cannot be undone.

---

## Users

### PUT /users/{idUser} — Update user

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /users/{idUser} |
| **Method** | PUT |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `lifecycleStatus` | string | **Required.** Enum: `active`, `offboarding`, `offboarded`. |

**Optional fields:** None. Only `lifecycleStatus` is editable.

**Validation:** Must be one of: `active`, `offboarding`, `offboarded`.

**Idempotency:** Idempotent for same status.

**Returns:** Updated user object.

**Side effects:** **Triggers offboarding workflows.** Typical flow: `active` → `offboarding` → `offboarded`. May cascade to app access, licenses, and notifications.

**Gotchas:** Other user fields are read-only. Use for offboarding workflows.

---

### PUT /users/{idUser}/apps/{idApp} — Update user-app relationship

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /users/{idUser}/apps/{idApp} |
| **Method** | PUT |

**Required fields:** None. Only include fields to update.

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `isUserRemovedFromApp` | boolean | Set `true` to mark user as removed from app. |

**Validation:** Both IDs must exist.

**Idempotency:** Idempotent for same payload.

**Returns:** Updated user-app object.

**Side effects:** Marks user as removed from app; may affect license counts and offboarding workflows.

**Gotchas:** Use during offboarding to revoke app access before setting user to `offboarded`.

---

## Files

### POST /files — Store file metadata

| Property | Value |
|----------|-------|
| **Endpoint** | POST /files |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | **Required.** S3 path format: `Timestamp/Filename` (e.g., `2024-01-15T10:30:00.000Z/expense-report.csv`). |
| `type` | string | **Required.** Enum: `attachment`, `expenseReport`, `customIntegrationData`, `pluginLogo`, `pluginResource`, `logo`. |

**Optional fields:** None.

**Validation:** Path must match upload format. `type` must be one of the enum values.

**Idempotency:** Not idempotent; creates new file record.

**Returns:** `{ "id": <fileId> }`.

**Side effects:** File record created for use in integrations, parsings.

**Gotchas:** Use returned `id` with `PUT /services/sync/custom`, `PUT /parsings/automatic`, etc. Path format must match what was used during upload.

---

### POST /files/upload — Upload file

| Property | Value |
|----------|-------|
| **Endpoint** | POST /files/upload |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | **Required.** Multipart file upload. |

**Optional fields:** None.

**Validation:** **Max file size: 3MB.** Larger files need `GET /files/url` for pre-signed upload.

**Idempotency:** Not idempotent; each upload creates new file.

**Returns:** File information including ID and metadata.

**Side effects:** File stored; may need `POST /files` to store metadata with correct `type` for integration/parsing workflows.

**Gotchas:** Use multipart form encoding. For files > 3MB, use pre-signed URL flow.

---

## Parsings

### PUT /parsings/automatic — Parse file automatically

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /parsings/automatic |
| **Method** | PUT |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `idFile` | integer | **Required.** File ID from `POST /files` or `POST /files/upload`. |

**Optional fields:** None.

**Validation:** File must exist and be uploaded/stored first.

**Idempotency:** Not idempotent; each call creates new parsing request.

**Returns:** `{ "id": <parsingId> }`. Poll `GET /parsings/{id}` for status.

**Side effects:** Async parsing job started. Best for files where column structure can be auto-detected.

**Gotchas:** File must be uploaded first. Poll for completion.

---

### PUT /parsings/manual — Parse file with manual config

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /parsings/manual |
| **Method** | PUT |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `parseConfig` | object | **Required.** Parse configuration. |
| `parseConfig.idFile` | integer | **Required.** File ID. |
| `parseConfig.transactionDateColumn` | string | **Required.** Column name or index for transaction date. |
| `parseConfig.descriptionColumn` | string | **Required.** Column name or index for description. |
| `parseConfig.amountColumn` | string | **Required.** Column name or index for amount. |
| `parseConfig.dateFormat` | string | **Required.** Enum: `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`, etc. |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `parseConfig.currencyColumn` | string | Column for currency. |
| `parseConfig.reportingUserColumn` | string | Column for reporting user. |
| `parseConfig.currency` | string | ISO currency code (default if not in file). |

**Validation:** All required parseConfig fields must be present. `dateFormat` must be valid enum.

**Idempotency:** Not idempotent; each call creates new parsing request.

**Returns:** `{ "id": <parsingId> }`. Poll `GET /parsings/{id}` for status.

**Side effects:** Async parsing with explicit column mapping.

**Gotchas:** Use when automatic parsing fails or precise control is needed.

---

## SCIM

### POST /scim/v2/Users — Create SCIM user

| Property | Value |
|----------|-------|
| **Endpoint** | POST /scim/v2/Users |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemas` | string[] | **Required.** Must be `["urn:ietf:params:scim:schemas:core:2.0:User"]`. |
| `userName` | string | **Required.** Valid email with valid domain. **Cannot be changed after creation.** |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | object | `familyName`, `givenName`. |
| `userType` | string | Valid Torii role name or custom role. |
| `active` | boolean | Admin status. |

**Validation:** `userName` must be valid email. Requires SCIM-enabled API key.

**Idempotency:** Not idempotent; duplicate `userName` may return error.

**Returns:** Created SCIM user object.

**Side effects:** User provisioned in Torii. `userName` is immutable.

**Gotchas:** `userName` cannot be changed after creation. Use valid domain.

---

### PUT /scim/v2/Users/{idUser} — Full update SCIM user

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /scim/v2/Users/{idUser} |
| **Method** | PUT |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemas` | string[] | **Required.** SCIM schema URIs. |
| `id` | number | **Required.** Torii user ID. |
| `userName` | string | **Required.** Email address. |

**Optional fields:** `userType`, `active`. Omit to leave unchanged.

**Validation:** Full replace semantics. `active: false` deactivates user.

**Idempotency:** Idempotent for same payload.

**Returns:** Updated SCIM user object.

**Side effects:** `active: false` deactivates user.

**Gotchas:** Full replace; include all required fields.

---

### PATCH /scim/v2/Users/{idUser} — Partial update SCIM user

| Property | Value |
|----------|-------|
| **Endpoint** | PATCH /scim/v2/Users/{idUser} |
| **Method** | PATCH |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemas` | string[] | **Required.** Must be `["urn:ietf:params:scim:api:messages:2.0:PatchOp"]`. |
| `Operations` | array | **Required.** Array of operations. |

**Operation object:**

| Field | Type | Description |
|-------|------|-------------|
| `op` | enum | `add`, `remove`, or `replace`. |
| `path` | string | JSON path to attribute. |
| `value` | string | Value for add/replace. |

**Validation:** Valid SCIM PATCH format.

**Idempotency:** Idempotent for same operations.

**Returns:** Updated SCIM user object.

**Side effects:** Partial update; e.g., `replace` on `active` to deactivate.

**Gotchas:** Prefer PATCH over PUT for single-field updates.

---

### DELETE /scim/v2/Users/{idUser} — Delete SCIM user

| Property | Value |
|----------|-------|
| **Endpoint** | DELETE /scim/v2/Users/{idUser} |
| **Method** | DELETE |

**Required fields:** `idUser` (path).

**Optional fields:** None.

**Validation:** User must exist.

**Idempotency:** Idempotent; second delete returns 404.

**Returns:** 204 No Content.

**Side effects:** **Permanent.** User removed from SCIM.

**Gotchas:** Destructive; cannot be undone.

---

## Plugins

### POST /plugins — Create plugin

| Property | Value |
|----------|-------|
| **Endpoint** | POST /plugins |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Plugin name. |

**Optional fields:** None.

**Validation:** Name required.

**Idempotency:** Not idempotent; creates new plugin.

**Returns:** Created plugin object with `id` and `uuid`.

**Side effects:** Plugin created; use `uuid` for subsequent operations.

**Gotchas:** Store returned `uuid` for update/delete/apikey.

---

### PUT /plugins/{uuidPlugin} — Update plugin

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /plugins/{uuidPlugin} |
| **Method** | PUT |

**Required fields:** `uuidPlugin` (path).

**Optional fields:** Plugin configuration, version metadata (see API docs).

**Validation:** UUID must exist.

**Idempotency:** Idempotent for same payload.

**Returns:** Updated plugin object.

**Side effects:** Publishes new version of plugin.

**Gotchas:** Use UUID, not numeric ID.

---

### DELETE /plugins/{uuidPlugin} — Delete plugin

| Property | Value |
|----------|-------|
| **Endpoint** | DELETE /plugins/{uuidPlugin} |
| **Method** | DELETE |

**Required fields:** `uuidPlugin` (path).

**Optional fields:** None.

**Validation:** Plugin must exist.

**Idempotency:** Idempotent; second delete returns 404.

**Returns:** 204 No Content.

**Side effects:** **Permanent.** Plugin removed.

**Gotchas:** Destructive; cannot be undone.

---

### POST /plugins/{uuidPlugin}/apikey — Generate plugin API key

| Property | Value |
|----------|-------|
| **Endpoint** | POST /plugins/{uuidPlugin}/apikey |
| **Method** | POST |

**Required fields:** `uuidPlugin` (path).

**Optional fields:** None.

**Validation:** Plugin must exist.

**Idempotency:** Not idempotent; each call generates new key.

**Returns:** `{ "id", "idOrg", "createdBy", "token" }`. **Store `token` securely; it may only be returned once.**

**Side effects:** New API key for private plugin.

**Gotchas:** Token shown once; store immediately.

---

## Workflows

### POST /workflows/{idWorkflow}/trigger — Trigger workflow

| Property | Value |
|----------|-------|
| **Endpoint** | POST /workflows/{idWorkflow}/trigger |
| **Method** | POST |

**Required fields:** Depends on workflow trigger type. At least one trigger field typically required.

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `triggerAppId` | number | For app-triggered workflows. |
| `triggerUserEmail` | string | For user-triggered workflows. |
| `triggerContractId` | number | For contract-triggered workflows. |
| `triggerLicenseName` | string | For license-triggered workflows. |
| `triggerLicenseAppId` | number | For license-triggered workflows. |

**Validation:** Provide only fields relevant to workflow's trigger type. Invalid/missing required data may return 400.

**Idempotency:** Not idempotent; each call triggers a new run.

**Returns:** `{ "success": true }` or similar.

**Side effects:** Workflow executes; actions vary by workflow configuration.

**Gotchas:** Different workflows require different trigger fields. Check workflow configuration.

---

### POST /appCatalog/triggerAppAccessRequestPolicy — Trigger app access request

| Property | Value |
|----------|-------|
| **Endpoint** | POST /appCatalog/triggerAppAccessRequestPolicy |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `triggerAppId` | number | **Required.** App ID. |
| `triggerUserEmail` | string | **Required.** User email requesting access. |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Reason for the access request. |

**Validation:** Both required fields must be present.

**Idempotency:** Not idempotent; each call creates new request.

**Returns:** `{ "success": true }` or similar.

**Side effects:** Triggers app access request workflow/policy.

**Gotchas:** Both `triggerAppId` and `triggerUserEmail` are required.

---

## GDPR

### POST /anonymizeRequest — Create anonymization request

| Property | Value |
|----------|-------|
| **Endpoint** | POST /anonymizeRequest |
| **Method** | POST |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | **Required.** Email of user to anonymize. |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `fields` | string[] | Specific fields to anonymize; omit to anonymize all. |

**Validation:** Email must exist.

**Idempotency:** Not idempotent; may return error if user already anonymized.

**Returns:** `{ "id", "status" }` (e.g., `pending`).

**Side effects:** **Destructive and irreversible.** Anonymizes user data for GDPR compliance.

**Gotchas:** Cannot be undone. Use `fields` to limit scope if needed.

---

## Integrations

### PUT /services/sync/custom — Sync custom integration

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /services/sync/custom |
| **Method** | PUT |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `idFile` | integer | **Required.** File ID. File must be uploaded first via `/files` endpoints. |
| `idAppAccount` | integer | **Required.** App account ID. |

**Optional fields:** None.

**Validation:** File must exist. App account must exist and be associated with custom integration.

**Idempotency:** Not idempotent; triggers sync.

**Returns:** Sync status or confirmation.

**Side effects:** Custom integration data synced from file.

**Gotchas:** Upload file first. Ensure file type matches integration expectations.

---

### PUT /services/sync/gluu — Sync Gluu integration

| Property | Value |
|----------|-------|
| **Endpoint** | PUT /services/sync/gluu |
| **Method** | PUT |

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| `idFile` | integer | **Required.** File ID. |
| `idAppAccount` | integer | **Required.** App account ID. |

**Optional fields:** None.

**Validation:** Same as custom sync. Specific to Gluu identity management.

**Idempotency:** Not idempotent; triggers sync.

**Returns:** Sync status or confirmation.

**Side effects:** Gluu identity data synced.

**Gotchas:** Use same file upload flow as custom integrations.
