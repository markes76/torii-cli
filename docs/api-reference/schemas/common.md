# Common / Shared Types

## Overview
This document describes shared types used across multiple Torii API endpoints and schemas.

---

## Currency

Used for monetary values (prices, costs, savings).

| Field | Type | Description |
|-------|------|-------------|
| value | integer | Amount in cents (or smallest currency unit) |
| currency | string | ISO 4217 currency code (e.g., "USD", "EUR") |

**Example:**
```json
{ "value": 1500, "currency": "USD" }
```

---

## Pagination Response Fields

Common fields on paginated list responses.

| Field | Type | Description |
|-------|------|-------------|
| count | integer | Number of items in the current page |
| total | integer | Total number of items across all pages |
| nextCursor | string | Cursor for the next page (omit if no more pages) |

---

## Error Response

Standard error response shape.

| Field | Type | Description |
|-------|------|-------------|
| statusCode | integer | HTTP status code |
| error | string | Error type/code |
| message | string | Human-readable error message |

**Example:**
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "User not found"
}
```

---

## Standard Response

Generic success response.

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Whether the operation succeeded |

---

## Field Object

Represents a field definition (e.g., for custom fields, metadata).

| Field | Type | Description |
|-------|------|-------------|
| id | string/integer | Field identifier |
| name | string | Display name |
| systemKey | string | System key for the field |
| type | string | Field data type |
| options | Option[] | For enum/select fields, available options |

---

## Option Object

Represents an option in a select/enum field.

| Field | Type | Description |
|-------|------|-------------|
| value | string | Option value |
| label | string | Display label |

---

## SCIM Schemas

Torii supports SCIM (System for Cross-domain Identity Management) for user provisioning. The following types are used in SCIM endpoints.

### SCIMUser

Standard SCIM user representation.

### SCIMNameSchema

| Field | Type | Description |
|-------|------|-------------|
| givenName | string | First name |
| familyName | string | Last name |
| formatted | string | Full formatted name |

### SCIMEmail

| Field | Type | Description |
|-------|------|-------------|
| value | string | Email address |
| type | string | Email type (e.g., "work") |
| primary | boolean | Whether this is the primary email |

### SCIMMetaSchema

| Field | Type | Description |
|-------|------|-------------|
| resourceType | string | "User" |
| location | string | Resource URL |
| created | string | Creation timestamp |
| lastModified | string | Last modification timestamp |

### SCIMResponse

Standard SCIM list/response wrapper with `Resources`, `totalResults`, `startIndex`, `itemsPerPage`.

### SCIMCreateUser

Request body for creating a user via SCIM (POST).

### SCIMUpdateUser

Request body for updating a user via SCIM (PUT).

### SCIMPATCHRequest

Request body for partial user updates via SCIM (PATCH). Uses JSON Patch (RFC 6902) format with `Operations` array.
