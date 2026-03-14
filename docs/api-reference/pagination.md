# Pagination

## Overview

Torii uses cursor-based pagination for list endpoints that return large datasets. Instead of page numbers, you pass a `cursor` value to fetch the next batch of results. Continue until no `nextCursor` is returned. If pagination is not mentioned for an endpoint, the full list is returned in a single response.

## How It Works

1. Make an initial request to a list endpoint (optionally with `size` to control page size).
2. Inspect the response for `nextCursor`.
3. If `nextCursor` is present, pass it as the `cursor` query parameter to get the next page.
4. Repeat until `nextCursor` is null or absent.

## Parameters

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `size`    | number | Number of items per page (controls page size)    |
| `cursor`  | string | Opaque cursor from the previous response's `nextCursor` |

## Response Fields

Paginated responses include:

| Field       | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `items`     | array  | Array of resources (e.g., `users`, `apps`) |
| `count`     | number | Number of items in this response         |
| `total`     | number | Total number of items across all pages   |
| `nextCursor`| string | Cursor for the next page, or null if done |

## Example Flow

**Initial request:**

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.toriihq.com/v1.0/users?size=100"
```

**Response:**

```json
{
  "users": [
    { "id": "1", "email": "alice@example.com", "name": "Alice" },
    { "id": "2", "email": "bob@example.com", "name": "Bob" }
  ],
  "count": 100,
  "total": 253,
  "nextCursor": "WzE6NjM1Mzg4NTcsIjY1NFMyMyJd"
}
```

**Next page request:**

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.toriihq.com/v1.0/users?size=100&cursor=WzE6NjM1Mzg4NTcsIjY1NFMyMyJd"
```

Continue paginating until the response has no `nextCursor` or `nextCursor` is null.

## Endpoints Supporting Pagination

- `/users`
- `/apps`
- `/contracts`
- `/audit`
- `/apps/{id}/users`
- `/workflows/actionExecutions`

## Notes

- If an endpoint does not document pagination, it returns the full list in one response.
- The `size` parameter is optional; endpoints may use a default page size if omitted.
- Cursors are opaque; do not parse or modify them.
