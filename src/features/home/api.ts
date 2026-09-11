import type { IconName } from '@/components/ui/icon';

export type CheckIn = {
  id: string;
  title: string;
  time: string;
  detail: string;
  symbol: IconName;
};

export function loadCheckIns(): Promise<CheckIn[]> {
  return Promise.resolve([]);
}
