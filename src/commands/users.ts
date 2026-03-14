import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { paginate, type PaginationOptions } from '../utils/pagination.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig, User } from '../types/index.js';

export function registerUsers(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const users = program.command('users').description('User management commands');

  // ── torii users list ───────────────────────────────────────────────────────
  users
    .command('list')
    .description('List all users')
    .option('-o, --format <format>', 'Output format: json, jsonl, table, csv, tsv, yaml, raw, quiet, count, ids')
    .option('--fields <fields>', 'Output fields, dot-path ok: "id,email,firstName"')
    .option('--filter <expr>', 'Client-side filter: field=value (e.g. "lifecycleStatus=active")')
    .option('--sort-by <field>', 'Client-side sort: field or field:desc')
    .option('--api-fields <fields>', 'Comma-separated fields to request from API')
    .option('--sort <field>', 'Sort by field (API-side)')
    .option('--order <order>', 'Sort order: asc or desc')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results (0 = all)', parseInt)
    .option('--no-paginate', 'Fetch first page only')
    .option('--cursor <cursor>', 'Start from cursor')
    .option('--filters <json>', 'Filter JSON (URL-encoded or raw)')
    .option('--raw', 'Output unprocessed API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const apiParams: Record<string, unknown> = {};
        if (opts['apiFields']) apiParams['fields'] = opts['apiFields'];
        if (opts['sort']) apiParams['sort'] = opts['sort'];
        if (opts['order']) apiParams['order'] = opts['order'];
        if (opts['filters']) apiParams['filters'] = opts['filters'];

        const pagOpts: PaginationOptions = {
          limit: opts['limit'] as number,
          noPaginate: opts['paginate'] === false,
          size: opts['size'] as number,
          cursor: opts['cursor'] as string,
        };

        const results = await paginate<User>(getClient(), '/users', apiParams, 'users', pagOpts);
        const outOpts: OutputOptions = {
          format: opts['format'] as OutputOptions['format'],
          fields: opts['fields'] as string,
          raw: opts['raw'] as boolean,
        };
        printOutput(results, outOpts);
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii users get <id> ───────────────────────────────────────────────────
  users
    .command('get <idUser>')
    .description('Get a user by ID')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--raw', 'Output unprocessed API response')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      try {
        const params: Record<string, unknown> = {};
        if (opts['fields']) params['fields'] = opts['fields'];
        const data = await getClient().get<User>(`/users/${idUser}`, params);
        printOutput(data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii users update <id> ────────────────────────────────────────────────
  users
    .command('update <idUser>')
    .description('Update a user (only lifecycleStatus is writable)')
    .requiredOption('--lifecycle-status <status>', 'Lifecycle status: active, offboarding, offboarded')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation prompt')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      const body = { lifecycleStatus: opts['lifecycleStatus'] as string };
      const url = `${getConfig().baseUrl}/users/${idUser}`;
      const proceed = await checkWritePermission({
        operation: `update user ${idUser} lifecycleStatus → ${body.lifecycleStatus}`,
        method: 'PUT',
        url,
        body,
        dryRun: !!opts['dryRun'],
        force: !!opts['yes'],
        config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<{ user: User }>(`/users/${idUser}`, body);
        printOutput(data.user ?? data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii users fields ─────────────────────────────────────────────────────
  users
    .command('fields')
    .description('List user field definitions')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .option('--raw', 'Output unprocessed API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/users/fields');
        printOutput(data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii users metadata ───────────────────────────────────────────────────
  users
    .command('metadata')
    .description('List user field metadata')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .option('--raw', 'Output unprocessed API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/users/metadata');
        printOutput(data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
    });

  // ── torii users apps <idUser> ──────────────────────────────────────────────
  users
    .command('apps <idUser>')
    .description("List all apps for a user")
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--sort <field>', 'Sort by field')
    .option('--order <order>', 'Sort order: asc or desc')
    .option('--raw', 'Output unprocessed API response')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      try {
        // GET /users/{id}/apps does NOT support pagination (quirk #7)
        const params: Record<string, unknown> = {};
        if (opts['fields']) params['fields'] = opts['fields'];
        if (opts['sort']) params['sort'] = opts['sort'];
        if (opts['order']) params['order'] = opts['order'];
        const data = await getClient().get<{ apps: unknown[] }>(`/users/${idUser}/apps`, params);
        printOutput(data.apps ?? data, buildOutOpts(opts));
      } catch (err) {
        handleError(err);
      }
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
  const e = err as Error & { status?: number };
  printError(e.message);
  process.exit(1);
}
