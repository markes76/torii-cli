# License Schema

## Overview
License data is embedded within App objects rather than exposed as a standalone API resource. The `licenses` field on an App contains a LicenseSummary with aggregated totals and a per-type breakdown (LicenseType).

## LicenseSummary

Top-level container for license data on an App.

| Field | Type | Description |
|-------|------|-------------|
| summary | LicenseSummaryFields | Aggregated license totals across all types |
| types | LicenseType[] | Per-license-type breakdown |

## LicenseSummaryFields

| Field | Type | Description |
|-------|------|-------------|
| totalAmount | integer | Total license count |
| activeAmount | integer | Active licenses in use |
| inactiveAmount | integer | Inactive licenses |
| unassignedAmount | integer | Unassigned licenses |
| pricePerLicense | Currency | Price per license |
| annualCost | Currency | Total annual cost |
| potentialSavings | Currency | Potential savings |

## LicenseType

| Field | Type | Description |
|-------|------|-------------|
| name | string | License type name (e.g., "Business+", "Pro") |
| totalAmount | integer | Total license count |
| activeAmount | integer | Active count |
| inactiveAmount | integer | Inactive count |
| unassignedAmount | integer | Unassigned count |
| pricePerLicense | Currency | Price per license |
| annualCost | Currency | Annual cost |
| potentialSavings | Currency | Potential savings |
| totalAmountInOrgCurrency | integer | Total in organization currency |
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
| currency | string | ISO 4217 currency code (e.g., "USD") |

## Example

```json
{
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
```

## Notes
- Licenses are not a standalone API resource. Access license data via GET /apps or GET /apps/{idApp}.
- The `InOrgCurrency` variants on LicenseType use the organization's configured currency for reporting.
