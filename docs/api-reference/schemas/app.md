# App Schema

## Overview
The App object represents a SaaS application tracked by Torii. Apps are returned by the /apps endpoints and include license summaries, ownership, and metadata.

## Fields

| Field | Type | Description | Read-Only | Filterable |
|-------|------|-------------|-----------|------------|
| id | integer | Unique app identifier | Yes | Yes |
| isHidden | boolean | Whether the app is hidden from views | No | Yes |
| primaryOwner | PrimaryOwner | App owner details | No | No |
| name | string | App display name | No | Yes |
| state | string | App state | No | Yes |
| url | string | App URL | No | Yes |
| category | string | App category | No | Yes |
| description | string | App description | No | Yes |
| tags | string | Comma-separated tags | No | Yes |
| licenses | LicenseSummary | License summary and breakdown | Yes | No |

## PrimaryOwner Sub-Object

| Field | Type | Description |
|-------|------|-------------|
| firstName | string | Owner first name |
| lastName | string | Owner last name |
| photoUrl | string | Profile photo URL |
| lifecycleStatus | string | Enum: `active`, `offboarding`, `offboarded` |
| fullName | string | Full display name |
| isDeletedInIdentitySources | boolean | True if user has left the organization |
| id | integer | User ID |
| email | string | Email address |
| status | string | Enum: `active`, `invited`, `reporting`, `deleted` |

## LicenseSummary Sub-Object

| Field | Type | Description |
|-------|------|-------------|
| summary | LicenseSummaryFields | Aggregated license totals |
| types | LicenseType[] | Per-license-type breakdown |

## LicenseSummaryFields

| Field | Type | Description |
|-------|------|-------------|
| totalAmount | integer | Total license count |
| activeAmount | integer | Active licenses |
| inactiveAmount | integer | Inactive licenses |
| unassignedAmount | integer | Unassigned licenses |
| pricePerLicense | Currency | Price per license |
| annualCost | Currency | Total annual cost |
| potentialSavings | Currency | Potential savings |

## LicenseType

| Field | Type | Description |
|-------|------|-------------|
| name | string | License type name |
| totalAmount | integer | Total count |
| activeAmount | integer | Active count |
| inactiveAmount | integer | Inactive count |
| unassignedAmount | integer | Unassigned count |
| pricePerLicense | Currency | Price per license |
| annualCost | Currency | Annual cost |
| potentialSavings | Currency | Potential savings |
| totalAmountInOrgCurrency | integer | Total in org currency |
| activeAmountInOrgCurrency | integer | Active in org currency |
| inactiveAmountInOrgCurrency | integer | Inactive in org currency |
| unassignedAmountInOrgCurrency | integer | Unassigned in org currency |
| pricePerLicenseInOrgCurrency | Currency | Price in org currency |
| annualCostInOrgCurrency | Currency | Annual cost in org currency |
| potentialSavingsInOrgCurrency | Currency | Potential savings in org currency |

## Currency Sub-Object

| Field | Type | Description |
|-------|------|-------------|
| value | integer | Amount in cents (or smallest unit) |
| currency | string | ISO 4217 currency code |

## Writable Fields
The following fields can be updated via PUT /apps/{idApp}:

| Field | Notes |
|-------|-------|
| owner | DEPRECATED |
| isHidden | |
| name | |
| state | |
| url | |
| category | |
| description | |
| tags | |

## Example

```json
{
  "id": 100,
  "isHidden": false,
  "primaryOwner": {
    "firstName": "John",
    "lastName": "Smith",
    "photoUrl": "https://example.com/photo.jpg",
    "lifecycleStatus": "active",
    "fullName": "John Smith",
    "isDeletedInIdentitySources": false,
    "id": 5001,
    "email": "john.smith@company.com",
    "status": "active"
  },
  "name": "Slack",
  "state": "active",
  "url": "https://slack.com",
  "category": "Communication",
  "description": "Team messaging",
  "tags": "collaboration,messaging",
  "licenses": {
    "summary": {
      "totalAmount": 150,
      "activeAmount": 142,
      "inactiveAmount": 5,
      "unassignedAmount": 3,
      "pricePerLicense": { "value": 1500, "currency": "USD" },
      "annualCost": { "value": 225000, "currency": "USD" },
      "potentialSavings": { "value": 12000, "currency": "USD" }
    },
    "types": [
      {
        "name": "Business+",
        "totalAmount": 150,
        "activeAmount": 142,
        "inactiveAmount": 5,
        "unassignedAmount": 3,
        "pricePerLicense": { "value": 1500, "currency": "USD" },
        "annualCost": { "value": 225000, "currency": "USD" },
        "potentialSavings": { "value": 12000, "currency": "USD" }
      }
    ]
  }
}
```
