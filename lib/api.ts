import axios from "axios";
import { auth } from "./firebase";

export async function postCalc(data: any) {
  const token = await auth.currentUser?.getIdToken();
  return axios.post(
    "https://api.yourdomain.com/api/calc/",
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
