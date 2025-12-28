// pages/account/edit/social.tsx
import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function Social() {
    return (
        <>
            <Header title="ソーシャル連携" />

            <div className={Style.container}>
                <div className={Style.card}>
                    <button className={Style.button}>Google連携</button>
                    <br /><br />
                    <button className={Style.button}>LINE連携</button>
                </div>
            </div>
        </>
    );
}
