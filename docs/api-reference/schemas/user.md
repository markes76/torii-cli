# User Schema

## Overview
The User object represents any user detected by Torii, including admins. Users are returned by the /users endpoints and referenced by other entities.

## Fields

| Field | Type | Description | Read-Only | Filterable |
|-------|------|-------------|-----------|------------|
| id | integer | Unique user identifier | Yes | Yes |
| idOrg | number | Organization ID | Yes | Yes |
| firstName | string | First name | Yes | Yes |
| lastName | string | Last name | Yes | Yes |
| email | string | Email address | Yes | Yes |
| creationTime | string (ISO 8601) | When the user was first detected | Yes | Yes |
| idRole | number | Role ID | Yes | Yes |
| role | string | Role name | Yes | Yes |
| lifecycleStatus | string | Lifecycle status. Enum: `active`, `offboarding`, `offboarded` | No (writable via PUT) | Yes |
| isDeletedInIdentitySources | boolean | True if user has left the organization | Yes | Yes |
| isExternal | boolean | True if external user | Yes | Yes |
| activeAppsCount | integer | Number of active applications | Yes | Yes |
| additionalEmails | string[] | Additional email addresses | Yes | No |

## Writable Fields
Only `lifecycleStatus` can be updated via PUT /users/{idUser}.

## Example

```json
{
  "id": 12345,
  "idOrg": 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@company.com",
  "creationTime": "2024-01-15T10:30:00.000Z",
  "idRole": 2,
  "role": "Admin",
  "lifecycleStatus": "active",
  "isDeletedInIdentitySources": false,
  "isExternal": false,
  "activeAppsCount": 24,
  "additionalEmails": ["j.doe@company.com"]
}
```

## Custom Fields
Users support custom fields with the `c_` prefix pattern.
