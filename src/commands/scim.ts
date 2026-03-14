import { Command } from 'commander';
import type { ToriiClient } from '../client.js';
import { printOutput, printError, type OutputOptions } from '../utils/output.js';
import { paginateScim } from '../utils/pagination.js';
import { checkWritePermission } from '../utils/safety.js';
import type { ToriiConfig, SCIMUser } from '../types/index.js';

export function registerScim(
  program: Command,
  getClient: () => ToriiClient,
  getConfig: () => ToriiConfig
): void {
  const scim = program.command('scim').description('SCIM 2.0 provisioning commands (requires separate SCIM API key)');

  scim
    .command('resource-types')
    .description('List SCIM resource types')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getScimClient(getClient()).get<unknown>('/scim/v2/ResourceTypes');
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scim
    .command('schemas')
    .description('List SCIM schemas')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getScimClient(getClient()).get<unknown>('/scim/v2/Schemas');
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scim
    .command('config')
    .description('Get SCIM service provider configuration')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const data = await getScimClient(getClient()).get<unknown>('/scim/v2/ServiceProviderConfig');
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  const scimUsers = scim.command('users').description('SCIM user provisioning');

  scimUsers
    .command('list')
    .description('List SCIM users')
    .option('-o, --format <format>', 'Output format')
    .option('--count <n>', 'Items per page', parseInt)
    .option('--limit <n>', 'Max total results', parseInt)
    .option('--no-paginate', 'First page only')
    .option('--filter <filter>', 'SCIM filter expression')
    .option('--raw', 'Raw API response')
    .action(async (opts: Record<string, unknown>) => {
      try {
        const params: Record<string, unknown> = {};
        if (opts['filter']) params['filter'] = opts['filter'];

        const results = await paginateScim<SCIMUser>(
          getScimClient(getClient()),
          '/scim/v2/Users',
          params,
          {
            limit: opts['limit'] as number,
            noPaginate: opts['paginate'] === false,
            count: opts['count'] as number,
          }
        );
        printOutput(results, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scimUsers
    .command('get <idUser>')
    .description('Get a SCIM user by ID')
    .option('-o, --format <format>', 'Output format')
    .option('--raw', 'Raw API response')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      try {
        const data = await getScimClient(getClient()).get<SCIMUser>(`/scim/v2/Users/${idUser}`);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scimUsers
    .command('create')
    .description('Create a SCIM user')
    .requiredOption('--username <email>', 'Email (userName) — cannot be changed after creation')
    .option('--given-name <name>', 'First name')
    .option('--family-name <name>', 'Last name')
    .option('--user-type <role>', 'Torii role / user type')
    .option('--active', 'Set active (default true)')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        userName: opts['username'],
        active: opts['active'] !== false,
      };
      if (opts['givenName'] || opts['familyName']) {
        body['name'] = { givenName: opts['givenName'], familyName: opts['familyName'] };
      }
      if (opts['userType']) body['userType'] = opts['userType'];

      const url = `${getConfig().baseUrl}/scim/v2/Users`;
      const proceed = await checkWritePermission({
        operation: `create SCIM user ${opts['username']}`,
        method: 'POST', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getScimClient(getClient()).post<SCIMUser>('/scim/v2/Users', body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scimUsers
    .command('update <idUser>')
    .description('Full update (PUT) of a SCIM user')
    .requiredOption('--username <email>', 'userName / email')
    .option('--user-type <role>', 'Torii role')
    .option('--active', 'Set active')
    .option('--no-active', 'Set inactive (deactivate user)')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        id: Number(idUser),
        userName: opts['username'],
      };
      if (opts['active'] !== undefined) body['active'] = opts['active'];
      if (opts['userType']) body['userType'] = opts['userType'];

      const url = `${getConfig().baseUrl}/scim/v2/Users/${idUser}`;
      const proceed = await checkWritePermission({
        operation: `update SCIM user ${idUser}`,
        method: 'PUT', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getScimClient(getClient()).put<SCIMUser>(`/scim/v2/Users/${idUser}`, body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scimUsers
    .command('patch <idUser>')
    .description('Partial update (PATCH) of a SCIM user')
    .option('--deactivate', 'Deactivate user (set active=false)')
    .option('--activate', 'Activate user (set active=true)')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .option('-o, --format <format>', 'Output format')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      const ops: Array<{ op: string; path: string; value: string }> = [];
      if (opts['deactivate']) ops.push({ op: 'replace', path: 'active', value: 'false' });
      if (opts['activate']) ops.push({ op: 'replace', path: 'active', value: 'true' });
      if (ops.length === 0) {
        printError('No patch operations specified. Use --deactivate or --activate.');
        process.exit(1);
      }
      const body = {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
        Operations: ops,
      };
      const url = `${getConfig().baseUrl}/scim/v2/Users/${idUser}`;
      const proceed = await checkWritePermission({
        operation: `patch SCIM user ${idUser}`,
        method: 'PATCH', url, body,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        const data = await getScimClient(getClient()).patch<SCIMUser>(`/scim/v2/Users/${idUser}`, body);
        printOutput(data, buildOutOpts(opts));
      } catch (err) { handleError(err); }
    });

  scimUsers
    .command('delete <idUser>')
    .description('Permanently delete a SCIM user')
    .option('--dry-run', 'Show request without sending')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (idUser: string, opts: Record<string, unknown>) => {
      const url = `${getConfig().baseUrl}/scim/v2/Users/${idUser}`;
      const proceed = await checkWritePermission({
        operation: `DELETE SCIM user ${idUser} (PERMANENT)`,
        method: 'DELETE', url,
        dryRun: !!opts['dryRun'], force: !!opts['yes'], config: getConfig(),
      });
      if (!proceed) return;
      try {
        await getScimClient(getClient()).delete(`/scim/v2/Users/${idUser}`);
        console.log(`SCIM user ${idUser} deleted.`);
      } catch (err) { handleError(err); }
    });
}

function getScimClient(client: ToriiClient): ToriiClient {
  try {
    return client.withScimKey();
  } catch {
    // No SCIM key configured — fall through; the API will return 401
    return client;
  }
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
