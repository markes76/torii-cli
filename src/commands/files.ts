import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig, FileEntity } from '../types/index.js';

export function registerFiles(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const files = program.command('files').description('File management commands');

  files
    .command('upload-url')
    .description('Get pre-signed upload URL parameters')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<unknown>('/files/url');
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  files
    .command('get <id>')
    .description('Get file metadata by ID')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (id: string, opts: Record<string, unknown>) => {
      try {
        const data = await getClient().get<FileEntity>(`/files/${id}`);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  files
    .command('download <id>')
    .description('Download file content by ID')
    .action(async (id: string) => {
      try {
        // Pipe raw bytes to stdout
        const data = await getClient().get<string>(`/files/${id}/download`);
        process.stdout.write(String(data));
      } catch (err) { handleError(err); }
    });

  files
    .command('store')
    .description('Store file metadata after upload (step 3 of 3 in large file upload)')
    .requiredOption('--path <path>', 'File path (format: Timestamp/Filename)')
    .requiredOption(
      '--type <type>',
      'File type: attachment, expenseReport, customIntegrationData, pluginLogo, pluginResource, logo'
    )
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body = { path: opts['path'] as string, type: opts['type'] as string };
      const url = `${getConfig().baseUrl}/files`;
      const proceed = await checkWritePermission({
        operation: `store file metadata (path: ${body.path})`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getClient().post<{ id: number }>('/files', body);
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
