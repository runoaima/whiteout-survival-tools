import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function EditIcon() {
    return (
        <>
            <Header title="プロフィール画像変更" />

            <div className={Style.container}>
                <div className={Style.card} style={{ textAlign: "center" }}>
                    <img
                        src="/avatar.png"
                        width={120}
                        style={{ borderRadius: "50%" }}
                    />

                    <p style={{ margin: "12px 0" }}>
                        変更するには一度削除してください
                    </p>

                    <button className={Style.button}>画像を変更</button>
                </div>
            </div>
        </>
    );
}
