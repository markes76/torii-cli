# Rate Limits

## Overview

Torii enforces rate limits per endpoint to ensure fair usage and system stability. Each endpoint may have its own limit. When you exceed the limit, the API returns `429 Too Many Requests`. Use the rate limit headers to monitor usage and implement backoff when approaching or hitting limits.

## Rate Limit Headers

Responses include standard rate limit headers:

| Header                  | Description                                      |
|-------------------------|--------------------------------------------------|
| `X-Rate-Limit-Limit`    | Maximum requests allowed in the current window   |
| `X-Rate-Limit-Remaining`| Number of requests remaining in the window       |
| `X-Rate-Limit-Reset`    | Unix epoch timestamp when the limit resets      |

**Example response headers:**

```
X-Rate-Limit-Limit: 1000
X-Rate-Limit-Remaining: 847
X-Rate-Limit-Reset: 1710432000
```

## Handling 429

When you exceed the rate limit, the API returns:

- **Status:** `429 Too Many Requests`
- **Retry-After:** Header indicating seconds to wait before retrying (when provided)

**Example 429 response:**

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please retry after 60 seconds."
}
```

## Backoff Strategy

1. **Check `Retry-After`:** If present, wait at least that many seconds before retrying.
2. **Exponential backoff:** If `Retry-After` is absent, wait and double the delay on each retry (e.g., 1s, 2s, 4s, 8s).
3. **Cap retries:** Avoid infinite retry loops; stop after a reasonable number of attempts.
4. **Use `X-Rate-Limit-Reset`:** When available, wait until the reset time before sending more requests.

## Best Practices

- **Cache responses:** Cache data that does not change frequently to reduce API calls.
- **Throttle requests:** Space out requests and avoid burst traffic; use a queue or rate limiter in your client.
- **Monitor usage:** Track `X-Rate-Limit-Remaining` and slow down when it drops.
- **Batch when possible:** Prefer bulk or batch endpoints over many single-item calls.
- **Example limit:** Some endpoints allow around 1000 requests per minute; check headers for actual limits.
