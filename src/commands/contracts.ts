import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { paginate, type PaginationOptions } from '../utils/pagination.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig, Contract } from '../types/index.js';

export function registerContracts(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const contracts = program.command('contracts').description('Contract management commands');

  contracts
    .command('list')
    .description('List all contracts')
    .option('-o, --format <format>', 'Output format: json, jsonl, table, csv, tsv, yaml, raw, quiet, count, ids')
    .option('--fields <fields>', 'Output fields, dot-path ok: "id,name,owner"')
    .option('--filter <expr>', 'Client-side filter: field=value (e.g. "status=active")')
    .option('--sort-by <field>', 'Client-side sort: field or field:desc')
    .option('--api-fields <fields>', 'API fields to request')
    .option('--sort <field>', 'Sort by field (API-side)')
    .option('--order <order>', 'asc or desc')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'First page only')
    .option('--cursor <cursor>', 'Start cursor')
    .option('--filters <json>', 'Filter JSON')
    .option('--raw', 'Raw API response')
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

        const results = await paginate<Contract>(getClient(), '/contracts', apiParams, 'contracts', pagOpts);
        printOutput(results, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  contracts
    .command('get <idContract>')
    .description('Get a contract by ID')
    .option('-o, --format <format>', 'Output format')
    .option('--fields <fields>', 'Fields to include')
    .option('--raw', 'Raw API response')
    .action(async (idContract: string, opts: Record<string, unknown>) => {
      try {
        const params: Record<string, unknown> = {};
        if (opts['fields']) params['fields'] = opts['fields'];
        const data = await getClient().get<Contract>(`/contracts/${idContract}`, params);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  contracts
    .command('create')
    .description('Create a new contract')
    .requiredOption('--name <name>', 'Contract name')
    .requiredOption('--app-id <id>', 'App ID', parseInt)
    .requiredOption('--status <status>', 'Contract status')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body = {
        name: opts['name'] as string,
        idApp: opts['appId'] as number,
        status: opts['status'] as string,
      };
      const url = `${getConfig().baseUrl}/contracts`;
      const proceed = await checkWritePermission({
        operation: `create contract "${body.name}"`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<{ contract: Contract }>('/contracts', body);
        printOutput(data.contract ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  contracts
    .command('update <idContract>')
    .description('Update a contract')
    .option('--app-id <id>', 'App ID', parseInt)
    .option('--status <status>', 'Contract status')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idContract: string, opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (opts['appId']) body['idApp'] = opts['appId'];
      if (opts['status']) body['status'] = opts['status'];
      const url = `${getConfig().baseUrl}/contracts/${idContract}`;
      const proceed = await checkWritePermission({
        operation: `update contract ${idContract}`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<{ contract: Contract }>(`/contracts/${idContract}`, body);
        printOutput(data.contract ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  contracts
    .command('delete <idContract>')
    .description('Permanently delete a contract')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (idContract: string, opts: Record<string, unknown>) => {
      const url = `${getConfig().baseUrl}/contracts/${idContract}`;
      const proceed = await checkWritePermission({
        operation: `DELETE contract ${idContract} (PERMANENT)`,
        method: 'DELETE', url,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        await getClient().delete(`/contracts/${idContract}`);
        console.log(`Contract ${idContract} deleted.`);
      } catch (err) { handleError(err); }
    });

  contracts
    .command('fields')
    .description('List contract field definitions')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/contracts/fields');
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  contracts
    .command('metadata')
    .description('List contract field metadata')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/contracts/metadata');
        printOutput(data, buildOutOpts(opts));
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
