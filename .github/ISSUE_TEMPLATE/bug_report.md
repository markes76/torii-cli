---
name: Bug Report
about: Report a bug or unexpected behavior in torii-cli
title: "[BUG] "
labels: bug
assignees: ''
---

## Command Run

```bash
# Exact command that produced the error
torii <command> <args> <flags>
```

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened. Include the full error message.

```
# Paste error output here
```

## Environment

- **torii-cli version:** (`torii --version`)
- **Node.js version:** (`node --version`)
- **OS:** (e.g., macOS 14.5, Ubuntu 22.04, Windows 11)
- **Mode:** (read-only / full)

## Torii API Response

If relevant, include the API response (with sensitive data redacted):

```json
{
  "statusCode": 422,
  "error": "...",
  "message": "..."
}
```

## Additional Context

Any other information that might help diagnose the issue.

- [ ] I have checked `solutions/` for a known fix
- [ ] I have checked `docs/appendix/known-quirks.md` for related quirks
