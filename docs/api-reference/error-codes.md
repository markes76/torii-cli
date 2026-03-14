# Error Codes

## Overview

The Torii API uses conventional HTTP status codes to indicate success or failure. Client errors (4xx) and server errors (5xx) return a structured JSON body with `statusCode`, `error`, and `message` fields. Use these to diagnose issues and implement robust error handling in your client.

## Error Response Format

All error responses follow this schema:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Missing required query parameter 'state'"
}
```

| Field       | Type    | Description                          |
|-------------|---------|--------------------------------------|
| `statusCode`| integer | HTTP status code                     |
| `error`     | string  | Short error description/category     |
| `message`   | string  | Detailed message for debugging      |

## HTTP Status Codes

| Code | Meaning              | When It Occurs                          | How to Fix                                      |
|------|----------------------|-----------------------------------------|-------------------------------------------------|
| 200  | OK                   | Request succeeded, data returned        | —                                               |
| 201  | Created              | Resource created successfully           | —                                               |
| 400  | Bad Request          | Invalid parameters, malformed request   | Check request body and query parameters         |
| 401  | Unauthorized         | Missing or invalid API key              | Add valid `Authorization: Bearer API_KEY`       |
| 403  | Forbidden            | Valid key but insufficient permissions  | Use a key with required scope or contact admin  |
| 404  | Not Found            | Resource or endpoint does not exist      | Verify URL, ID, and resource existence          |
| 422  | Unprocessable Entity | Validation failed on request data        | Fix payload (e.g., invalid format, constraints) |
| 429  | Too Many Requests    | Rate limit exceeded                     | Wait and retry; use `Retry-After` if present    |
| 500  | Internal Server Error| Server-side failure                     | Retry later; contact support if persistent      |

## Common Error Patterns

**Missing required parameter:**

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Missing required query parameter 'state'"
}
```

**Invalid or expired API key:**

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired API key"
}
```

**Resource not found:**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "User with id 'xyz' not found"
}
```

**Validation failure:**

```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": "Invalid email format for field 'email'"
}
```

## Troubleshooting

1. **401 Unauthorized:** Ensure the `Authorization` header is set and the API key is valid and not revoked.
2. **403 Forbidden:** Confirm your API key has the required permissions for the endpoint.
3. **400 Bad Request:** Validate query parameters and request body against the endpoint documentation.
4. **404 Not Found:** Double-check resource IDs and that the resource exists in your workspace.
5. **429 Too Many Requests:** Implement backoff, caching, and request throttling.
6. **500 Internal Server Error:** Retry with exponential backoff; if it persists, contact Torii support.
