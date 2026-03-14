import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import { printOutput, type OutputOptions } from '../utils/output.js';

function getSolutionsDir(): string {
  const candidates = [
    join(new URL('.', import.meta.url).pathname, '../../solutions'),
    join(process.cwd(), 'solutions'),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[1]!;
}

interface SolutionEntry {
  id: string;
  title: string;
  category: string;
  severity: string;
  tags: string;
}

function parseIndex(): SolutionEntry[] {
  const indexPath = join(getSolutionsDir(), 'INDEX.md');
  if (!existsSync(indexPath)) return [];

  const lines = readFileSync(indexPath, 'utf-8')
    .split('\n')
    .filter(l => l.startsWith('| ') && !l.includes('ID |') && !l.includes('---'));

  return lines.map(line => {
    const parts = line.split('|').map(s => s.trim()).filter(Boolean);
    return {
      id: parts[0] ?? '',
      title: parts[1] ?? '',
      category: parts[2] ?? '',
      severity: parts[3] ?? '',
      tags: parts[4] ?? '',
    };
  }).filter(e => e.id && e.title);
}

function findSolutionFile(id: string): string | null {
  const solutionsDir = getSolutionsDir();
  const subdirs = ['api-quirks', 'error-resolutions', 'workarounds', 'patterns'];
  for (const sub of subdirs) {
    const dir = join(solutionsDir, sub);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir);
    const match = files.find(f => f.startsWith(id));
    if (match) return readFileSync(join(dir, match), 'utf-8');
  }
  return null;
}

export function registerSolutions(program: Command): void {
  const solutions = program.command('solutions').description('Self-healing knowledge base commands');

  solutions
    .command('list')
    .description('List all known solutions')
    .option('-o, --format <format>', 'Output format: json, table, csv')
    .action((opts: Record<string, unknown>) => {
      const entries = parseIndex();
      if (entries.length === 0) {
        console.log(chalk.dim('No solutions documented yet.'));
        return;
      }
      const outOpts: OutputOptions = { format: opts['format'] as OutputOptions['format'] };
      printOutput(entries, outOpts);
    });

  solutions
    .command('search <keyword>')
    .description('Search solutions by keyword, tag, or error code')
    .option('-o, --format <format>', 'Output format')
    .action((keyword: string, opts: Record<string, unknown>) => {
      const entries = parseIndex();
      const kw = keyword.toLowerCase();
      const matches = entries.filter(e =>
        e.title.toLowerCase().includes(kw) ||
        e.tags.toLowerCase().includes(kw) ||
        e.category.toLowerCase().includes(kw) ||
        e.id.includes(kw)
      );

      if (matches.length === 0) {
        console.log(chalk.dim(`No solutions found for "${keyword}".`));
        return;
      }
      printOutput(matches, { format: opts['format'] as OutputOptions['format'] });
    });

  solutions
    .command('show <id>')
    .description('Show full solution by ID')
    .action((id: string) => {
      const content = findSolutionFile(id);
      if (!content) {
        console.error(chalk.red(`Solution ${id} not found.`));
        process.exit(1);
      }
      console.log(content);
    });
}
