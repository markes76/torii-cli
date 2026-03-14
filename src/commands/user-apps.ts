import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig, UserApp } from '../types/index.js';

export function registerUserApps(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  // These are nested under "users" as sub-subcommands
  // Expose as: torii user-apps get/update
  const ua = program.command('user-apps').description('User-app relationship commands');

  ua
    .command('get <idUser> <idApp>')
    .description('Get user-app relationship')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (idUser: string, idApp: string, opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<{ app: UserApp }>(`/users/${idUser}/apps/${idApp}`);
        printOutput(data.app ?? data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  ua
    .command('update <idUser> <idApp>')
    .description('Update user-app relationship (mark removed from app)')
    .option('--removed', 'Mark user as removed from app')
    .option('--no-removed', 'Mark user as NOT removed from app')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idUser: string, idApp: string, opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (opts['removed'] !== undefined) body['isUserRemovedFromApp'] = opts['removed'];
      const url = `${getConfig().baseUrl}/users/${idUser}/apps/${idApp}`;
      const proceed = await checkWritePermission({
        operation: `update user ${idUser} / app ${idApp} relationship`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().put<{ app: UserApp }>(`/users/${idUser}/apps/${idApp}`, body);
        printOutput(data.app ?? data, buildOutOpts(opts));
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
