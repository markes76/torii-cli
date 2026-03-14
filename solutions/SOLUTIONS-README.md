# Solutions Knowledge Base

## What This Is

The `solutions/` directory is torii-cli's shared brain. It contains documented fixes for
known issues, API quirks, error resolutions, workarounds, and successful patterns. This
directory is **committed to git** — when this project is open source, every user benefits
from accumulated knowledge.

## How It Works

### At Runtime

When the CLI encounters an error:

1. It searches `INDEX.md` for a matching solution (by error code, endpoint, or tags)
2. If a match is found, it displays both the error AND the known fix
3. If no match is found, it logs the error to `unsolved/` for future investigation

### During Development

When you (an AI agent or human contributor) encounter and solve a problem:

1. Create a solution file in the appropriate subdirectory
2. Update `INDEX.md` with the new entry
3. If the issue reveals undocumented API behavior, also update `docs/appendix/known-quirks.md`

## Directory Structure

```
solutions/
├── INDEX.md                  # Master index (searched by CLI at runtime)
├── SOLUTIONS-README.md       # This file
├── api-quirks/               # Unexpected API behaviors
├── error-resolutions/        # Specific error codes and their fixes
├── workarounds/              # Known issues with temporary solutions
├── patterns/                 # Successful patterns worth reusing
└── unsolved/                 # Problems encountered but not yet resolved
```

## Solution File Template

Every solution file MUST use this template:

```markdown
# [Short descriptive title]

## Problem
[What happened. Include the exact error message, HTTP status, endpoint, and params.]

## Root Cause
[Why it happened. Be specific.]

## Solution
[What fixed it. Include code snippets or config changes.]

## Prevention
[How to avoid hitting this again. Include any validation rules to add.]

## Metadata
- Date discovered: [YYYY-MM-DD]
- Endpoint: [API path, e.g., GET /users/{id}/apps]
- Error code: [HTTP status, e.g., 422]
- Severity: [low|medium|high|critical]
- Tags: [comma-separated, e.g., pagination, rate-limit, params, auth]
```

## Naming Convention

Files are numbered sequentially within each category:

```
api-quirks/001-user-apps-no-fields-param.md
api-quirks/002-contracts-size-502.md
error-resolutions/001-422-invalid-params.md
```

Use lowercase, hyphen-separated names that describe the issue.

## INDEX.md Entry Format

When you add a solution file, add a corresponding row to `INDEX.md`:

```markdown
| 001 | /users/{id}/apps doesn't support fields param | api-quirks | medium | params, user-apps |
```

## Important Rules

1. **This directory IS committed to git.** This is intentional.
2. **Never include API keys or sensitive data** in solution files.
3. **The `unsolved/` directory is a to-do list.** When you find a fix, move the file
   to the correct category and fill in the Solution and Prevention sections.
4. **Cross-reference with docs.** If a solution reveals undocumented API behavior,
   also add it to `docs/appendix/known-quirks.md`.
