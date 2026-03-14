# Complete CLI Command Map

## Overview

This document maps every Torii API endpoint at `https://api.toriihq.com/v1.0` to a CLI command. Commands are organized by resource. Each command includes the API endpoint, HTTP method, operation type (READ/WRITE), and description.

---

## Organization

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii org get` | GET /orgs/my | GET | READ | Get authenticated organization profile |

---

## Users

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii users list` | GET /users | GET | READ | List users with filters, sort, pagination |
| `torii users get <id>` | GET /users/{idUser} | GET | READ | Get single user by ID |
| `torii users update <id>` | PUT /users/{idUser} | PUT | WRITE | Update user lifecycle status |
| `torii users metadata` | GET /users/metadata | GET | READ | List user field metadata |
| `torii users fields` | GET /users/fields | GET | READ | List user custom field definitions |

**Flags for `torii users list`:** `--fields`, `--sort`, `--order`, `--size`, `--cursor`, `--filters`, `--output`

**Flags for `torii users get`:** `--fields`, `--output`

**Flags for `torii users update`:** `--lifecycle-status` (required: active\|offboarding\|offboarded), `--confirm`

---

## User Applications

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii users apps <userId>` | GET /users/{idUser}/apps | GET | READ | List apps for a user |
| `torii users apps get <userId> <appId>` | GET /users/{idUser}/apps/{idApp} | GET | READ | Get user-app relationship |
| `torii users apps update <userId> <appId>` | PUT /users/{idUser}/apps/{idApp} | PUT | WRITE | Update user-app (e.g., mark removed) |

**Flags for `torii users apps update`:** `--removed` (bool), `--confirm`

---

## Apps

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii apps list` | GET /apps | GET | READ | List apps with filters, sort, pagination |
| `torii apps get <id>` | GET /apps/{idApp} | GET | READ | Get single app by ID |
| `torii apps search <name>` | GET /apps/search | GET | READ | Search apps in catalog by name |
| `torii apps add <catalogId>` | POST /apps | POST | WRITE | Add app from catalog by ID |
| `torii apps create` | POST /apps/custom | POST | WRITE | Create custom app |
| `torii apps update <id>` | PUT /apps/{idApp} | PUT | WRITE | Update app metadata |
| `torii apps match` | POST /apps/match | POST | WRITE | Match app names to catalog |
| `torii apps users <appId>` | GET /apps/{idApp}/users | GET | READ | List users for an app |

**Flags for `torii apps list`:** `--fields`, `--sort`, `--order`, `--size`, `--cursor`, `--filters`, `--aggs`, `--output`

**Flags for `torii apps get`:** `--fields`, `--output`

**Flags for `torii apps create`:** `--name`, `--state`, `--url`, `--category`, `--description`, `--tags`

**Flags for `torii apps update`:** `--name`, `--state`, `--url`, `--category`, `--description`, `--tags`, `--is-hidden`

**Flags for `torii apps match`:** `--names` (comma-separated)

**Flags for `torii apps users`:** `--size`, `--cursor`, `--status`, `--output`

---

## App Fields

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii apps fields list` | GET /apps/fields | GET | READ | List app field definitions |
| `torii apps fields create` | POST /apps/fields | POST | WRITE | Create custom app field |
| `torii apps fields update <id>` | PUT /apps/fields/{idField} | PUT | WRITE | Update app field |
| `torii apps fields delete <id>` | DELETE /apps/fields/{idField} | DELETE | WRITE | Delete app field |
| `torii apps fields metadata` | GET /apps/metadata | GET | READ | List app field metadata |

**Flags for `torii apps fields create`:** `--name`, `--type`, `--form-question`, `--id-group`, `--options`

**Flags for `torii apps fields delete`:** `--confirm`

---

## Contracts

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii contracts list` | GET /contracts | GET | READ | List contracts |
| `torii contracts get <id>` | GET /contracts/{idContract} | GET | READ | Get single contract |
| `torii contracts create` | POST /contracts | POST | WRITE | Create contract |
| `torii contracts update <id>` | PUT /contracts/{idContract} | PUT | WRITE | Update contract |
| `torii contracts delete <id>` | DELETE /contracts/{idContract} | DELETE | WRITE | Delete contract |
| `torii contracts fields` | GET /contracts/fields | GET | READ | List contract field definitions |
| `torii contracts metadata` | GET /contracts/metadata | GET | READ | List contract field metadata |

**Flags for `torii contracts list`:** `--fields`, `--sort`, `--order`, `--size`, `--cursor`, `--filters`, `--output`

**Flags for `torii contracts create`:** `--name`, `--app-id`, `--status` (all required)

**Flags for `torii contracts delete`:** `--confirm`

---

## Audit

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii audit list` | GET /audit | GET | READ | List admin audit logs |

**Flags for `torii audit list`:** `--size`, `--cursor`, `--output`

---

## Roles

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii roles list` | GET /roles | GET | READ | List organization roles |

**Flags for `torii roles list`:** `--output`

---

