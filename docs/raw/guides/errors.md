# Errors

> Source: https://developers.toriihq.com/reference/errors

## Errors   [Skip link to Errors](https://developers.toriihq.com/reference/errors\#errors)

Torii uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the `2xx` range indicate success. Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, invalid payload, etc.). Codes in the 5xx range indicate an error with Torii's servers.

Example:

json

```text
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Missing required query parameter 'state'"
}
```

Updated 6 months ago

* * *

Did this page help you?

Yes

No

Updated 6 months ago

* * *

Did this page help you?

Yes

No