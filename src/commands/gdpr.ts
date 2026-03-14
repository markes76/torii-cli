import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig } from '../types/index.js';

export function registerGdpr(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const gdpr = program.command('gdpr').description('GDPR compliance commands');

  gdpr
    .command('anonymize')
    .description('Anonymize a user for GDPR compliance (DESTRUCTIVE — cannot be undone)')
    .requiredOption('--email <email>', 'Email address of user to anonymize')
    .option('--fields <fields>', 'Comma-separated fields to anonymize (omit to anonymize all)')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = { email: opts['email'] as string };
      if (opts['fields']) {
        body['fields'] = (opts['fields'] as string).split(',').map(f => f.trim());
      }

      const url = `${getConfig().baseUrl}/anonymizeRequest`;
      const proceed = await checkWritePermission({
        operation: `anonymize user ${opts['email']} — GDPR request (DESTRUCTIVE, IRREVERSIBLE)`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<{ id: number; status: string }>('/anonymizeRequest', body);
        const outOpts: OutputOptions = {
          format: opts['format'] as OutputOptions['format'],
          raw: opts['raw'] as boolean,
        };
        printOutput(data, outOpts);
      } catch (err) {
        const e = err as Error;
        printError(e.message);
        process.exit(1);
      }
    });
}
