import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState } from 'react-native';

focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (status) => {
    handleFocus(status === 'active');
  });
  return () => subscription.remove();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});
