# Custom Fields

Custom fields extend Torii entities (apps, users, contracts) with organization-specific data. This document covers patterns, types, discovery, and creation.

---

## Custom Field Patterns

- **Prefix:** Custom fields use the `c_` prefix in their system key (e.g., `c_department`, `c_cost_center`, `c_region`)
- **Management:** Managed via `/apps/fields`, `/users/fields`, and `/contracts/fields` endpoints
- **Usage:** Custom fields appear in API responses alongside standard fields and can be used in filters
- **Discovery:** Call the appropriate `fields` or `metadata` endpoint to get the current list

---

## Field Types

| Type | Description |
|------|-------------|
| `multiLine` | Multi-line text |
| `number` | Numeric value |
| `datePicker` | Date value |
| `dropdown` | Single-select from options |
| `dropdownMulti` | Multi-select from options |
| `user` | Reference to a user |
| `usersPersonal` | Personal user reference |
| `singleLine` | Single-line text |
| `email` | Email address |
| `currency` | Currency value |
| `cardNumber` | Card/payment number |

---

## Discovering Custom Fields

| Entity | Endpoint | Returns |
|--------|----------|---------|
| Apps | GET /apps/fields | Custom field definitions |
| Users | GET /users/fields | Custom field definitions |
| Contracts | GET /contracts/fields | Custom field definitions |

**Metadata endpoints** return both predefined and custom field definitions:

| Entity | Endpoint |
|--------|----------|
| Apps | GET /apps/metadata |
| Users | GET /users/metadata |
| Contracts | GET /contracts/metadata |

---

## Creating Custom Fields (via API)

**Apps only** (POST /apps/fields):

```json
{
  "name": "required",
  "type": "required",
  "formQuestion": "optional",
  "idGroup": "optional",
  "options": "optional (for dropdown types)"
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `name` | ✓ | Display name / system key |
| `type` | ✓ | One of the field types above |
| `formQuestion` | | Form label text |
| `idGroup` | | Group ID for organization |
| `options` | | Options for dropdown/dropdownMulti |

**Note:** Users and contracts custom fields are typically managed in the Torii UI; creation via API may be limited.

---

## User Fields Metadata Structure

The metadata endpoints return a structured response:

### predefinedFields

Array of objects with:

| Property | Description |
|----------|-------------|
| `name` | Field name |
| `systemKey` | System identifier for filters |
| `type` | Field type |
| `filterType` | Type used in filter operations |
| `filterSystemKey` | Key for filter expressions |
| `relatedFields` | Associated fields |
| `scopes` | Permission scopes |
| `feature` | Feature flag if applicable |

### customFields

Array of objects with:

| Property | Description |
|----------|-------------|
| `idField` | Custom field ID |
| `systemKey` | System key (c_ prefix) |
| `isShown` | Visibility flag |
| `idOrg` | Organization ID |
| `sourceIdApp` | Source app if app-scoped |
| `name` | Display name |
| `type` | Field type |
| `isDeleted` | Soft-delete flag |
| `relatedFields` | Associated fields |

---

## Scopes for Fields

Fields have associated permission scopes. The scopes enum includes:

| Scope | Description |
|-------|-------------|
| `member` | Basic member access |
| `members-and-roles:read` | Read members and roles |
| `members-and-roles:write` | Write members and roles |
| `api-management:read` | Read API config |
| `api-management:write` | Write API config |
| `settings:read` | Read settings |
| `settings:write` | Write settings |
| `applications:read` | Read applications |
| `applications:write` | Write applications |
| `contracts:read` | Read contracts |
| `contracts:write` | Write contracts |
| `license-and-chargeback:read` | Read license/chargeback |
| `license-and-chargeback:write` | Write license/chargeback |
| `expense:read` | Read expense data |
| `expense:write` | Write expense data |

Additional scopes may exist; check the metadata response for the full list per field.
