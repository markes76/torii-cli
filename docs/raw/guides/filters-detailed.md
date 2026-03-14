# Filters Guide (Scraped from Torii Developer Docs)

> Source: https://developers.toriihq.com/reference/filters

The API provides methods for listing resources. For example, you can list apps, list users, and list contracts. Where filters are supported, these API list methods share a common structure for filters.

## Why use Filters?

By combining multiple filters (in an `AND` relation) and utilizing the different operations, you can execute a wide variety of calls to help you achieve the exact response you're looking for.

For simpler use cases, use basic `key=value` filters.

While both types of filters can be used in conjunction, we recommend using only one.

## High-level schema

```json
{
  "key": "the field to filter",
  "op": "see list of available operations below",
  "value": "the value to match"
}
```

## Available operations

- equals
- notEquals
- contains
- notContains
- anyOf
- noneOf
- allOf
- isExactly
- isSet
- isNotSet
- gt (greater than)
- gte (greater than or equal)
- lt (less than)
- lte (less than or equal)
- dayAfter
- dayOnOrAfter
- dayBefore
- dayOnOrBefore
- nested
- relativeDateToday
- relativeDateOn
- relativeDateLess
- relativeDateMore
- exists
- notExists
- or
- and

## Example

_Find all apps whose primary owner is user ID 1 AND discovered after August 3rd, 2024_

```json
[
  {
    "key": "primaryOwner",
    "op": "equals",
    "value": 1
  },
  {
    "key": "creationTime",
    "op": "gt",
    "value": "2024-08-03T09:40:20.000Z"
  }
]
```

### cURL

```bash
curl 'https://api.toriihq.com/v1.0/apps?filters=[{"key":"primaryOwner","op":"equals","value":1},{"key":"creationTime","op":"gt","value":"2024-08-03T09:40:20.000Z"}]' \
--header 'X-API-VERSION: 1.1' \
--header 'Authorization: Bearer <API_KEY>'
```

### JavaScript

```javascript
const myHeaders = new Headers();
myHeaders.append("X-API-VERSION", "1.1");
myHeaders.append("Authorization", "Bearer <API_KEY>");

const filters = JSON.stringify([
  { key: "primaryOwner", op: "equals", value: 1 },
  { key: "creationTime", op: "gt", value: "2024-08-03T09:40:20.000Z" }
])

const response = await fetch(`https://api.toriihq.com/v1.0/apps?filters=${encodeURIComponent(filters)}`)
const data = await response.json()
```
