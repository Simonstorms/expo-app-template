import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK_SIZE = 1800;
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

const queues = new Map<string, Promise<unknown>>();

function enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
  const tail = queues.get(key) ?? Promise.resolve();
  const next = tail.then(task, task);
  queues.set(
    key,
    next.then(
      () => undefined,
      () => undefined,
    ),
  );
  return next;
}

type StoredMeta = { count: number; generation: number | null };

function parseMeta(raw: string | null): StoredMeta | null {
  if (raw === null) return null;
  const [countRaw, generationRaw] = raw.split('|');
  const count = Number(countRaw);
  if (!Number.isFinite(count) || count <= 0) return null;
  if (generationRaw === undefined) return { count, generation: null };
  const generation = Number(generationRaw);
  if (!Number.isFinite(generation)) return null;
  return { count, generation };
}

function chunkKey(key: string, generation: number | null, index: number): string {
  return generation === null ? `${key}.${index}` : `${key}.${generation}.${index}`;
}

async function readMeta(key: string): Promise<StoredMeta | null> {
  return parseMeta(await SecureStore.getItemAsync(key));
}

async function deleteChunks(key: string, meta: StoredMeta | null): Promise<void> {
  if (meta === null) return;
  for (let i = 0; i < meta.count; i++) {
    await SecureStore.deleteItemAsync(chunkKey(key, meta.generation, i));
  }
}

async function readItem(key: string): Promise<string | null> {
  const meta = await readMeta(key);
  if (meta === null) return null;
  let value = '';
  for (let i = 0; i < meta.count; i++) {
    const part = await SecureStore.getItemAsync(chunkKey(key, meta.generation, i));
    if (part === null) return null;
    value += part;
  }
  return value;
}

async function writeItem(key: string, value: string): Promise<void> {
  const previous = await readMeta(key);
  const generation = (previous?.generation ?? 0) + 1;
  const count = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(
      chunkKey(key, generation, i),
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    );
  }
  await SecureStore.setItemAsync(key, `${count}|${generation}`);
  await deleteChunks(key, previous);
}

async function deleteItem(key: string): Promise<void> {
  const meta = await readMeta(key);
  await SecureStore.deleteItemAsync(key);
  await deleteChunks(key, meta);
}

async function getItem(key: string): Promise<string | null> {
  if (isServer) return null;
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  return enqueue(key, () => readItem(key));
}

async function setItem(key: string, value: string): Promise<void> {
  if (isServer) return;
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  await enqueue(key, () => writeItem(key, value));
}

async function removeItem(key: string): Promise<void> {
  if (isServer) return;
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  await enqueue(key, () => deleteItem(key));
}

export const secureStorage = { getItem, setItem, removeItem };
