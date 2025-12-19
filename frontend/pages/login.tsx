import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/");
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ログイン</h1>

      {!user ? (
        <>
          <button onClick={loginWithGoogle}>
            Googleでログイン
          </button>
        </>
      ) : (
        <>
          <p>ログイン中：{user.email}</p>
          <button onClick={logout}>ログアウト</button>
        </>
      )}
    </div>
  );
}
