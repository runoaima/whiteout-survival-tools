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
const Header = dynamic(() => import("@/components/Header"), {
    ssr: false,
});





export default function FireCrystalTool() {


    // 各施設の start / end を state で管理
    const [levels, setLevels] = useState(
        setNames.map(() => ({ start: 0, end: 0 }))
    );

    // 一括設定用
    const [bulkStart, setBulkStart] = useState<number>(0);
    const [bulkEnd, setBulkEnd] = useState<number>(0);

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


    // 火晶・製錬火晶（常に「個」）
    function formatCrystal(value: number) {
        return `${Math.round(value)} 個`;
    }

    // 生肉・木材・石炭・鉄鉱
    // value はすでに「M」単位
    function formatResourceMB(value: number) {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(2)} B`;
        }
        return `${value.toFixed(2)} M`;
    }



    function formatCell(key: string, value: number) {
        if (key === "所要時間") {
            return formatTime(value);
        }

        // 火晶系（個）
        if (["火晶", "製錬火晶"].includes(key)) {
            return formatCrystal(value);
        }

        // 資源系（M → B）
        if (["生肉", "木材", "石炭", "鉄鉱"].includes(key)) {
            return formatResourceMB(value);
        }

        return value;
    }



    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);


    function formatTime(minutes: number) {
        const m = Math.round(minutes);
        const d = Math.floor(m / 1440);
        const h = Math.floor((m % 1440) / 60);
        const min = m % 60;

        if (isMobile) {
            return `${d}d ${h}h`;
        }
        return `${d}日 ${h}時間 ${min}分`;
    }

    function LevelSelector({
        value,
        onChange,
    }: {
        value: number;
        onChange: (v: number) => void;
    }) {
        return (
            <div className={Style.levelSelector}>
                <button
                    onClick={() => onChange(Math.max(0, value - 1))}
                >
                    −
                </button>

                <select
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                >
                    {fireLevels.map((l, idx) => (
                        <option key={idx} value={idx}>
                            {l}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => onChange(Math.min(fireLevels.length - 1, value + 1))}
                >
                    ＋
                </button>
            </div>
        );
    }




    // 計算
    const totalsPerSet = setNames.map(() => ({
        火晶: 0, 製錬火晶: 0, 生肉: 0, 木材: 0, 石炭: 0, 鉄鉱: 0, 所要時間: 0
    }));

    const totalAll = { ...totalsPerSet[0] };

    levels.forEach((lv, i) => {
        if (lv.start >= lv.end) return;

        const table = getMaterialTable(setNames[i]);

        for (let l = lv.start; l < lv.end; l++) {
            table[l]?.forEach((entry: string) => {
                const [name, val] = entry.split("×");
                const key = name as keyof (typeof totalsPerSet)[number];
                const num = Number(val);

                totalsPerSet[i][key] += num;
                totalAll[key] += num;
            });

        }
    });

    return (
        <>
            {/* 固定ヘッダー */}
            <Header title="Whiteout Survival" />

            {/* ヘッダー下の画像＋タイトル */}
            <PageHero
                title="Whiteout Survival 総合攻略"
                imageUrl="/images/home-hero.png"
            />

            {/* テキストカテゴリ（軽量ナビ） */}
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
                title="火晶計算ツール"
                updatedAt="2025年12月19日"
                description="火晶（Blast Crystal）および製錬火晶（Refined Blast Crystal）の必要数を計算するツールです。各施設の現在レベルと希望レベルを選択すると、必要な火晶・製錬火晶および資源、所要時間を表示します。"
                toc={[
                    { label: "火晶計算ツール", targetId: "fire-crystal" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />
            <main>
                <section id="fire-crystal" className={Style.section}>
                    <div className={Style.sectionTitle}>火晶計算ツール</div>
                    <p>※ レベルを逆に入力すると値は出ません</p>


                    {/* 一括設定 */}
                    <div className={Style.frame}>
                        <div className={Style.card}>
                            <div className={Style.cardTitle}>全施設一括設定</div>

                            <div className={Style.row}>
                                <span>現在</span>
                                <LevelSelector
                                    value={bulkStart}
                                    onChange={(v) => {
                                        setBulkStart(v);
                                        setLevels(prev =>
                                            prev.map(item => ({ start: v, end: item.end }))
                                        );
                                    }}
                                />
                            </div>

                            <div className={Style.row}>
                                <span>目標</span>
                                <LevelSelector
                                    value={bulkEnd}
                                    onChange={(v) => {
                                        setBulkEnd(v);
                                        setLevels(prev =>
                                            prev.map(item => ({ start: item.start, end: v }))
                                        );
                                    }}
                                />
                            </div>
                        </div>





                        {/* 入力欄 */}
                        <div className={Style.card}>
                            <div className={Style.cardTitle}>建物別設定</div>

                            <div className={Style.buildingList}>
                                {setNames.map((name, i) => (
                                    <div key={i} className={Style.buildingRow}>
                                        {/* 左：建物名 */}
                                        <div className={Style.buildingName}>
                                            {name}
                                        </div>

                                        {/* 右：セレクタ */}
                                        <div className={Style.buildingSelectors}>
                                            <div className={Style.selectorGroup}>
                                                <span>現在</span>
                                                <LevelSelector
                                                    value={levels[i].start}
                                                    onChange={(v) => updateLevel(i, "start", v)}
                                                />
                                            </div>

                                            <div className={Style.selectorGroup}>
                                                <span>目標</span>
                                                <LevelSelector
                                                    value={levels[i].end}
                                                    onChange={(v) => updateLevel(i, "end", v)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>




                    {/* 結果テーブル */}
                    <div className={Style.resultTitle}>必要素材一覧</div>
                    < div className={Style.resultTableScale} >
                        <table className={Style.resultTable}>
                            <thead>
                                <tr>
                                    <th>施設</th>
                                    {materialKeys.map(k => <th key={k}>{k}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {setNames.map((name, i) => (
                                    <tr key={i}>
                                        <td>{name}</td>
                                        {materialKeys.map(k => {
                                            const key = k as keyof (typeof totalsPerSet)[number];
                                            return (
                                                <td key={k} data-label={k}>
                                                    {formatCell(k, totalsPerSet[i][key])}
                                                </td>
                                            );
                                        })}

                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>合計</strong></td>
                                    {materialKeys.map(k => {
                                        const key = k as keyof typeof totalAll;
                                        return (
                                            <td key={k} data-label={k}>
                                                <strong>{formatCell(k, totalAll[key])}</strong>
                                            </td>
                                        );
                                    })}

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="usage" className={Style.section}>
                    <div className={Style.sectionTitle}>使い方</div>
                    <ol className={Style.usageList}>
                        <li>各施設の現在レベルと目標レベルを選択します。</li>
                        <li>必要な火晶・製錬火晶および資源、所要時間が自動的に計算され、表に表示されます。</li>
                        <li>全施設一括設定を使うと、すべての施設のレベルを一度に設定できます。</li>
                    </ol>
                </section>
            </main >

            <Footer />
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {},
    };
}
