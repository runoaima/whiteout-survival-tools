import { useState } from "react";
import Header from "@/components/Header";
import styles from "@/styles/Login.module.css";
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithApple,
} from "@/lib/auth";

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
          placeholder="あなたのメールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={styles.label}>パスワード</label>
        <input
          type="password"
          className={styles.input}
          placeholder="あなたのパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a className={styles.forgot}>パスワードを忘れた方はこちら</a>

        <button
          className={styles.loginButton}
          onClick={() => loginWithEmail(email, password)}
        >
          ログインする
        </button>

        <div className={styles.or}>または</div>

        <button
          className={`${styles.socialButton} ${styles.apple}`}
          onClick={loginWithApple}
        >
           Appleでサインイン
        </button>

        <button
          className={`${styles.socialButton} ${styles.google}`}
          onClick={loginWithGoogle}
        >
          Googleでログイン
        </button>

        <div className={styles.registerBox}>
          <p>アカウントをお持ちでない方</p>
          <button className={styles.registerButton}>
            新規会員登録
          </button>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
    return {
        props: {},
    };
}
