import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function EditEmail() {
    return (
        <>
            <Header title="メールアドレス変更" />

            <div className={Style.container}>
                <div className={Style.card}>
                    <label className={Style.label}>新しいメールアドレス</label>
                    <input className={Style.input} />

                    <button className={Style.button}>変更する</button>
                </div>
            </div>
        </>
    );
}
