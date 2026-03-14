import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { ToriiConfig } from './types/index.js';

const CONFIG_DIR = join(homedir(), '.torii-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const DEFAULT_BASE_URL = 'https://api.toriihq.com/v1.0';

// Merge: CLI flag > env var > config file > default
export function loadConfig(overrides: Partial<ToriiConfig> = {}): ToriiConfig {
  const file = readConfigFile();
  return {
    apiKey: overrides.apiKey ?? process.env.TORII_API_KEY ?? file?.apiKey ?? '',
    baseUrl: overrides.baseUrl ?? process.env.TORII_BASE_URL ?? file?.baseUrl ?? DEFAULT_BASE_URL,
    mode: (overrides.mode ?? process.env.TORII_MODE ?? file?.mode ?? 'read-only') as ToriiConfig['mode'],
    scimApiKey: overrides.scimApiKey ?? process.env.TORII_SCIM_API_KEY ?? file?.scimApiKey,
  };
}

function readConfigFile(): Partial<ToriiConfig> | null {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8')) as Partial<ToriiConfig>;
  } catch {
    return null;
  }
}

export function saveConfig(config: Partial<ToriiConfig>): void {
  const existing = readConfigFile() ?? {};
  const merged = { ...existing, ...config };
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf-8');
}

export function configExists(): boolean {
  return existsSync(CONFIG_FILE) && !!(readConfigFile()?.apiKey);
}

export function getConfigValue(key: keyof ToriiConfig): string | undefined {
  const file = readConfigFile();
  if (!file) return undefined;
  return file[key] as string | undefined;
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return '***';
  return key.slice(0, 4) + '***' + key.slice(-4);
}