## Workflows

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii workflows executions` | GET /workflows/actionExecutions | GET | READ | List workflow action execution logs |
| `torii workflows history` | GET /workflows/audit | GET | READ | List workflow edit audit trail |
| `torii workflows run <id>` | POST /workflows/{idWorkflow}/trigger | POST | WRITE | Trigger workflow manually |
| `torii workflows request-access` | POST /appCatalog/triggerAppAccessRequestPolicy | POST | WRITE | Trigger app access request policy |

**Flags for `torii workflows executions`:** `--size`, `--cursor`, `--output`

**Flags for `torii workflows history`:** `--size`, `--cursor`, `--output`

**Flags for `torii workflows run`:** `--app-id`, `--user-email`, `--contract-id`, `--license-name`, `--license-app-id`

**Flags for `torii workflows request-access`:** `--app-id` (required), `--user-email` (required), `--description`

---

## SCIM

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii scim resource-types` | GET /scim/v2/ResourceTypes | GET | READ | List SCIM resource types |
| `torii scim schemas` | GET /scim/v2/Schemas | GET | READ | List SCIM schemas |
| `torii scim config` | GET /scim/v2/ServiceProviderConfig | GET | READ | Get SCIM service provider config |
| `torii scim users list` | GET /scim/v2/Users | GET | READ | List SCIM users |
| `torii scim users get <id>` | GET /scim/v2/Users/{idUser} | GET | READ | Get SCIM user by ID |
| `torii scim users create` | POST /scim/v2/Users | POST | WRITE | Create SCIM user |
| `torii scim users update <id>` | PUT /scim/v2/Users/{idUser} | PUT | WRITE | Full update of SCIM user |
| `torii scim users patch <id>` | PATCH /scim/v2/Users/{idUser} | PATCH | WRITE | Partial update of SCIM user |
| `torii scim users delete <id>` | DELETE /scim/v2/Users/{idUser} | DELETE | WRITE | Delete SCIM user |

**Flags for `torii scim users create`:** `--username` (required), `--given-name`, `--family-name`, `--role`, `--active`

**Flags for `torii scim users patch`:** `--op`, `--path`, `--value` (or JSON body)

**Flags for `torii scim users delete`:** `--confirm`

---

## Files

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii files upload-url` | GET /files/url | GET | READ | Get pre-signed upload URL parameters |
| `torii files get <id>` | GET /files/{id} | GET | READ | Get file metadata |
| `torii files download <id>` | GET /files/{id}/download | GET | READ | Download file content |
| `torii files store` | POST /files | POST | WRITE | Store file metadata in DB |
| `torii files upload <filepath>` | POST /files/upload | POST | WRITE | Upload file (multipart, max 3MB) |

**Flags for `torii files store`:** `--path`, `--type` (both required)

**Flags for `torii files upload`:** `--output-path` (where to save response)

---

## Parsings

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii parsings get <id>` | GET /parsings/{id} | GET | READ | Get parsing request status |
| `torii parsings auto` | PUT /parsings/automatic | PUT | WRITE | Parse file automatically |
| `torii parsings manual` | PUT /parsings/manual | PUT | WRITE | Parse file with manual config |

**Flags for `torii parsings auto`:** `--file-id` (required)

**Flags for `torii parsings manual`:** `--file-id`, `--transaction-date-column`, `--description-column`, `--amount-column`, `--date-format`, `--currency-column`, `--reporting-user-column`, `--currency`

---

## Plugins

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii plugins fields <id>` | GET /plugins/{idPlugin}/fields | GET | READ | List plugin field definitions |
| `torii plugins create` | POST /plugins | POST | WRITE | Create plugin |
| `torii plugins apikey <uuid>` | POST /plugins/{uuidPlugin}/apikey | POST | WRITE | Generate API key for private plugin |
| `torii plugins update <uuid>` | PUT /plugins/{uuidPlugin} | PUT | WRITE | Update plugin / publish new version |
| `torii plugins delete <uuid>` | DELETE /plugins/{uuidPlugin} | DELETE | WRITE | Delete plugin |

**Flags for `torii plugins create`:** `--name` (required)

**Flags for `torii plugins delete`:** `--confirm`

---

## Anonymization (GDPR)

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii gdpr anonymize` | POST /anonymizeRequest | POST | WRITE | Create user anonymization request |

**Flags for `torii gdpr anonymize`:** `--email` (required), `--fields`, `--confirm`

---

## Integrations

| Command | API Endpoint | Method | Type | Description |
|---------|--------------|--------|------|-------------|
| `torii integrations sync-custom` | PUT /services/sync/custom | PUT | WRITE | Sync custom integration data |
| `torii integrations sync-gluu` | PUT /services/sync/gluu | PUT | WRITE | Sync Gluu identity management integration |

**Flags for `torii integrations sync-custom`:** `--file-id` (required), `--app-account-id` (required)

**Flags for `torii integrations sync-gluu`:** `--file-id` (required), `--app-account-id` (required)

---

## Global Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--output` | `-o` | Output format: `json` (default), `table`, `csv` |
| `--api-key` | | Override TORII_API_KEY environment variable |
| `--base-url` | | Override default base URL (https://api.toriihq.com/v1.0) |
| `--dry-run` | | For write operations, show what would happen without executing |
| `--confirm` | `-y` | Skip confirmation prompt for destructive operations |
| `--verbose` | `-v` | Show HTTP request/response details |
| `--quiet` | `-q` | Suppress non-essential output |

---

## Totals

| Metric | Count |
|--------|-------|
| **Total commands** | 56 |
| **READ commands** | 27 |
| **WRITE commands** | 29 |
