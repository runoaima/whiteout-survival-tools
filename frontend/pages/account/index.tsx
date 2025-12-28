import { useEffect } from "react";
import { useRouter } from "next/router";
import { getFirebaseAuth } from "@/lib/firebase";
import Style from "@/styles/account/index.module.css";
import Header from "@/components/Header";
import Link from "next/link";

export default function AccountPage() {
    const router = useRouter();

    useEffect(() => {
        const auth = getFirebaseAuth();
        if (!auth.currentUser) {
            router.replace("/login");
        }
    }, []);

    const user = getFirebaseAuth().currentUser;

    if (!user) return null;

    return (
        <>
            <Header title="マイページ" />
            <br/><br/>
            <div className={Style.container}>
                {/* ヘッダー */}
                <div className={Style.header}>
                    <img
                        src={user.photoURL || "/user.png"}
                        className={Style.avatar}
                    />
                    <div className={Style.userInfo}>
                        <h2 className={Style.name}>
                            {user.displayName || "名無しユーザー"}
                        </h2>
                        <p className={Style.userId}>ID: {user.uid.slice(0, 8)}</p>
                    </div>

                    <Link href="/account/setting" className={Style.settingBtn}>
                        設定
                    </Link>
                </div>

                {/* フォロー */}
                <div className={Style.follow}>
                    <div>
                        <strong>0</strong>
                        <span>フォロー</span>
                    </div>
                    <div>
                        <strong>0</strong>
                        <span>フォロワー</span>
                    </div>
                </div>

                {/* 自己紹介 */}
                <div className={Style.bio}>
                    <p>自己紹介文がありません。</p>
                    <button className={Style.bioBtn}>自己紹介文を書く</button>
                </div>

                {/* ポイント */}
                <div className={Style.pointBox}>
                    <span className={Style.point}>0pt</span>
                    <button className={Style.pointBtn}>
                        交換・履歴
                    </button>
                </div>

                {/* お知らせ */}
                <div className={Style.notice}>
                    <span className={Style.noticeTitle}>
                        重要なお知らせ
                    </span>
                    <span className={Style.noticeText}>
                        ポイントシステム改修のお知らせ
                    </span>
                </div>
            </div>
        </>
    );
}
