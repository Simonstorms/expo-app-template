import type { Json } from '@/types/database';

export function toJson(value: unknown): Json {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toJson);
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).flatMap(([key, entry]) =>
      entry === undefined ? [] : [[key, toJson(entry)] as const],
    );
    return Object.fromEntries(entries);
  }
  return null;
}
