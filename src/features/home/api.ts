export type CheckIn = {
  id: string;
  title: string;
  time: string;
  detail: string;
  symbol: string;
};

export async function loadCheckIns(): Promise<CheckIn[]> {
  return [];
}
