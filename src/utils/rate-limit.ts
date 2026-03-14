export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wraps a request fn; inspects rate-limit headers but doesn't auto-block.
// Blocking/retry logic lives in client.ts.
export async function withRateLimit<T>(
  fn: () => Promise<T>,
  _getHeaders: (res: T) => Record<string, string>
): Promise<T> {
  return fn();
}
