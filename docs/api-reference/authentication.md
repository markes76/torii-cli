# Authentication

## Overview

All Torii API requests require authentication via a Bearer token in the `Authorization` header. API keys are generated from the Torii dashboard and must be included with every request. The API supports two key types: standard API keys for general endpoints and SCIM-specific keys for identity provisioning.

## API Key Types

### Standard API Keys

Standard API keys authenticate requests to the main Torii API (e.g., `/orgs`, `/users`, `/apps`, `/contracts`). Generate these from the **API Access** page in your Torii workspace.

### SCIM API Keys

The SCIM API uses a separate endpoint (`https://api.toriihq.com/v1.0/scim/v2`) and requires its own API key. SCIM keys must be enabled on the **Security** page in Torii. Use SCIM keys only when calling SCIM endpoints for user provisioning and identity management.

## Header Format

The security scheme uses an `apiKey` type in the header:

- **Header name:** `Authorization`
- **Format:** `Bearer API_KEY`
- **x-bearer-format:** `bearer`

## Example Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.toriihq.com/v1.0/orgs/my
```

## Key Management

- **Generate keys:** [API Access](https://app.toriihq.com/team/settings/apiAccess)
- **SCIM keys:** Enable and manage from the Security page
- Store API keys securely and never commit them to version control
- Rotate keys periodically and revoke compromised keys immediately

## Security Notes

- Treat API keys as secrets; they grant full access to your Torii data
- Use environment variables or a secrets manager instead of hardcoding keys
- Different keys may have different scopes; verify permissions before use
- SCIM keys are scoped to the SCIM endpoint only

## Version Header

Some Torii endpoints expect the `X-API-VERSION: 1.1` header. Include this header when calling endpoints that document it, for example:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "X-API-VERSION: 1.1" \
     https://api.toriihq.com/v1.0/orgs/my
```
