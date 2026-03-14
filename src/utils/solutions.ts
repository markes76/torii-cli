import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

function getSolutionsDir(): string {
  try {
    const thisDir = fileURLToPath(new URL('.', import.meta.url));
    const candidate = join(thisDir, '../../solutions');
    if (existsSync(candidate)) return candidate;
  } catch { /* ignore */ }
  return join(process.cwd(), 'solutions');
}

export function lookupSolution(errorContext: {
  status?: number;
  endpoint?: string;
  tags?: string[];
}): string | null {
  const solutionsDir = getSolutionsDir();
  const indexPath = join(solutionsDir, 'INDEX.md');
  if (!existsSync(indexPath)) return null;

  const lines = readFileSync(indexPath, 'utf-8')
    .split('\n')
    .filter(l => l.includes('|') && !l.startsWith('| ID') && !l.includes('---'));

  for (const line of lines) {
    const parts = line.split('|').map(s => s.trim()).filter(Boolean);
    if (parts.length < 4) continue;
    const [id, title, , , tags] = parts;
    if (!id || !title) continue;

    const tagList = (tags ?? '').split(',').map(t => t.trim());
    const matches =
      (errorContext.status && (tagList.includes(String(errorContext.status)) || line.includes(String(errorContext.status)))) ||
      (errorContext.endpoint && tagList.some(t => t && errorContext.endpoint!.includes(t))) ||
      (errorContext.tags && errorContext.tags.some(t => tagList.includes(t)));

    if (matches) {
      const content = findSolutionFile(solutionsDir, id);
      if (content) {
        return `\n${chalk.yellow('KNOWN SOLUTION')} (${id}):\n${content}`;
      }
      return `\n${chalk.yellow('KNOWN SOLUTION')} (${id}): ${title}`;
    }
  }
  return null;
}

function findSolutionFile(solutionsDir: string, id: string): string | null {
  const subdirs = ['api-quirks', 'error-resolutions', 'workarounds', 'patterns'];
  for (const sub of subdirs) {
    const dir = join(solutionsDir, sub);
    if (!existsSync(dir)) continue;
    let files: string[];
    try { files = readdirSync(dir) as string[]; }
    catch { continue; }
    const match = files.find(f => f.startsWith(id));
    if (match) {
      return readFileSync(join(dir, match), 'utf-8');
    }
  }
  return null;
}

export function logUnsolved(context: {
  endpoint: string;
  params?: Record<string, unknown>;
  status?: number;
  body?: unknown;
  errorMessage: string;
}): void {
  const solutionsDir = getSolutionsDir();
  const unsolvedDir = join(solutionsDir, 'unsolved');
  if (!existsSync(unsolvedDir)) {
    try { mkdirSync(unsolvedDir, { recursive: true }); } catch { return; }
  }

  const timestamp = new Date().toISOString();
  const filename = `${timestamp.replace(/[:.]/g, '-')}-${context.status ?? 'err'}.md`;
  const content = `# Unsolved: ${context.errorMessage}

## Problem
${context.errorMessage}

## Context
- Date: ${timestamp}
- Endpoint: ${context.endpoint}
- Status: ${context.status ?? 'unknown'}
- Params: ${JSON.stringify(context.params ?? {}, null, 2)}
- Response body: ${JSON.stringify(context.body ?? {}, null, 2)}

## Metadata
- Date discovered: ${timestamp.slice(0, 10)}
- Endpoint: ${context.endpoint}
- Error code: ${context.status ?? ''}
- Severity: medium
- Tags: ${context.endpoint.split('/').filter(Boolean).join(', ')}
`;

  try {
    writeFileSync(join(unsolvedDir, filename), content, 'utf-8');
  } catch { /* Non-fatal */ }
}
