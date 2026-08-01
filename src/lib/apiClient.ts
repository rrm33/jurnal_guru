import { loadData, saveData } from "../data";

export async function fetchFromApiOrLocal<T>(endpoint: string, localKey: string, defaultValue: T): Promise<T> {
  try {
    const res = await fetch(`/api/${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      if (data !== null && data !== undefined) {
        return data as T;
      }
    }
  } catch (err) {
    console.warn(`[API] Could not fetch /api/${endpoint}, network error:`, err);
  }
  
  // Jika API mati, fallback ke defaultValue (tanpa baca localStorage)
  // Kecuali untuk auth session yang masih kita izinkan pakai loadData
  if (localKey === "app_auth_session" || localKey === "active_user_role") {
    return loadData(localKey, defaultValue);
  }
  return defaultValue;
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
