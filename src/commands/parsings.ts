import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig } from '../types/index.js';

export function registerParsings(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const parsings = program.command('parsings').description('File parsing commands');

  parsings
    .command('get <id>')
    .description('Get parse request status')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (id: string, opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>(`/parsings/${id}`);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  parsings
    .command('auto')
    .description('Automatically parse a file (auto column detection)')
    .requiredOption('--file-id <n>', 'File ID', parseInt)
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body = { idFile: opts['fileId'] as number };
      const url = `${getConfig().baseUrl}/parsings/automatic`;
      const proceed = await checkWritePermission({
        operation: `auto-parse file ${body.idFile}`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<{ id: number }>('/parsings/automatic', body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  parsings
    .command('manual')
    .description('Manually parse a file with explicit column mapping')
    .requiredOption('--file-id <n>', 'File ID', parseInt)
    .requiredOption('--date-col <col>', 'Transaction date column name/index')
    .requiredOption('--desc-col <col>', 'Description column name/index')
    .requiredOption('--amount-col <col>', 'Amount column name/index')
    .requiredOption('--date-format <fmt>', 'Date format: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, etc.')
    .option('--currency <code>', 'ISO currency code (default if not in file)')
    .option('--currency-col <col>', 'Currency column name/index')
    .option('--user-col <col>', 'Reporting user column name/index')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const parseConfig: Record<string, unknown> = {
        idFile: opts['fileId'],
        transactionDateColumn: opts['dateCol'],
        descriptionColumn: opts['descCol'],
        amountColumn: opts['amountCol'],
        dateFormat: opts['dateFormat'],
      };
      if (opts['currency']) parseConfig['currency'] = opts['currency'];
      if (opts['currencyCol']) parseConfig['currencyColumn'] = opts['currencyCol'];
      if (opts['userCol']) parseConfig['reportingUserColumn'] = opts['userCol'];

      const body = { parseConfig };
      const url = `${getConfig().baseUrl}/parsings/manual`;
      const proceed = await checkWritePermission({
        operation: `manual-parse file ${opts['fileId']}`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<{ id: number }>('/parsings/manual', body);
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
