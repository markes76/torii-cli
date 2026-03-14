#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, configExists } from './config.js';
import { ToriiClient } from './client.js';
import { registerOrg } from './commands/org.js';
import { registerUsers } from './commands/users.js';
import { registerApps } from './commands/apps.js';
import { registerContracts } from './commands/contracts.js';
import { registerAudit } from './commands/audit.js';
import { registerRoles } from './commands/roles.js';
import { registerUserApps } from './commands/user-apps.js';
import { registerWorkflows } from './commands/workflows.js';
import { registerScim } from './commands/scim.js';
import { registerFiles } from './commands/files.js';
import { registerParsings } from './commands/parsings.js';
import { registerPlugins } from './commands/plugins.js';
import { registerGdpr } from './commands/gdpr.js';
import { registerIntegrations } from './commands/integrations.js';
import { registerSolutions } from './commands/solutions.js';
import { registerConfig } from './commands/config.js';

const program = new Command();

program
  .name('torii')
  .description('CLI for the Torii SaaS Management API')
  .version('0.1.0')
  .option('--api-key <key>', 'Override API key for this command')
  .option('--base-url <url>', 'Override base URL for this command')
  .option('--mode <mode>', 'Override mode: read-only or full')
  .option('-v, --verbose', 'Show HTTP request/response details')
  .option('-q, --quiet', 'Suppress non-essential output');

// Lazy client — created on first use so config can be overridden per-command
let _client: ToriiClient | null = null;

function getClient(): ToriiClient {
  if (!_client) {
    const opts = program.opts<{ apiKey?: string; baseUrl?: string; mode?: string }>();
    const config = loadConfig({
      apiKey: opts.apiKey,
      baseUrl: opts.baseUrl,
      mode: opts.mode as 'read-only' | 'full' | undefined,
    });
    if (!config.apiKey) {
      console.error(chalk.red('No API key configured.'));
      console.error(chalk.dim('Run: torii config init'));
      console.error(chalk.dim('Or set: TORII_API_KEY=your-key'));
      process.exit(1);
    }
    _client = new ToriiClient(config);
  }
  return _client;
}

function getConfig() {
  const opts = program.opts<{ apiKey?: string; baseUrl?: string; mode?: string }>();
  return loadConfig({
    apiKey: opts.apiKey,
    baseUrl: opts.baseUrl,
    mode: opts.mode as 'read-only' | 'full' | undefined,
  });
}

// Register all command groups
registerConfig(program);
registerOrg(program, getClient);
registerUsers(program, getClient, getConfig);
registerApps(program, getClient, getConfig);
registerContracts(program, getClient, getConfig);
registerAudit(program, getClient);
registerRoles(program, getClient);
registerUserApps(program, getClient, getConfig);
registerWorkflows(program, getClient, getConfig);
registerScim(program, getClient, getConfig);
registerFiles(program, getClient, getConfig);
registerParsings(program, getClient, getConfig);
registerPlugins(program, getClient, getConfig);
registerGdpr(program, getClient, getConfig);
registerIntegrations(program, getClient, getConfig);
registerSolutions(program);

// First-run: nudge toward `config init` if no key
program.hook('preAction', () => {
  const cmd = program.args[0];
  if (cmd === 'config') return; // always allow config commands
  if (!configExists() && !process.env['TORII_API_KEY']) {
    // Only warn, don't block — the client creation will catch missing keys
    if (!program.opts().quiet) {
      process.stderr.write(
        chalk.dim('Tip: Run `torii config init` to set up your API key.\n')
      );
    }
  }
});

program.parseAsync(process.argv).catch(err => {
  console.error(chalk.red((err as Error).message));
  process.exit(1);
});
