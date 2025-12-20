import axios from "axios";
import { getFirebaseAuth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 認証トークン付き POST
export async function postWithAuth<T extends object>(
  url: string,
  data: T
) {
  const auth = await getFirebaseAuth();
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  return api.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
