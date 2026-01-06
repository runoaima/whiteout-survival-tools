import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import Style from "@/styles/profile.module.css";

export default function AccountPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // 未ログインならログイン画面へ
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading]);

    if (loading || !user) return null;

    const logout = async () => {
        await signOut(getFirebaseAuth());
        router.push("/login");
    };

    return (
        <div className={Style.container}>
            <div className={Style.card}>
                <h1>アカウント</h1>

                <p><strong>メール：</strong>{user.email}</p>
                <p><strong>UID：</strong>{user.uid}</p>

                <button className={Style.logout} onClick={logout}>
                    ログアウト
                </button>
            </div>
        </div>
    );
}
