import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig } from '../types/index.js';

export function registerIntegrations(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const integrations = program.command('integrations').description('Integration sync commands');

  integrations
    .command('sync-custom')
    .description('Sync a custom integration data file')
    .requiredOption('--file-id <n>', 'File ID (upload via `torii files store` first)', parseInt)
    .requiredOption('--app-account-id <n>', 'App account ID', parseInt)
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body = {
        idFile: opts['fileId'] as number,
        idAppAccount: opts['appAccountId'] as number,
      };
      const url = `${getConfig().baseUrl}/services/sync/custom`;
      const proceed = await checkWritePermission({
        operation: `sync custom integration (file ${body.idFile}, appAccount ${body.idAppAccount})`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<unknown>('/services/sync/custom', body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  integrations
    .command('sync-gluu')
    .description('Sync a Gluu identity management custom integration')
    .requiredOption('--file-id <n>', 'File ID', parseInt)
    .requiredOption('--app-account-id <n>', 'App account ID', parseInt)
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body = {
        idFile: opts['fileId'] as number,
        idAppAccount: opts['appAccountId'] as number,
      };
      const url = `${getConfig().baseUrl}/services/sync/gluu`;
      const proceed = await checkWritePermission({
        operation: `sync Gluu integration (file ${body.idFile})`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<unknown>('/services/sync/gluu', body);
        printOutput(data, buildOutOpts(opts));
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
