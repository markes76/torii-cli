# Workflow Schema

## Overview
Workflow schemas vary by workflow type. Trigger body fields depend on the workflow's configured trigger. This document covers the main workflow-related types used when manually running workflows and viewing execution history.

## ManuallyRunWorkflow

Request body for manually triggering a workflow. All fields are optional; required fields depend on the workflow type.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| triggerAppId | integer | No* | App ID for app-triggered workflows |
| triggerUserEmail | string | No* | User email for user-triggered workflows |
| triggerContractId | integer | No* | Contract ID for contract-triggered workflows |
| triggerLicenseName | string | No* | License name for license-triggered workflows |
| triggerLicenseAppId | integer | No* | App ID for license context |

*Required fields depend on the workflow's configured trigger type.

## ManuallyRunRequestAccessPolicy

Request body for manually running a Request Access Policy workflow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| triggerAppId | integer | Yes | App ID |
| triggerUserEmail | string | Yes | User email requesting access |
| description | string | No | Optional description |

## WorkflowActionExecution

Represents a single action execution in a workflow run (audit log entry).

| Field | Type | Description |
|-------|------|-------------|
| (varies) | — | Structure depends on action type; consult API responses for current shape |

## WorkflowsEditHistory

Audit trail of workflow edits.

| Field | Type | Description |
|-------|------|-------------|
| (varies) | — | Structure depends on edit type; consult API responses for current shape |

## Example: ManuallyRunWorkflow (app-triggered)

```json
{
  "triggerAppId": 100,
  "triggerUserEmail": "jane.doe@company.com"
}
```

## Example: ManuallyRunRequestAccessPolicy

```json
{
  "triggerAppId": 100,
  "triggerUserEmail": "jane.doe@company.com",
  "description": "Requesting access for new project"
}
```

## Notes
- The trigger body schema is dynamic based on workflow configuration. Always check the workflow definition to determine which trigger fields are required.
- WorkflowActionExecution and WorkflowsEditHistory structures may evolve; refer to live API responses for the current schema.
