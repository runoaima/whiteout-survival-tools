import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/router";
import Style from "@/styles/account/security.module.css";

export default function SecurityPage() {
  const router = useRouter();

  const logout = async () => {
    await signOut(getFirebaseAuth());
    router.push("/login");
  };

  return (
    <div className={Style.container}>
      <h2>セキュリティ</h2>

      <button className={Style.logout} onClick={logout}>
        ログアウト
      </button>
    </div>
  );
}
