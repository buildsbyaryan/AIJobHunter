import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "accessToken";
const USER_ID_KEY = "userId";

// =========================
// TOKEN
// =========================

export const saveToken = async (
  token: string
): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// =========================
// USER ID
// =========================

export const saveUserId = async (
  userId: number
): Promise<void> => {
  await SecureStore.setItemAsync(
    USER_ID_KEY,
    String(userId)
  );

  console.log("USER ID SAVED:", userId);
};

export const getUserId = async (): Promise<number | null> => {
  const value = await SecureStore.getItemAsync(USER_ID_KEY);

  if (!value) {
    return null;
  }

  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

export const removeUserId = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};