import chalk from 'chalk';
import Table from 'cli-table3';

export type OutputFormat = 'json' | 'jsonl' | 'table' | 'csv' | 'tsv' | 'yaml' | 'raw' | 'quiet' | 'count' | 'ids';

export interface OutputOptions {
  format?: OutputFormat;
  fields?: string;       // comma-separated field paths (supports dot-path: "primaryOwner.email")
  sort?: string;         // field[:desc] — sort by field, optional descending
  filter?: string;       // field=value — keep rows where field equals value (case-insensitive)
  raw?: boolean;         // output unprocessed API response (alias for format=raw)
  noHeader?: boolean;
}

/**
 * Format and print data to stdout. All non-data output goes to stderr.
 */
export function printOutput(data: unknown, opts: OutputOptions = {}): void {
  if (opts.raw || opts.format === 'raw') {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
    return;
  }

  if (opts.format === 'quiet') return;

  // Normalize to array
  const items = Array.isArray(data) ? data : [data];

  // Apply --filter
  const filtered = opts.filter ? filterItems(items, opts.filter) : items;

  // Apply --sort
  const sorted = opts.sort ? sortItems(filtered, opts.sort) : filtered;

  // Apply --fields (after filter/sort so field paths still resolve)
  const shaped = opts.fields
    ? sorted.map(item => extractFields(item as Record<string, unknown>, opts.fields!))
    : sorted;

  const format = opts.format ?? 'json';

  switch (format) {
    case 'json':
      process.stdout.write(JSON.stringify(
        shaped.length === 1 && !Array.isArray(data) ? shaped[0] : shaped,
        null, 2
      ) + '\n');
      break;
    case 'jsonl':
      for (const item of shaped) process.stdout.write(JSON.stringify(item) + '\n');
      break;
    case 'table':
      printTable(shaped, opts.noHeader ?? false);
      break;
    case 'csv':
      printSeparated(shaped, ',', opts.noHeader ?? false);
      break;
    case 'tsv':
      printSeparated(shaped, '\t', opts.noHeader ?? false);
      break;
    case 'yaml':
      process.stdout.write(toYaml(shaped.length === 1 && !Array.isArray(data) ? shaped[0] : shaped) + '\n');
      break;
    case 'count':
      process.stdout.write(String(shaped.length) + '\n');
      break;
    case 'ids':
      for (const item of shaped) {
        const id = (item as Record<string, unknown>)['id'];
        if (id !== undefined) process.stdout.write(String(id) + '\n');
      }
      break;
  }
}

// ─── Field extraction (dot-path support) ────────────────────────────────────

function extractFields(item: Record<string, unknown>, fields: string): Record<string, unknown> {
  const keys = fields.split(',').map(f => f.trim()).filter(Boolean);
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    result[key] = getNestedValue(item, key);
  }
  return result;
}

function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return '';
    current = (current as Record<string, unknown>)[part];
  }
  return current ?? '';
}

// ─── Sort ────────────────────────────────────────────────────────────────────

function sortItems(items: unknown[], sortSpec: string): unknown[] {
  const [field, dir] = sortSpec.split(':');
  const desc = dir === 'desc';
  return [...items].sort((a, b) => {
    const av = getNestedValue(a, field!) ?? '';
    const bv = getNestedValue(b, field!) ?? '';
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as < bs) return desc ? 1 : -1;
    if (as > bs) return desc ? -1 : 1;
    return 0;
  });
}

// ─── Filter ──────────────────────────────────────────────────────────────────

function filterItems(items: unknown[], filterSpec: string): unknown[] {
  const eqIdx = filterSpec.indexOf('=');
  if (eqIdx === -1) return items;
  const field = filterSpec.slice(0, eqIdx);
  const value = filterSpec.slice(eqIdx + 1).toLowerCase();
  return items.filter(item => {
    const v = getNestedValue(item, field);
    return String(v ?? '').toLowerCase() === value;
  });
}

// ─── Table ───────────────────────────────────────────────────────────────────

function getColumns(items: unknown[]): string[] {
  const cols = new Set<string>();
  for (const item of items) {
    if (item && typeof item === 'object') {
      Object.keys(item as object).forEach(k => cols.add(k));
    }
  }
  return Array.from(cols);
}

function printTable(items: unknown[], noHeader: boolean): void {
  if (items.length === 0) {
    process.stderr.write(chalk.dim('(no results)\n'));
    return;
  }

  const cols = getColumns(items);
  const table = new Table({
    head: noHeader ? [] : cols.map(c => chalk.cyan(c)),
    style: { head: [], border: [] },
    wordWrap: false,
  });

  for (const item of items) {
    const row = cols.map(col => {
      const val = (item as Record<string, unknown>)[col];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    });
    table.push(row);
  }

  process.stdout.write(table.toString() + '\n');
  process.stderr.write(chalk.dim(`${items.length} result${items.length !== 1 ? 's' : ''}\n`));
}

// ─── CSV / TSV ───────────────────────────────────────────────────────────────

function printSeparated(items: unknown[], sep: string, noHeader: boolean): void {
  if (items.length === 0) return;
  const cols = getColumns(items);
  const escape = sep === ',' ? csvEscape : (s: string) => s.replace(/\t/g, ' ');

  if (!noHeader) {
    process.stdout.write(cols.map(escape).join(sep) + '\n');
  }

  for (const item of items) {
    const row = cols.map(col => {
      const val = (item as Record<string, unknown>)[col];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return escape(JSON.stringify(val));
      return escape(String(val));
    });
    process.stdout.write(row.join(sep) + '\n');
  }
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

// ─── YAML (inline, no external dep) ─────────────────────────────────────────

function toYaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes('"') || value.includes("'") || value.includes(':') || value.trim() !== value) {
      return JSON.stringify(value); // safe quoted string
    }
    return value || '""';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value.map(item => `${pad}- ${toYaml(item, indent + 1).trimStart()}`).join('\n');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) => {
      const rendered = toYaml(v, indent + 1);
      const multiline = rendered.includes('\n');
      return `${pad}${k}: ${multiline ? '\n' + rendered : rendered}`;
    }).join('\n');
  }
  return String(value);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function printError(message: string, hint?: string): void {
  process.stderr.write(chalk.red(`Error: ${message}\n`));
  if (hint) process.stderr.write(chalk.dim(hint + '\n'));
}

export function printSuccess(message: string): void {
  process.stdout.write(chalk.green(message + '\n'));
}
