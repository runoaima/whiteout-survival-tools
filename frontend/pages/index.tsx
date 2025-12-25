import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";
import styles from "@/styles/Home.module.css";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import Footer from "@/components/Footer";

const Header = dynamic(() => import("@/components/Header"), {
    ssr: false,
});

export default function Home() {
    return (
        <>
            <Header title="Whiteout Survival" />

            <PageHero
                title="Whiteout Survival 総合攻略"
                imageUrl="/images/home-hero.png"
            />

            <CategoryTextNav
                categories={[
                    { label: "トップ", href: "/" },
                    { label: "初心者ガイド", href: "/guides/beginner" },
                    { label: "素材計算ツール", href: "/tools/materials" },
                    { label: "時間計算ツール", href: "/tools/time" },
                    { label: "イベント攻略", href: "/guides/events" },
                    { label: "FAQ", href: "/guides/faq" },
                ]}
            />

            <PageIntro
                title="Whiteout Survival 総合攻略トップ"
                updatedAt="2025年12月25日18:00"
                description="Whiteout Survivalの攻略情報と各種計算ツールをまとめた総合サイトです。"
                toc={[
                    { label: "おすすめコンテンツ", targetId: "recommend" },
                    { label: "初心者ガイド", targetId: "beginner" },
                    { label: "素材計算ツール", targetId: "materials" },
                    { label: "時間計算ツール", targetId: "time" },
                    { label: "イベント攻略", targetId: "events" },
                ]}
            />

            <main className={styles.container}>
                <SearchBar />

                <section id="recommend" className={styles.section}>
                    <h2 className={styles.sectionTitle}>おすすめコンテンツ</h2>
                    <CategoryGrid
                        items={[
                            { label: "イベントカレンダー", href: "/events/events-calendar", image: "/images/events/events-calendar.png" },
                            { label: "火晶計算ツール", href: "/tools/fire-crystal", image: "/images/home/fire-crystal-tool.png" },
                            { label: "領主装備計算ツール", href: "/tools/chief-gear", image: "/images/home/chief-gear-tool.png" },
                            { label: "行軍時間計算ツール", href: "/tools/march-time", image: "/images/home/march-time-tool.png" },
                        ]}
                    />
                </section>

                <section id="beginner" className={styles.section}>
                    <h2 className={styles.sectionTitle}>初心者ガイド</h2>
                    <CategoryGrid
                        items={[
                            { label: "ガイド", href: "/guides" },
                            { label: "マップ", href: "/guides/map" },
                            { label: "ミッション", href: "/guides/missions" },
                            { label: "データ", href: "/guides/data" },
                            { label: "アイテム", href: "/guides/items" },
                            { label: "その他", href: "/guides/other" },
                        ]}
                    />
                </section>

                <section id="materials" className={styles.section}>
                    <h2 className={styles.sectionTitle}>素材計算ツール</h2>
                    <CategoryGrid
                        items={[
                            { label: "火晶計算ツール", href: "/tools/fire-crystal", image: "/images/materials/fire_crystal/fire_crystal.png" },
                            { label: "領主装備計算ツール", href: "/tools/chief-gear", image: "/images/materials/chief_gear/chief_gear.png" },
                            { label: "領主宝石計算ツール", href: "/tools/chief-charm", image: "/images/materials/chief_charm/chief_charm.png" },
                            { label: "英雄装備計算ツール", href: "/tools/hero-gear", image: "/images/materials/hero_gear/hero_gear.png" },
                            { label: "英雄ランク計算ツール", href: "/tools/hero-star", image: "/images/materials/hero_star/hero_star.png" },
                            { label: "火晶微粒子計算ツール", href: "/tools/fire-crystal-shard", image: "/images/materials/fire-crystal-shard/fire-crystal-shard.png" },
                            { label: "研究素材計算ツール", href: "/tools/research-materials", image: "/images/materials/research_materials/research_materials.png" },
                            { label: "建物資材計算ツール", href: "/tools/building-materials", image: "/images/materials/tool-building-materials.png" },
                            { label: "英雄経験値計算ツール", href: "/tools/hero-exp", image: "/images/materials/tool-hero-exp.png" },
                            { label: "ペット材料計算ツール", href: "/tools/pet-materials", image: "/images/materials/tool-pet-materials.png" },
                            { label: "曙光同盟素材計算ツール", href: "/tools/dawn-alliance-materials", image: "/images/materials/tool-dawn-alliance-materials.png" },
                        ]}
                    />
                </section>

                <section id="time" className={styles.section}>
                    <h2 className={styles.sectionTitle}>時間計算ツール</h2>
                    <CategoryGrid
                        items={[
                            { label: "行軍時間計算ツール", href: "/tools/march-time", image: "/images/time/march-time.png" },
                            { label: "集結行軍時間計算ツール", href: "/tools/rally-march-time", image: "/images/time/rally-march-time.png" },
                        ]}
                    />
                </section>

                <section id="events" className={styles.section}>
                    <h2 className={styles.sectionTitle}>イベント攻略</h2>
                    <CategoryGrid
                        items={[
                            { label: "イベントカレンダー", href: "/events/events-calendar", image: "/images/events/events-calendar.png" },
                            { label: "過去イベント攻略", href: "/events/past-events" },
                        ]}
                    />
                </section>
            </main>

            <Footer />
        </>
    );
}
