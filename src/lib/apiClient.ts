import { loadData, saveData } from "../data";

export async function fetchFromApiOrLocal<T>(endpoint: string, localKey: string, defaultValue: T): Promise<T> {
  try {
    const res = await fetch(`/api/${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      if (data !== null && data !== undefined) {
        // If it's an array and not empty, or if it's an object
        if (!Array.isArray(data) || data.length > 0) {
          saveData(localKey, data);
          return data as T;
        }
      }
    }
  } catch (err) {
    console.warn(`[API] Could not fetch /api/${endpoint}, using localStorage:`, err);
  }
  return loadData(localKey, defaultValue);
}

export async function saveItemToApi<T>(endpoint: string, item: T): Promise<boolean> {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteItemFromApi(endpoint: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/${endpoint}/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}
