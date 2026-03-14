import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import type { Role } from '../types/index.js';

export function registerRoles(program: Command, getClient: () => ToriiClient): void {
  const roles = program.command('roles').description('Role management commands');

  roles
    .command('list')
    .description('List all roles')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<{ roles: Role[] }>('/roles');
        const outOpts: OutputOptions = {
          format: opts['format'] as OutputOptions['format'],
          raw: opts['raw'] as boolean,
        };
        printOutput(data.roles ?? data, outOpts);
      } catch (err) {
        const e = err as Error;
        printError(e.message);
        process.exit(1);
      }
    });
}
