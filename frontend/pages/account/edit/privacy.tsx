import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function Privacy() {
    return (
        <>
            <Header title="プライバシー設定" />

            <div className={Style.container}>
                <div className={Style.card}>
                    <label>
                        <input type="checkbox" /> プロフィールを公開する
                    </label>
                </div>
            </div>
        </>
    );
}
