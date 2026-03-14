# Known Quirks

API quirks, gotchas, and undocumented behaviors. **Read this first** — it saves hours of debugging.

---

## 1. Filter Encoding

Filters must be URL-encoded JSON arrays. The `filters` param is a JSON string, not query params.

**Example:** `?filters=[{"key":"primaryOwner","op":"equals","value":1}]` must be encoded.

**Correct:** `?filters=%5B%7B%22key%22%3A%22primaryOwner%22%2C%22op%22%3A%22equals%22%2C%22value%22%3A1%7D%5D`

---

## 2. Currency Values in Cents

All currency fields (`pricePerLicense`, `annualCost`, `potentialSavings`) store values in the smallest currency unit (cents). Divide by 100 for display.

---

## 3. Owner Field Deprecated

The `owner` field on apps is deprecated. Use `primaryOwner` instead for both reading and writing.

---

## 4. lifecycleStatus Is the Only Writable User Field

PUT /users/{idUser} only accepts `lifecycleStatus`. You cannot update other user fields via the API.

---

## 5. SCIM Requires Separate API Key

SCIM endpoints need a dedicated API key enabled on the Security page, not the standard API key.

---

## 6. X-API-VERSION Header

Some endpoints behave differently with `X-API-VERSION: 1.1`. The filters and aggregations features may require this header.

---

## 7. Pagination Inconsistency

- **REST:** `size`, `cursor`, `nextCursor`
- **SCIM:** `startIndex`, `itemsPerPage`, `totalResults`

The CLI should normalize this for a consistent user experience.

---

## 8. Match Apps Returns searchedBy

POST /apps/match includes the original search term as `searchedBy` in each result, useful for bulk matching.

---

## 9. Delete Operations Have No Response Body

DELETE endpoints typically return 200 with no body, not 204 No Content.

---

## 10. Custom Field Prefix

Custom fields use `c_` prefix in the system key but may have different display names.

---

## 11. Aggregation Size Limit

Aggregation buckets are hard-limited to 100 via the `size` parameter.

---

## 12. SCIM userName Immutable After Creation

Once a SCIM user is created, their `userName` (email) cannot be changed.

---

## 13. File Upload Two-Step Process

Uploading files requires:

1. **GET /files/url** — Get pre-signed URL parameters
2. **Upload** — Upload to the pre-signed URL
3. **POST /files** — Register the file in Torii's DB

**OR** use **POST /files/upload** for files under 3MB (single-step).

---

## 14. Workflow Trigger Fields Are Context-Dependent

POST /workflows/{id}/trigger accepts different fields based on the workflow's configured trigger type. Sending irrelevant fields is not an error but they're ignored.

---

## 15. Aggregations Only on List Endpoints

The `aggs` parameter only works on GET /apps and GET /users (and possibly GET /contracts). Other list endpoints don't support aggregations.

---

## 16. Boolean Filter Values

For boolean fields, filter values should be `true`/`false` strings, not 1/0.

---

## 17. Concurrent Rate Limits per Endpoint

Rate limits are per-endpoint, not global. Each endpoint has its own limit window.
