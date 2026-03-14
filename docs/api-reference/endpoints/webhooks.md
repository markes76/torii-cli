# Webhooks

Base URL: `https://api.toriihq.com/v1.0`

All requests require the `Authorization: Bearer API_KEY` header.

---

## Overview

The Torii API does **not** expose webhook configuration endpoints in its public OpenAPI spec. This document describes the current state of webhook support and alternatives.

---

## Webhook Configuration

| Property | Value |
|----------|-------|
| **Endpoint** | N/A |
| **Description** | No dedicated webhook CRUD endpoints exist in the public API. |
| **Operation Type** | N/A |
| **Authentication** | N/A |

### Current State

- **No dedicated webhook CRUD endpoints** exist in the Torii public API.
- Webhook configuration is likely managed through the **Torii UI**, not via API.
- The Torii API does not expose endpoints for creating, listing, updating, or deleting webhooks programmatically.

---

## Alternative: Workflow System

Torii may support webhook-like behavior through the **Workflows** system:

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /workflows/{idWorkflow}/trigger` |
| **Description** | Triggers a workflow execution. |
| **Operation Type** | WRITE |
| **Authentication** | Required (`Authorization: Bearer API_KEY`) |

### Notes

- The workflow system serves as the **primary automation mechanism** for triggering actions based on events.
- Workflows can be configured in the Torii UI and triggered via API.
- For external systems to trigger Torii workflows, you may need to configure workflow triggers in the Torii dashboard; the exact trigger mechanism (e.g., webhook URLs) is not documented in the public API.

---

## Summary

| Capability | Status |
|------------|--------|
| Webhook CRUD endpoints | Not available in public API |
| Webhook configuration via API | Not documented |
| Workflow trigger via API | Available (`POST /workflows/{idWorkflow}/trigger`) |
| Webhook configuration via UI | Likely managed in Torii dashboard |

For webhook-like integrations, use the **Workflows** system and configure triggers through the Torii UI. If you need to receive webhooks from Torii, contact Torii support or check the product documentation for UI-based webhook setup.
