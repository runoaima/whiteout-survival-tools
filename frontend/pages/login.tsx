import { useState } from "react";
import { useRouter } from "next/router";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import Style from "@/styles/login-form.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      await loginWithEmail(email, password);
      router.push("/account");
    } catch {
      setError("ログインに失敗しました");
    }
  };

  const googleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/account");
    } catch {
      setError("Googleログインに失敗しました");
    }
  };

  return (
    <div className={Style.container}>
      <div className={Style.header}>
        <h1>ログイン</h1>
      </div>

      <div className={Style.card}>
        {error && <p className={Style.error}>{error}</p>}

        <label>メールアドレス</label>
        <input
          className={Style.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>パスワード</label>
        <input
          className={Style.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={Style.forgot}>パスワードを忘れた方はこちら</div>

        <button className={Style.loginBtn} onClick={login}>
          ログインする
        </button>

        <div className={Style.or}>または</div>

        <button className={`${Style.social} ${Style.apple}`}>
           Appleでサインイン
        </button>

        <button
          className={`${Style.social} ${Style.google}`}
          onClick={googleLogin}
        >
          Googleでログイン
        </button>

        <button className={`${Style.social} ${Style.line}`}>
          LINEでログイン
        </button>

        <div className={Style.signup}>
          アカウントをお持ちでない方
          <button onClick={() => router.push("/signup")}>
            新規会員登録
          </button>
        </div>
      </div>
    </div>
  );
}
