import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import type { Organization } from '../types/index.js';

export function registerOrg(program: Command, getClient: () => ToriiClient): void {
  const org = program.command('org').description('Organization commands');

  org
    .command('get')
    .description('Get organization info for the authenticated API key')
    .option('-o, --format <format>', 'Output format: json, table, csv', 'json')
    .option('--raw', 'Output unprocessed API response')
    .action(async (opts: { format: string; raw?: boolean }) => {
      try {
        const data = await getClient().get<Organization>('/orgs/my');
        const outOpts: OutputOptions = { format: opts.format as OutputOptions['format'], raw: opts.raw };
        printOutput(data, outOpts);
      } catch (err) {
        handleError(err);
      }
    });
}

function handleError(err: unknown): never {
  const e = err as Error & { status?: number; response?: unknown };
  printError(e.message);
  process.exit(1);
}
