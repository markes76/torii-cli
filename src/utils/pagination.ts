import type { ToriiClient } from '../client.js';

export interface PaginationOptions {
  limit?: number;       // max total results (0 = all)
  noPaginate?: boolean; // fetch first page only
  size?: number;        // per-page size sent to API
  cursor?: string;      // start cursor
}

export interface CursorResponse<_T> {
  nextCursor?: string | null;
  [key: string]: unknown;
}

/**
 * Auto-paginate a cursor-based endpoint.
 * resourceKey: the key in the response that holds the array (e.g. "users", "apps")
 */
export async function paginate<T>(
  client: ToriiClient,
  endpoint: string,
  params: Record<string, unknown>,
  resourceKey: string,
  opts: PaginationOptions = {}
): Promise<T[]> {
  const results: T[] = [];
  let cursor: string | undefined = opts.cursor;
  const pageSize = opts.size;

  do {
    const reqParams: Record<string, unknown> = { ...params };
    if (pageSize) reqParams['size'] = pageSize;
    if (cursor) reqParams['cursor'] = cursor;

    const page = await client.get<CursorResponse<T>>(endpoint, reqParams);
    const items = (page[resourceKey] as T[] | undefined) ?? [];
    results.push(...items);

    // --no-paginate: only first page
    if (opts.noPaginate) break;

    // --limit: stop once we have enough
    if (opts.limit && opts.limit > 0 && results.length >= opts.limit) {
      return results.slice(0, opts.limit);
    }

    cursor = page.nextCursor ?? undefined;
  } while (cursor);

  return results;
}

/**
 * SCIM uses offset pagination (startIndex / count / totalResults).
 */
export interface ScimPaginationOptions {
  limit?: number;
  noPaginate?: boolean;
  count?: number; // items per page
}

export async function paginateScim<T extends object>(
  client: ToriiClient,
  endpoint: string,
  params: Record<string, unknown>,
  opts: ScimPaginationOptions = {}
): Promise<T[]> {
  const results: T[] = [];
  let startIndex = 1;
  const itemsPerPage = opts.count ?? 50;

  do {
    const reqParams: Record<string, unknown> = {
      ...params,
      startIndex,
      count: itemsPerPage,
    };

    const page = await client.get<{
      totalResults: number;
      itemsPerPage: number;
      startIndex: number;
      Resources?: T[];
    }>(endpoint, reqParams);

    const items = page.Resources ?? [];
    results.push(...items);

    if (opts.noPaginate) break;
    if (opts.limit && opts.limit > 0 && results.length >= opts.limit) {
      return results.slice(0, opts.limit);
    }

    const fetched = startIndex - 1 + items.length;
    if (fetched >= page.totalResults) break;
    startIndex += itemsPerPage;
  } while (true);

  return results;
}
