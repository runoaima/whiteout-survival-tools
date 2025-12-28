import { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Style from "@/styles/account/edit.module.css";

export default function EditName() {
    const router = useRouter();
    const [name, setName] = useState("");

    return (
        <>
            <Header title="ユーザー名変更" />

            <div className={Style.container}>
                <div className={Style.card}>
                    <label className={Style.label}>ユーザー名（15文字以内）</label>
                    <input
                        className={Style.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button className={Style.button}>変更する</button>
                </div>

                <div className={Style.back}>
                    <a onClick={() => router.back()}>← 戻る</a>
                </div>
            </div>
        </>
    );
}
