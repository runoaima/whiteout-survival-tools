import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function SMS() {
    return (
        <>
            <Header title="SMS認証" />

            <div className={Style.container}>
                <div className={Style.card}>
                    <input
                        className={Style.input}
                        placeholder="電話番号"
                    />
                    <button className={Style.button}>送信</button>
                </div>
            </div>
        </>
    );
}
