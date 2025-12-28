import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function EditBio() {
    return (
        <>
            <Header title="自己紹介文変更" />

            <div className={Style.container}>
                <div className={Style.card}>
                    <textarea
                        className={Style.textarea}
                        placeholder="2000文字以内で入力してください"
                    />

                    <button className={Style.button}>変更する</button>
                </div>
            </div>
        </>
    );
}
