import { useRouter } from "next/router";
import Style from "@/styles/account/setting.module.css";
import Header from "@/components/Header";

export default function AccountSettings() {
    const router = useRouter();

    return (
        <>
            <Header title="アカウント設定" />

            <div className={Style.container}>
                {/* ===== プロフィール ===== */}
                <h1 className={Style.title}>プロフィール変更</h1>

                <div className={Style.section}>
                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/name")}
                    >
                        ユーザー名変更
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/profile")}
                    >
                        登録内容変更
                        <span className={Style.alert}>未入力の項目があります</span>
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/icon")}
                    >
                        プロフィール画像変更
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/bio")}
                    >
                        自己紹介文変更
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/game")}
                    >
                        ゲームプロフィール変更
                    </div>
                </div>

                {/* ===== アカウント設定 ===== */}
                <h2 className={Style.subtitle}>アカウント設定</h2>

                <div className={Style.section}>
                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/email")}
                    >
                        メールアドレス変更
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/mail-setting")}
                    >
                        メール受信設定
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/privacy")}
                    >
                        プライバシー設定
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/sms")}
                    >
                        SMS認証
                    </div>

                    <div
                        className={Style.item}
                        onClick={() => router.push("/account/edit/social")}
                    >
                        ソーシャルログイン連携管理
                    </div>
                </div>
            </div>
        </>
    );
}
