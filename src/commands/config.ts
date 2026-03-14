import { createInterface } from 'readline';
import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, saveConfig, maskApiKey } from '../config.js';
import { ToriiClient } from '../client.js';
import type { ToriiConfig } from '../types/index.js';

const VALID_KEYS: Array<keyof ToriiConfig> = ['apiKey', 'baseUrl', 'mode', 'scimApiKey'];

export function registerConfig(program: Command): void {
  const config = program.command('config').description('CLI configuration commands');

  config
    .command('show')
    .description('Show current configuration (API key is masked)')
    .action(() => {
      const cfg = loadConfig();
      console.log({
        apiKey: maskApiKey(cfg.apiKey || '(not set)'),
        baseUrl: cfg.baseUrl,
        mode: cfg.mode,
        ...(cfg.scimApiKey ? { scimApiKey: maskApiKey(cfg.scimApiKey) } : {}),
      });
    });

  config
    .command('set <key> <value>')
    .description(`Set a config value. Keys: ${VALID_KEYS.join(', ')}`)
    .action((key: string, value: string) => {
      if (!VALID_KEYS.includes(key as keyof ToriiConfig)) {
        console.error(chalk.red(`Invalid config key: ${key}`));
        console.error(`Valid keys: ${VALID_KEYS.join(', ')}`);
        process.exit(1);
      }
      if (key === 'mode' && value !== 'read-only' && value !== 'full') {
        console.error(chalk.red('mode must be "read-only" or "full"'));
        process.exit(1);
      }
      saveConfig({ [key]: value });
      const displayValue = key === 'apiKey' || key === 'scimApiKey' ? maskApiKey(value) : value;
      console.log(chalk.green(`✓ ${key} set to ${displayValue}`));
    });

  config
    .command('init')
    .description('Interactive setup — enter API key and base URL')
    .action(async () => {
      console.log(chalk.cyan('\nTorii CLI — Setup\n'));

      const apiKey = await promptUser('Enter your Torii API key: ');
      if (!apiKey.trim()) {
        console.error(chalk.red('API key cannot be empty.'));
        process.exit(1);
      }

      const defaultUrl = 'https://api.toriihq.com/v1.0';
      const baseUrlInput = await promptUser(`Base URL [${defaultUrl}]: `);
      const baseUrl = baseUrlInput.trim() || defaultUrl;

      console.log(chalk.dim('\nValidating API key…'));

      try {
        const client = new ToriiClient({ apiKey: apiKey.trim(), baseUrl, mode: 'read-only' });
        const org = await client.get<{ name?: string; id?: number }>('/orgs/my');
        saveConfig({ apiKey: apiKey.trim(), baseUrl, mode: 'read-only' });
        console.log(chalk.green(`\n✓ Connected to: ${org.name ?? 'your Torii org'} (id: ${org.id ?? '?'})`));
        console.log(chalk.green('✓ Configuration saved to ~/.torii-cli/config.json'));
        console.log(chalk.dim('\nMode is set to read-only. To enable write operations:'));
        console.log(chalk.dim('  torii config set mode full'));
      } catch (err) {
        const e = err as Error;
        console.error(chalk.red(`\n✗ Authentication failed: ${e.message}`));
        console.error(chalk.dim('Check your API key and try again.'));
        process.exit(1);
      }
    });
}

function promptUser(question: string): Promise<string> {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}
