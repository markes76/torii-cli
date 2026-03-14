import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { paginate, type PaginationOptions } from '../utils/pagination.js';
import type { AuditLog } from '../types/index.js';

export function registerAudit(program: Command, getClient: () => ToriiClient): void {
  const audit = program.command('audit').description('Audit log commands');

  audit
    .command('list')
    .description('List admin audit logs')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .option('--size <n>', 'Page size', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'First page only')
    .option('--cursor <cursor>', 'Start cursor')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        // GET /audit only supports size + cursor (no fields/sort/filter quirk)
        const pagOpts: PaginationOptions = {
          limit: opts['limit'] as number,
          noPaginate: opts['paginate'] === false,
          size: opts['size'] as number,
          cursor: opts['cursor'] as string,
        };

        const results = await paginate<AuditLog>(getClient(), '/audit', {}, 'audit', pagOpts);
        const outOpts: OutputOptions = {
          format: opts['format'] as OutputOptions['format'],
          raw: opts['raw'] as boolean,
        };
        printOutput(results, outOpts);
      } catch (err) {
        const e = err as Error;
        printError(e.message);
        process.exit(1);
      }
    });
}
