import { useSyncExternalStore } from 'react';

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

export function usePersistHydrated(store: PersistedStore): boolean {
  return useSyncExternalStore(
    store.persist.onFinishHydration,
    store.persist.hasHydrated,
    store.persist.hasHydrated,
  );
}
