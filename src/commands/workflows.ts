import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { paginate } from '../utils/pagination.js';
import type { PaginationOptions } from '../utils/pagination.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig } from '../types/index.js';

export function registerWorkflows(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const workflows = program.command('workflows').description('Workflow commands');

  workflows
    .command('executions')
    .description('List workflow action execution logs')
    .option('-o, --format <format>', 'Output format')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'First page only')
    .option('--cursor <cursor>', 'Start cursor')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const pagOpts: PaginationOptions = {
          limit: opts['limit'] as number,
          noPaginate: opts['paginate'] === false,
          size: opts['size'] as number,
          cursor: opts['cursor'] as string,
        };
        const results = await paginate<unknown>(
          getClient(), '/workflows/actionExecutions', {}, 'actionExecutions', pagOpts
        );
        printOutput(results, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  workflows
    .command('history')
    .description('List workflow edit audit history')
    .option('-o, --format <format>', 'Output format')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'First page only')
    .option('--cursor <cursor>', 'Start cursor')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        // Response key for /workflows/audit is unclear; use raw and let output handle it
        const data = await getClient().get<unknown>('/workflows/audit', {
          ...(opts['size'] ? { size: opts['size'] } : {}),
          ...(opts['cursor'] ? { cursor: opts['cursor'] } : {}),
        });
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  workflows
    .command('run <idWorkflow>')
    .description('Manually trigger a workflow')
    .option('--app-id <n>', 'Trigger app ID', parseInt)
    .option('--user-email <email>', 'Trigger user email')
    .option('--contract-id <n>', 'Trigger contract ID', parseInt)
    .option('--license-name <name>', 'Trigger license name')
    .option('--license-app-id <n>', 'Trigger license app ID', parseInt)
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idWorkflow: string, opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (opts['appId']) body['triggerAppId'] = opts['appId'];
      if (opts['userEmail']) body['triggerUserEmail'] = opts['userEmail'];
      if (opts['contractId']) body['triggerContractId'] = opts['contractId'];
      if (opts['licenseName']) body['triggerLicenseName'] = opts['licenseName'];
      if (opts['licenseAppId']) body['triggerLicenseAppId'] = opts['licenseAppId'];

      const url = `${getConfig().baseUrl}/workflows/${idWorkflow}/trigger`;
      const proceed = await checkWritePermission({
        operation: `trigger workflow ${idWorkflow}`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<unknown>(`/workflows/${idWorkflow}/trigger`, body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  workflows
    .command('request-access')
    .description('Trigger app access request policy for a user')
    .requiredOption('--app-id <n>', 'App ID', parseInt)
    .requiredOption('--user-email <email>', 'User email requesting access')
    .option('--description <desc>', 'Reason for request')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        triggerAppId: opts['appId'],
        triggerUserEmail: opts['userEmail'],
      };
      if (opts['description']) body['description'] = opts['description'];

      const url = `${getConfig().baseUrl}/appCatalog/triggerAppAccessRequestPolicy`;
      const proceed = await checkWritePermission({
        operation: `request access to app ${opts['appId']} for ${opts['userEmail']}`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<unknown>('/appCatalog/triggerAppAccessRequestPolicy', body);
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
