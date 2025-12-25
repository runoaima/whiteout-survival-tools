import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageIntro from "@/components/PageIntro";
import { updates } from "@/data/updatesData";
import Style from "@/styles/updates.module.css";

export default function UpdatesPage() {
    return (
        <>
            <Header title="Whiteout Survival" />

            <PageHero
                title="更新履歴"
                imageUrl="/images/home-hero.png"
            />

            <PageIntro
                title="更新履歴"
                updatedAt="2025年12月26日"
                description="Whiteout Survival 攻略ツールの更新情報を掲載しています。"
                toc={[]}
            />

            <main className={Style.container}>
                {updates.map((u, i) => (
                    <section key={i} className={Style.card}>
                        <div className={Style.date}>{u.date}</div>
                        <h2 className={Style.title}>{u.title}</h2>
                        <ul className={Style.list}>
                            {u.details.map((d, idx) => (
                                <li key={idx}>{d}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </main>

            <Footer />
        </>
    );
}
