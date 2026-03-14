# Contract Schema

## Overview
The Contract object represents a SaaS contract in Torii. Contracts link apps to agreements and support custom fields. The schema in the API spec is minimal; additional fields may be available via the /contracts/fields and /contracts/metadata endpoints.

## Fields

| Field | Type | Description | Read-Only | Filterable |
|-------|------|-------------|-----------|------------|
| id | integer | Unique contract identifier | Yes | Yes |
| name | string | Contract name | No | Yes |
| status | string | Contract status | No | Yes |
| idApp | integer | Associated app ID | No | Yes |

## Creation (POST /contracts)

Required fields when creating a contract:

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| idApp | integer | Yes |
| status | string | Yes |

## Update (PUT /contracts/{idContract})

| Field | Type | Required |
|-------|------|----------|
| idApp | integer | No (optional) |
| name | string | No |
| status | string | No |
| Custom fields | varies | No |

## Custom Fields
Contracts support custom fields. Use the /contracts/fields endpoint to discover available custom fields and their types. Use /contracts/metadata for contract metadata schema.

## Example

```json
{
  "id": 42,
  "name": "Slack Enterprise Agreement 2024",
  "status": "active",
  "idApp": 100
}
```

## Notes
- The actual contract object returned by the API may include additional fields beyond the minimal schema above.
- Query /contracts/fields to list all contract fields (standard and custom).
- Query /contracts/metadata for contract metadata structure.
