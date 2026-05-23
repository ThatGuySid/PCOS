import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryStore = new Map<string, string>();
let warnedOnce = false;

function warnOnce(error: unknown) {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn("[storage] AsyncStorage unavailable, using memory only", error);
}

async function safeGetItem(key: string): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) memoryStore.set(key, value);
    return value;
  } catch (error) {
    warnOnce(error);
    return memoryStore.get(key) ?? null;
  }
}

async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
    memoryStore.set(key, value);
  } catch (error) {
    warnOnce(error);
    memoryStore.set(key, value);
  }
}

async function safeRemoveItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    warnOnce(error);
  } finally {
    memoryStore.delete(key);
  }
}

export const storage = {
  getItem: safeGetItem,
  setItem: safeSetItem,
  removeItem: safeRemoveItem,
};

export type StorageLike = typeof storage;
