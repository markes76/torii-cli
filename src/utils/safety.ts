import { createInterface } from 'readline';
import chalk from 'chalk';
import type { ToriiConfig } from '../types/index.js';

export interface WritePermissionOptions {
  operation: string;
  method: string;
  url: string;
  body?: unknown;
  dryRun: boolean;
  force: boolean;
  config: ToriiConfig;
}

/**
 * Gate for all write operations.
 * Returns true = proceed, false = abort.
 * Throws on read-only mode.
 */
export async function checkWritePermission(opts: WritePermissionOptions): Promise<boolean> {
  const { operation, method, url, body, dryRun, force, config } = opts;

  // --dry-run: print the request and exit without sending
  if (dryRun) {
    console.log(chalk.yellow('DRY RUN — request not sent\n'));
    console.log(chalk.bold('Method:'), method.toUpperCase());
    console.log(chalk.bold('URL:   '), url);
    if (body !== undefined) {
      console.log(chalk.bold('Body:'));
      console.log(JSON.stringify(body, null, 2));
    }
    return false; // caller should exit after this
  }

  // read-only mode: block all writes
  if (config.mode === 'read-only') {
    console.error(chalk.red('Error: This operation requires full access mode. Your current mode is read-only.'));
    console.error(chalk.dim("To enable write operations: torii config set mode full"));
    console.error(chalk.dim("Or set environment variable: TORII_MODE=full"));
    process.exit(1);
  }

  // full mode + --yes/--force: skip confirmation
  if (force) return true;

  // full mode: prompt for confirmation
  console.log(chalk.yellow(`\nYou are about to ${operation}.`));
  console.log(chalk.yellow('This will modify data in your production Torii environment.'));
  const answer = await prompt('Proceed? [y/N] ');
  return answer.trim().toLowerCase() === 'y';
}

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}
