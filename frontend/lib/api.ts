import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 認証トークン付きで呼ぶ例
export async function postWithAuth(url: string, data: any) {
  const token = await auth.currentUser?.getIdToken();
  return api.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

await fetch(`${API}/calc/`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
