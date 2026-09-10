export async function attempt(task: Promise<unknown>): Promise<boolean> {
  try {
    await task;
    return true;
  } catch {
    return false;
  }
}

export async function runInBackground(task: Promise<unknown>): Promise<void> {
  try {
    await task;
  } catch (error) {
    if (__DEV__) {
      console.warn('Background task failed', error);
    }
  }
}
