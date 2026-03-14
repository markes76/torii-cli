import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig } from '../types/index.js';

export function registerPlugins(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const plugins = program.command('plugins').description('Plugin management commands');

  plugins
    .command('fields <idPlugin>')
    .description('List fields for a plugin')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (idPlugin: string, opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>(`/plugins/${idPlugin}/fields`);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  plugins
    .command('create')
    .description('Create a new plugin')
    .requiredOption('--name <name>', 'Plugin name')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body = { name: opts['name'] as string };
      const url = `${getConfig().baseUrl}/plugins`;
      const proceed = await checkWritePermission({
        operation: `create plugin "${body.name}"`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<unknown>('/plugins', body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  plugins
    .command('apikey <uuidPlugin>')
    .description('Generate API key for a private plugin')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (uuidPlugin: string, opts: Record<string, unknown>) => {
      const url = `${getConfig().baseUrl}/plugins/${uuidPlugin}/apikey`;
      const proceed = await checkWritePermission({
        operation: `generate API key for plugin ${uuidPlugin}`,
        method: 'POST', url,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<unknown>(`/plugins/${uuidPlugin}/apikey`);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  plugins
    .command('update <uuidPlugin>')
    .description('Update plugin / publish new version')
    .option('--name <name>', 'Plugin name')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (uuidPlugin: string, opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (opts['name']) body['name'] = opts['name'];
      const url = `${getConfig().baseUrl}/plugins/${uuidPlugin}`;
      const proceed = await checkWritePermission({
        operation: `update plugin ${uuidPlugin}`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<unknown>(`/plugins/${uuidPlugin}`, body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  plugins
    .command('delete <uuidPlugin>')
    .description('Permanently delete a plugin')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (uuidPlugin: string, opts: Record<string, unknown>) => {
      const url = `${getConfig().baseUrl}/plugins/${uuidPlugin}`;
      const proceed = await checkWritePermission({
        operation: `DELETE plugin ${uuidPlugin} (PERMANENT)`,
        method: 'DELETE', url,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        await getClient().delete(`/plugins/${uuidPlugin}`);
        console.log(`Plugin ${uuidPlugin} deleted.`);
      } catch (err) { handleError(err); }
    });
}

function buildOutOpts(opts: Record<string, unknown>): OutputOptions {
  return {
    format: opts['format'] as OutputOptions['format'],
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
