import {
    materialKeys,
    setNames,
    fireLevels,
    blastMaterial,
    anembassyMaterial,
    barracksMaterial,
    commandMaterial,
    militaryMaterial,
    academyMaterial,
} from "@/data/fireCrystalData";
import Style from "@/styles/tools/fire-crystal.module.css";
import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

/* ===============================
   LevelSelector（★外に出す）
=============================== */
type LevelSelectorProps = {
    value: number;
    onChange: (v: number) => void;
};

function LevelSelector({ value, onChange }: LevelSelectorProps) {
    return (
        <div className={Style.levelSelector}>
            <button onClick={() => onChange(Math.max(0, value - 1))}>−</button>

            <select
                value={value}
                onChange={e => onChange(Number(e.target.value))}
            >
                {fireLevels.map((l, idx) => (
                    <option key={idx} value={idx}>
                        {l}
                    </option>
                ))}
            </select>

            <button
                onClick={() =>
                    onChange(Math.min(fireLevels.length - 1, value + 1))
                }
            >
                ＋
            </button>
        </div>
    );
}

/* ===============================
   メイン
=============================== */
export default function FireCrystalTool() {
    const [levels, setLevels] = useState(
        setNames.map(() => ({ start: 0, end: 0 }))
    );

    const [bulkStart, setBulkStart] = useState(0);
    const [bulkEnd, setBulkEnd] = useState(0);

    type MaterialTable = Record<number, string[]>;

    function updateLevel(index: number, key: "start" | "end", value: number) {
        setLevels(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            )
        );
    }

    function getMaterialTable(name: string): MaterialTable {
        switch (name) {
            case "大溶鉱炉":
                return blastMaterial;
            case "大使館":
                return anembassyMaterial;
            case "盾兵舎":
            case "槍兵舎":
            case "弓兵舎":
                return barracksMaterial;
            case "司令部":
                return commandMaterial;
            case "軍医所":
                return militaryMaterial;
            case "戦争学園":
                return academyMaterial;
            default:
                return {};
        }
    }

    /* ===== 表示用フォーマット ===== */

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    function formatTime(minutes: number) {
        const m = Math.round(minutes);
        const d = Math.floor(m / 1440);
        const h = Math.floor((m % 1440) / 60);
        const min = m % 60;
        return isMobile ? `${d}d ${h}h` : `${d}日 ${h}時間 ${min}分`;
    }

    function formatCell(key: string, value: number) {
        if (key === "所要時間") return formatTime(value);
        if (["火晶", "製錬火晶"].includes(key)) return `${Math.round(value)} 個`;
        if (["生肉", "木材", "石炭", "鉄鉱"].includes(key)) {
            return value >= 1000
                ? `${(value / 1000).toFixed(2)} B`
                : `${value.toFixed(2)} M`;
        }
        return value;
    }

    /* ===== 計算 ===== */

    const totalsPerSet = setNames.map(() => ({
        火晶: 0,
        製錬火晶: 0,
        生肉: 0,
        木材: 0,
        石炭: 0,
        鉄鉱: 0,
        所要時間: 0,
    }));

    const totalAll = { ...totalsPerSet[0] };

    levels.forEach((lv, i) => {
        if (lv.start >= lv.end) return;
        const table = getMaterialTable(setNames[i]);

        for (let l = lv.start; l < lv.end; l++) {
            table[l]?.forEach(entry => {
                const [name, val] = entry.split("×");
                const key = name as keyof typeof totalAll;
                const num = Number(val);
                totalsPerSet[i][key] += num;
                totalAll[key] += num;
            });
        }
    });

    /* ===== JSX ===== */

    return (
        <>
            <Header title="Whiteout Survival" />
            <PageHero title="Whiteout Survival 総合攻略" imageUrl="/images/home-hero.png" />

            <CategoryTextNav
                categories={[
                    { label: "トップ", href: "/" },
                    { label: "素材計算ツール", href: "/tools/materials" },
                ]}
            />

            <PageIntro
                title="火晶計算ツール"
                updatedAt="2025年12月19日"
                description="火晶および製錬火晶の必要数を計算します。"
                toc={[
                    { label: "火晶計算ツール", targetId: "fire-crystal" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main>
                <section id="fire-crystal" className={Style.section}>
                    <div className={Style.sectionTitle}>火晶計算ツール</div>

                    {/* 一括設定 */}
                    <div className={Style.frame}>
                        <div className={Style.card}>
                            <div className={Style.cardTitle}>全施設一括設定</div>

                            <LevelSelector
                                value={bulkStart}
                                onChange={v => {
                                    setBulkStart(v);
                                    setLevels(prev =>
                                        prev.map(item => ({ start: v, end: item.end }))
                                    );
                                }}
                            />

                            <LevelSelector
                                value={bulkEnd}
                                onChange={v => {
                                    setBulkEnd(v);
                                    setLevels(prev =>
                                        prev.map(item => ({ start: item.start, end: v }))
                                    );
                                }}
                            />
                        </div>
                    </div>

                    {/* 結果 */}
                    <div className={Style.resultTitle}>必要素材一覧</div>
                    <table className={Style.resultTable}>
                        <thead>
                            <tr>
                                <th>施設</th>
                                {materialKeys.map(k => (
                                    <th key={k}>{k}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {setNames.map((name, i) => (
                                <tr key={i}>
                                    <td>{name}</td>
                                    {materialKeys.map(k => (
                                        <td key={k}>
                                            {formatCell(k, totalsPerSet[i][k as keyof typeof totalAll])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section id="usage" className={Style.section}>
                    <div className={Style.sectionTitle}>使い方</div>
                    <ol className={Style.usageList}>
                        <li>現在レベルと目標レベルを選択します。</li>
                        <li>必要素材が自動計算されます。</li>
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
