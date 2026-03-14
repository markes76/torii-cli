# Field Reference

Complete list of all queryable/filterable fields per entity, based on the OpenAPI spec schemas. Use the `fields` query parameter to select specific fields on list and get-by-ID endpoints.

---

## User Fields

| Field | Type | Filterable | Notes |
|-------|------|------------|-------|
| `id` | string | ✓ | User ID |
| `idOrg` | string | ✓ | Organization ID |
| `firstName` | string | ✓ | |
| `lastName` | string | ✓ | |
| `email` | string | ✓ | Primary email |
| `creationTime` | string (ISO 8601) | ✓ | |
| `idRole` | string | ✓ | Role ID |
| `role` | object | ✓ | Role details |
| `lifecycleStatus` | string | ✓ | `active`, `offboarding`, `offboarded` |
| `isDeletedInIdentitySources` | boolean | ✓ | |
| `isExternal` | boolean | ✓ | |
| `activeAppsCount` | number | ✓ | |
| `additionalEmails` | array | ✓ | Secondary emails |

**Custom fields:** Use the `/users/fields` endpoint to discover custom fields. Custom fields use the `c_` prefix pattern (e.g., `c_department`, `c_cost_center`).

---

## App Fields

| Field | Type | Filterable | Notes |
|-------|------|-------------|-------|
| `id` | string | ✓ | App ID |
| `isHidden` | boolean | ✓ | |
| `primaryOwner` | object | ✓ | Use `primaryOwner` in filters |
| `name` | string | ✓ | |
| `state` | string | ✓ | App state |
| `url` | string | ✓ | |
| `category` | string | ✓ | |
| `description` | string | ✓ | |
| `tags` | array | ✓ | |
| `licenses` | object/array | ✓ | License info |
| `creationTime` | string | ✓ | |
| `sources` | array | ✓ | Discovery sources |

**Sub-fields for `primaryOwner`:**

| Sub-field | Type |
|-----------|------|
| `primaryOwner.id` | string |
| `primaryOwner.email` | string |
| `primaryOwner.lifecycleStatus` | string |

**Custom fields:** Use the `/apps/fields` endpoint to discover custom fields.

---

## Contract Fields

| Field | Type | Filterable | Notes |
|-------|------|-------------|-------|
| `id` | string | ✓ | Contract ID |
| `name` | string | ✓ | |
| `status` | string | ✓ | Contract status |
| `idApp` | string | ✓ | Linked app ID |

**Custom fields:** Use the `/contracts/fields` endpoint to discover custom fields.

---

## Audit Fields

| Field | Type | Filterable | Notes |
|-------|------|-------------|-------|
| `performedBy` | string | ✗ | User ID who performed action |
| `performedByEmail` | string | ✗ | Email of performer |
| `creationTime` | string | ✗ | When the audit event occurred |
| `type` | string | ✗ | Audit event type |

**Note:** The audit endpoint does not support `fields`, `sort`, `order`, or `filters`. Use `size` and `cursor` for pagination only.

---

## Role Fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Role ID |
| `systemKey` | string | System identifier |
| `name` | string | Display name |
| `description` | string | Role description |
| `isAdmin` | boolean | Admin role flag |
| `usersCount` | number | Number of users with this role |

**Note:** GET /roles does not accept query parameters.

---

## SCIM User Fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | SCIM user ID |
| `userName` | string | Email (immutable after creation) |
| `name.familyName` | string | Last name |
| `name.givenName` | string | First name |
| `active` | boolean | Account active status |
| `emails` | array | Email addresses |
| `userType` | string | User type |
| `meta.created` | string | Creation timestamp |

**Note:** SCIM endpoints use different pagination (`startIndex`, `itemsPerPage`, `totalResults`) and do not support `fields`, `sort`, `order`, or `filters` query params.

---

## Workflow Fields

Workflow fields vary by endpoint and workflow configuration:

- **GET /workflows/actionExecutions:** Returns execution records with context-dependent fields
- **GET /workflows/audit:** Returns audit records
- **POST /workflows/{id}/trigger:** Accepts different fields based on the workflow's configured trigger type; irrelevant fields are ignored

---

## Metadata Endpoints

> **Important:** The `/metadata` endpoints return the complete current field list for each entity, which may include fields not documented in the OpenAPI spec. Always call these when building dynamic field selection or filters:
>
> - GET /users/metadata
> - GET /apps/metadata
> - GET /contracts/metadata
