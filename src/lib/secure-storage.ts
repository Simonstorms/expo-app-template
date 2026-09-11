import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { attempt, runInBackground } from '@/lib/tasks';

const CHUNK_SIZE = 1800;
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

const queues = new Map<string, Promise<unknown>>();

async function enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = (async () => {
    await attempt(previous);
    return await task();
  })();
  queues.set(key, runInBackground(next));
  return await next;
}

type StoredMeta = { count: number; generation: number | null };

function parseMeta(raw: string | null): StoredMeta | null {
  if (raw === null) {
    return null;
  }
  const [countRaw, generationRaw] = raw.split('|');
  const count = Number(countRaw);
  if (!Number.isFinite(count) || count <= 0) {
    return null;
  }
  if (generationRaw === undefined) {
    return { count, generation: null };
  }
  const generation = Number(generationRaw);
  if (!Number.isFinite(generation)) {
    return null;
  }
  return { count, generation };
}

function chunkKey(key: string, generation: number | null, index: number): string {
  return generation === null ? `${key}.${index}` : `${key}.${generation}.${index}`;
}

function chunkKeys(key: string, generation: number | null, count: number): string[] {
  return Array.from({ length: count }, (_, index) => chunkKey(key, generation, index));
}

async function readMeta(key: string): Promise<StoredMeta | null> {
  return parseMeta(await SecureStore.getItemAsync(key));
}

async function deleteChunks(key: string, meta: StoredMeta | null): Promise<void> {
  if (meta === null) {
    return;
  }
  await Promise.all(
    chunkKeys(key, meta.generation, meta.count).map((chunk) => SecureStore.deleteItemAsync(chunk)),
  );
}

async function readItem(key: string): Promise<string | null> {
  const meta = await readMeta(key);
  if (meta === null) {
    return null;
  }
  const parts = await Promise.all(
    chunkKeys(key, meta.generation, meta.count).map((chunk) => SecureStore.getItemAsync(chunk)),
  );
  return parts.every((part): part is string => part !== null) ? parts.join('') : null;
}

async function writeItem(key: string, value: string): Promise<void> {
  const previous = await readMeta(key);
  const generation = (previous?.generation ?? 0) + 1;
  const count = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
  await Promise.all(
    chunkKeys(key, generation, count).map((chunk, index) =>
      SecureStore.setItemAsync(chunk, value.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE)),
    ),
  );
  await SecureStore.setItemAsync(key, `${count}|${generation}`);
  await deleteChunks(key, previous);
}

async function deleteItem(key: string): Promise<void> {
  const meta = await readMeta(key);
  await SecureStore.deleteItemAsync(key);
  await deleteChunks(key, meta);
}

async function getItem(key: string): Promise<string | null> {
  if (isServer) {
    return null;
  }
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  }
  return await enqueue(key, () => readItem(key));
}

async function setItem(key: string, value: string): Promise<void> {
  if (isServer) {
    return;
  }
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  await enqueue(key, () => writeItem(key, value));
}

async function removeItem(key: string): Promise<void> {
  if (isServer) {
    return;
  }
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  await enqueue(key, () => deleteItem(key));
}

export const secureStorage = { getItem, setItem, removeItem };
