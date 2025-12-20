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
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import { saveToolCalculation } from "@/lib/saveToolCalculation";
import { getAuth } from "firebase/auth";




export default function FireCrystalTool() {


    // 各施設の start / end を state で管理
    const [levels, setLevels] = useState(
        setNames.map(() => ({ start: 0, end: 0 }))
    );

    // 一括設定用
    const [bulkStart, setBulkStart] = useState<number>(0);
    const [bulkEnd, setBulkEnd] = useState<number>(0);

    type MaterialTable = Record<number, string[]>;



    function applyBulkLevels(start: number, end: number) {
        setLevels(prev =>
            prev.map(() => ({
                start,
                end,
            }))
        );
    }


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
                    { label: "初心者ガイド", href: "/guides/beginner" },
                    { label: "素材計算ツール", href: "/tools/materials" },
                    { label: "時間計算ツール", href: "/tools/time" },
                    { label: "イベント攻略", href: "/guides/events" },
                    { label: "FAQ", href: "/guides/faq" },
                ]}
            />

            <PageIntro
                title="Whiteout Survival 総合攻略トップ"
                updatedAt="2025年12月19日"
                description="Whiteout Survivalの攻略情報と各種計算ツールをまとめた総合サイトです。初心者向けガイドから素材・時間計算ツールまで網羅しています。"
                toc={[
                    { label: "火晶計算ツール", targetId: "fire-crystal" },
                ]}
            />
            <main>
                <section id="fire-crystal" className={Style.section}>
                    <h1>火晶計算ツール</h1>
                    <p>※ レベルを逆に入力すると値は出ません</p>

                    <h1>火晶計算ツール</h1>
                    <p>※ レベルを逆に入力すると値は出ません</p>

                    {/* 一括設定 */}
                    <div style={{ marginBottom: "16px" }}>
                        <strong>全施設一括設定</strong><br />

                        現在：
                        <select
                            value={bulkStart}
                            onChange={e => {
                                const newStart = Number(e.target.value);
                                setBulkStart(newStart);

                                setLevels(prev =>
                                    prev.map(item => ({
                                        start: newStart,
                                        end: item.end,
                                    }))
                                );
                            }}
                        >
                            {fireLevels.map((l, idx) => (
                                <option key={idx} value={idx}>{l}</option>
                            ))}
                        </select>

                        希望：
                        <select
                            value={bulkEnd}
                            onChange={e => {
                                const newEnd = Number(e.target.value);
                                setBulkEnd(newEnd);

                                setLevels(prev =>
                                    prev.map(item => ({
                                        start: item.start,
                                        end: newEnd,
                                    }))
                                );
                            }}
                        >
                            {fireLevels.map((l, idx) => (
                                <option key={idx} value={idx}>{l}</option>
                            ))}
                        </select>

                        <hr />
                    </div>



                    {/* 入力欄 */}
                    {setNames.map((name, i) => (
                        <div key={i}>
                            <strong>{name}</strong><br />

                            現在：
                            <select
                                value={levels[i].start}
                                onChange={e => updateLevel(i, "start", Number(e.target.value))}
                            >
                                {fireLevels.map((l, idx) => (
                                    <option key={idx} value={idx}>{l}</option>
                                ))}
                            </select>

                            希望：
                            <select
                                value={levels[i].end}
                                onChange={e => updateLevel(i, "end", Number(e.target.value))}
                            >
                                {fireLevels.map((l, idx) => (
                                    <option key={idx} value={idx}>{l}</option>
                                ))}
                            </select>

                            <hr />
                        </div>
                    ))}

                    {/* 結果テーブル */}
                    <div className={Style.resultTableContainer}>
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
                        <button
                            onClick={async () => {
                                try {
                                    await saveToolCalculation(
                                        "fire_crystal",
                                        "火晶計算",
                                        {
                                            levels,
                                        },
                                        {
                                            perSet: totalsPerSet,
                                            total: totalAll,
                                        }
                                    );
                                    alert("計算結果を保存しました");
                                } catch (e) {
                                    if (e instanceof Error && e.message === "NOT_LOGGED_IN") {
                                        alert("保存するにはログインが必要です");
                                    } else {
                                        alert("保存に失敗しました");
                                    }
                                }

                            }}
                        >
                            計算結果を保存
                        </button>


                    </div>
                </section>
            </main >
        </>
    );
}
