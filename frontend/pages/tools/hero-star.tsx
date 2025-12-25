import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Style from "@/styles/tools/hero-star.module.css";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import Footer from "@/components/Footer";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

/* ===============================
   定数・型
=============================== */

const PIECES_PER_STAR = 6;

type HeroLevel = {
    start: number;
    end: number;
};

const materialKeys = ["英雄の欠片"] as const;

const materialTable: Record<number, string[]> = {
    1: ["英雄の欠片×1"],
    2: ["英雄の欠片×1"],
    3: ["英雄の欠片×2"],
    4: ["英雄の欠片×2"],
    5: ["英雄の欠片×2"],
    6: ["英雄の欠片×2"],
    7: ["英雄の欠片×5"],
    8: ["英雄の欠片×5"],
    9: ["英雄の欠片×5"],
    10: ["英雄の欠片×5"],
    11: ["英雄の欠片×5"],
    12: ["英雄の欠片×15"],
    13: ["英雄の欠片×15"],
    14: ["英雄の欠片×15"],
    15: ["英雄の欠片×15"],
    16: ["英雄の欠片×15"],
    17: ["英雄の欠片×15"],
    18: ["英雄の欠片×40"],
    19: ["英雄の欠片×40"],
    20: ["英雄の欠片×40"],
    21: ["英雄の欠片×40"],
    22: ["英雄の欠片×40"],
    23: ["英雄の欠片×40"],
    24: ["英雄の欠片×100"],
    25: ["英雄の欠片×100"],
    26: ["英雄の欠片×100"],
    27: ["英雄の欠片×100"],
    28: ["英雄の欠片×100"],
    29: ["英雄の欠片×100"],
    30: ["英雄の欠片×100"],
};

/* ===============================
   星表示
=============================== */

function Stars({ level }: { level: number }) {
    const stars = Math.floor(level / PIECES_PER_STAR);
    const pieces = level % PIECES_PER_STAR;

    return (
        <div className={Style.stars}>
            {Array.from({ length: stars }).map((_, i) => (
                <span key={`s${i}`} className={Style.star} />
            ))}
            {Array.from({ length: pieces }).map((_, i) => (
                <span key={`p${i}`} className={Style.piece} />
            ))}
        </div>
    );
}

/* ===============================
   メイン
=============================== */

export default function HeroStarTool() {
    const [heroes, setHeroes] = useState<HeroLevel[]>([
        { start: 0, end: 30 },
    ]);

    /* ===== 追加・削除 ===== */

    function addHero() {
        setHeroes(prev => [...prev, { start: 0, end: 30 }]);
    }

    function removeHero() {
        setHeroes(prev => prev.slice(0, -1));
    }

    function updateHero(
        index: number,
        key: "start" | "end",
        value: number
    ) {
        setHeroes(prev =>
            prev.map((h, i) =>
                i === index
                    ? {
                          ...h,
                          [key]:
                              key === "start"
                                  ? Math.min(value, h.end)
                                  : Math.max(value, h.start),
                      }
                    : h
            )
        );
    }

    /* ===== 計算 ===== */

    const totalsPerHero = heroes.map(() => ({ "英雄の欠片": 0 }));
    const totalAll = { "英雄の欠片": 0 };

    heroes.forEach((hero, i) => {
        for (let lv = hero.start; lv < hero.end; lv++) {
            materialTable[lv + 1]?.forEach(entry => {
                const [name, val] = entry.split("×");
                const num = Number(val);
                totalsPerHero[i][name as "英雄の欠片"] += num;
                totalAll[name as "英雄の欠片"] += num;
            });
        }
    });

    /* ===== JSX ===== */

    return (
        <>
            <Header title="Whiteout Survival" />
            <PageHero
                title="英雄 星レベル計算"
                imageUrl="/images/home-hero.png"
            />

            <CategoryTextNav
                categories={[
                    { label: "トップ", href: "/" },
                    { label: "素材計算", href: "/tools/materials" },
                ]}
            />

            <PageIntro
                title="英雄★計算ツール"
                updatedAt="2025年12月"
                description="英雄の星レベルに必要な欠片数を計算します。"
                toc={[
                    { label: "英雄ランク計算ツール", targetId: "hero-rank-calculator" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main>
                <div className={Style.sectionTitle}>英雄ランク計算ツール</div>
                <section className={Style.section}>
                    <div className={Style.frame}>
                        {heroes.map((hero, i) => (
                            <div key={i} className={Style.card}>
                                <h4>英雄{i + 1}</h4>

                                <label>現在Lv</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={30}
                                    value={hero.start}
                                    onChange={e =>
                                        updateHero(
                                            i,
                                            "start",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                                <Stars level={hero.start} />

                                <label>目標Lv</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={30}
                                    value={hero.end}
                                    onChange={e =>
                                        updateHero(
                                            i,
                                            "end",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                                <Stars level={hero.end} />
                            </div>
                        ))}
                    </div>

                    <div className={Style.buttonRow}>
                        <button onClick={addHero}>＋ 英雄追加</button>
                        {heroes.length > 1 && (
                            <button onClick={removeHero}>− 削除</button>
                        )}
                    </div>

                    <h3 className={Style.resultTitle}>必要素材</h3>

                    <table className={Style.resultTable}>
                        <thead>
                            <tr>
                                <th>英雄</th>
                                <th>英雄の欠片</th>
                            </tr>
                        </thead>
                        <tbody>
                            {totalsPerHero.map((t, i) => (
                                <tr key={i}>
                                    <td>英雄{i + 1}</td>
                                    <td>{t["英雄の欠片"]}</td>
                                </tr>
                            ))}
                            <tr className={Style.totalRow}>
                                <td>合計</td>
                                <td>{totalAll["英雄の欠片"]}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                
                <section id="usage" className={Style.section}>
                    <div className={Style.sectionTitle}>使い方</div>
                    <ol className={Style.usageList}>
                        <li>各英雄ごとに、現在の星レベルと目標の星レベルを選択します。</li>
                        <li>「必要素材」に、各素材の必要数が表示されます。</li>
                    </ol>
                </section>
            </main>

            <Footer />
        </>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
