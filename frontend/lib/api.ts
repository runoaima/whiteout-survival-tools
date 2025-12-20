import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 認証トークン付き POST
export async function postWithAuth<T extends object>(
  url: string,
  data: T
) {
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
