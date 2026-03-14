import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { paginate, type PaginationOptions } from '../utils/pagination.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig, App } from '../types/index.js';

export function registerApps(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const apps = program.command('apps').description('App management commands');

  // ── torii apps list ────────────────────────────────────────────────────────
  apps
    .command('list')
    .description('List all apps')
    .option('-o, --format <format>', 'Output format: json, jsonl, table, csv, tsv, yaml, raw, quiet, count, ids')
    .option('--fields <fields>', 'Output fields, dot-path ok: "id,name,primaryOwner.email"')
    .option('--filter <expr>', 'Client-side filter: field=value (e.g. "state=Sanctioned")')
    .option('--sort-by <field>', 'Client-side sort: field or field:desc')
    .option('--api-fields <fields>', 'Comma-separated API fields to request')
    .option('--sort <field>', 'Sort by field (API-side)')
    .option('--order <order>', 'asc or desc')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'Fetch first page only')
    .option('--cursor <cursor>', 'Start from cursor')
    .option('--filters <json>', 'Filter JSON')
    .option('--aggs <json>', 'Aggregation JSON')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const apiParams: Record<string, unknown> = {};
        if (opts['apiFields']) apiParams['fields'] = opts['apiFields'];
        if (opts['sort']) apiParams['sort'] = opts['sort'];
        if (opts['order']) apiParams['order'] = opts['order'];
        if (opts['filters']) apiParams['filters'] = opts['filters'];
        if (opts['aggs']) apiParams['aggs'] = opts['aggs'];

        const pagOpts: PaginationOptions = {
          limit: opts['limit'] as number,
          noPaginate: opts['paginate'] === false,
          size: opts['size'] as number,
          cursor: opts['cursor'] as string,
        };

        const results = await paginate<App>(getClient(), '/apps', apiParams, 'apps', pagOpts);
        printOutput(results, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii apps get <id> ────────────────────────────────────────────────────
  apps
    .command('get <idApp>')
    .description('Get an app by ID')
    .option('-o, --format <format>', 'Output format')
    .option('--fields <fields>', 'Fields to include')
    .option('--raw', 'Raw API response')
    .action(async (idApp: string, opts: Record<string, unknown>) => {
      try {
        const params: Record<string, unknown> = {};
        if (opts['fields']) params['fields'] = opts['fields'];
        const data = await getClient().get<App>(`/apps/${idApp}`, params);
        printOutput(data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii apps search <name> ───────────────────────────────────────────────
  apps
    .command('search <name>')
    .description('Search apps by name in the Torii catalog')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (name: string, opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<{ apps: App[] }>('/apps/search', { name });
        printOutput(data.apps ?? data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii apps users <idApp> ───────────────────────────────────────────────
  apps
    .command('users <idApp>')
    .description('List all users for an app')
    .option('-o, --format <format>', 'Output format')
    .option('--fields <fields>', 'Fields to include')
    .option('--sort <field>', 'Sort by field')
    .option('--order <order>', 'asc or desc')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'First page only')
    .option('--cursor <cursor>', 'Start cursor')
    .option('--raw', 'Raw API response')
    .action(async (idApp: string, opts: Record<string, unknown>) => {
      try {
        const apiParams: Record<string, unknown> = {};
        if (opts['fields']) apiParams['fields'] = opts['fields'];
        if (opts['sort']) apiParams['sort'] = opts['sort'];
        if (opts['order']) apiParams['order'] = opts['order'];

        const pagOpts: PaginationOptions = {
          limit: opts['limit'] as number,
          noPaginate: opts['paginate'] === false,
          size: opts['size'] as number,
          cursor: opts['cursor'] as string,
        };

        const results = await paginate<unknown>(getClient(), `/apps/${idApp}/users`, apiParams, 'users', pagOpts);
        printOutput(results, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii apps fields ──────────────────────────────────────────────────────
  apps
    .command('fields')
    .description('List app field definitions')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/apps/fields');
        printOutput(data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii apps metadata ────────────────────────────────────────────────────
  apps
    .command('metadata')
    .description('List app field metadata')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/apps/metadata');
        printOutput(data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii apps add <idApp> ─────────────────────────────────────────────────
  apps
    .command('add <idApp>')
    .description('Add an app from the Torii catalog to the organization')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idApp: string, opts: Record<string, unknown>) => {
      const body = { idApp: Number(idApp) };
      const url = `${getConfig().baseUrl}/apps`;
      const proceed = await checkWritePermission({
        operation: `add app ${idApp} to organization`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<{ app: App }>('/apps', body);
        printOutput(data.app ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  // ── torii apps create ──────────────────────────────────────────────────────
  apps
    .command('create')
    .description('Create a custom app (not from catalog)')
    .option('--name <name>', 'App name')
    .option('--url <url>', 'App URL')
    .option('--category <category>', 'App category')
    .option('--description <desc>', 'App description')
    .option('--state <state>', 'App state')
    .option('--tags <tags>', 'App tags')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (opts['name']) body['name'] = opts['name'];
      if (opts['url']) body['url'] = opts['url'];
      if (opts['category']) body['category'] = opts['category'];
      if (opts['description']) body['description'] = opts['description'];
      if (opts['state']) body['state'] = opts['state'];
      if (opts['tags']) body['tags'] = opts['tags'];
      const url = `${getConfig().baseUrl}/apps/custom`;
      const proceed = await checkWritePermission({
        operation: `create custom app "${opts['name'] ?? '(unnamed)'}"`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<{ app: App }>('/apps/custom', body);
        printOutput(data.app ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  // ── torii apps update <id> ─────────────────────────────────────────────────
  apps
    .command('update <idApp>')
    .description('Update an existing app')
    .option('--name <name>', 'App name')
    .option('--url <url>', 'App URL')
    .option('--category <category>', 'App category')
    .option('--description <desc>', 'App description')
    .option('--state <state>', 'App state')
    .option('--tags <tags>', 'App tags')
    .option('--hidden', 'Mark as hidden')
    .option('--no-hidden', 'Mark as visible')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idApp: string, opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (opts['name']) body['name'] = opts['name'];
      if (opts['url']) body['url'] = opts['url'];
      if (opts['category']) body['category'] = opts['category'];
      if (opts['description']) body['description'] = opts['description'];
      if (opts['state']) body['state'] = opts['state'];
      if (opts['tags']) body['tags'] = opts['tags'];
      if (opts['hidden'] !== undefined) body['isHidden'] = opts['hidden'];
      const url = `${getConfig().baseUrl}/apps/${idApp}`;
      const proceed = await checkWritePermission({
        operation: `update app ${idApp}`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<{ app: App }>(`/apps/${idApp}`, body);
        printOutput(data.app ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  // ── torii apps match ───────────────────────────────────────────────────────
  apps
    .command('match <names...>')
    .description('Match app names against the Torii catalog')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (names: string[], opts: Record<string, unknown>) => {
      const body = { apps: names.map(n => ({ name: n })) };
      const url = `${getConfig().baseUrl}/apps/match`;
      const proceed = await checkWritePermission({
        operation: `match ${names.length} app names against catalog`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<{ apps: unknown[] }>('/apps/match', body);
        printOutput(data.apps ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });
}

function buildOutOpts(opts: Record<string, unknown>): OutputOptions {
  return {
    format: opts['format'] as OutputOptions['format'],
    fields: opts['fields'] as string,
    sort: opts['sortBy'] as string,
    filter: opts['filter'] as string,
    raw: opts['raw'] as boolean,
  };
}

function handleError(err: unknown): never {
  const e = err as Error;
  printError(e.message);
  process.exit(1);
}
