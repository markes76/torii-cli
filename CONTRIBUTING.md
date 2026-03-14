# Contributing to torii-cli

Thank you for your interest in contributing to torii-cli! This guide covers everything you need to get started.

## Development Setup

### Prerequisites

- Node.js 20.0.0+
- npm 10+
- A Torii account with API access (for integration testing)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/torii-cli/torii-cli.git
cd torii-cli

# Install dependencies
npm install

# Copy env template
cp .env.example .env
# Edit .env and add your TORII_API_KEY

# Build
npm run build

# Run in development mode (watches for changes)
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run lint
```

## Adding a New Command

1. **Read the endpoint docs** in `docs/api-reference/endpoints/` for the API endpoint your command wraps.
2. **Check `docs/appendix/valid-params-per-endpoint.md`** to know exactly which query parameters are valid.
3. **Create a command file** in `src/commands/` (or add to an existing file if the command belongs to an existing resource group).
4. **Register the command** in `src/index.ts`.
5. **For write commands:** Call `checkWritePermission()` from `src/utils/safety.ts` before making the HTTP request. Support `--dry-run`.
6. **Write tests:** Unit test the command logic. For read commands, write an integration test. For write commands, test with `--dry-run` only.
7. **Update the command map** in `docs/cli-planning/command-map.md`.

## Adding to the Solutions Knowledge Base

When you encounter and solve a problem:

1. Create a markdown file in the appropriate `solutions/` subdirectory:
   - `api-quirks/` — unexpected API behaviors
   - `error-resolutions/` — specific error codes and fixes
   - `workarounds/` — known issues with temporary solutions
   - `patterns/` — successful patterns worth reusing
2. Use the [solution template](solutions/SOLUTIONS-README.md).
3. Update `solutions/INDEX.md` with the new entry.
4. If the issue reveals undocumented API behavior, also update `docs/appendix/known-quirks.md`.

## Testing Rules

**CRITICAL: Never test write operations against a production Torii environment.**

- **Read commands (GET):** Test freely against the live API.
- **Write commands (POST/PUT/PATCH/DELETE):** Test ONLY with `--dry-run`.
- **Integration tests:** Must use GET endpoints only.
- **Unit tests:** Mock HTTP calls for write operations.

## Code Style

- TypeScript strict mode
- ESM modules
- Meaningful variable and function names
- Handle all error cases explicitly
- No hardcoded org-specific values
- API keys must never appear in logs, error messages, or solution files

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm test` and `npm run lint`
4. Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
5. Confirm that no write operations were run against production during testing
6. Document any new solutions discovered during development

## Reporting Issues

Use the GitHub issue templates:
- [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
