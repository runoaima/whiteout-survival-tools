import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "@/styles/Login.module.css";
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithApple,
} from "@/lib/auth";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Header title="ログイン" />

      <main className={styles.container}>
        <h1 className={styles.title}>ログイン</h1>

        <label className={styles.label}>メールアドレス</label>
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={styles.label}>パスワード</label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className={styles.loginButton}
          onClick={() => loginWithEmail(email, password)}
        >
          ログイン
        </button>

        <button onClick={loginWithGoogle}>Google</button>
        <button onClick={loginWithApple}>Apple</button>
      </main>
    </>
  );
}
