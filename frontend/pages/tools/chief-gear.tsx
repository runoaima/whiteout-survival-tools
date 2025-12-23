import { useState, useEffect } from "react";
import Style from "@/styles/tools/chief-gear.module.css";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import PageIntro from "@/components/PageIntro";
import CategoryTextNav from "@/components/CategoryTextNav";
import Footer from "@/components/Footer";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

/* ===============================
   定数データ（FireCrystalと同思想）
================================ */
const materialKeys = ["合金", "研磨剤", "設計図面", "月光琥珀"] as const;
type MaterialKey = typeof materialKeys[number];

const setNames = ["帽子", "時計", "服", "ズボン", "指輪", "杖"];

const rankLabels = [
    "なし", "グッド", "グッド(☆1)", "レア", "レア(☆1)", "レア(☆2)", "レア(☆3)",
    "エピック", "エピック(☆1)", "エピック(☆2)", "エピック(☆3)",
    "エピックT1", "エピックT1(☆1)", "エピックT1(☆2)", "エピックT1(☆3)",
    "レジェンド", "レジェンド(☆1)", "レジェンド(☆2)", "レジェンド(☆3)",
    "レジェンドT1", "レジェンドT1(☆1)", "レジェンドT1(☆2)", "レジェンドT1(☆3)",
    "レジェンドT2", "レジェンドT2(☆1)", "レジェンドT2(☆2)", "レジェンドT2(☆3)",
    "神話", "神話(☆1)", "神話(☆2)", "神話(☆3)",
    "神話T1", "神話T1(☆1)", "神話T1(☆2)", "神話T1(☆3)",
    "神話T2", "神話T2(☆1)", "神話T2(☆2)", "神話T2(☆3)",
    "神話T3", "神話T3(☆1)", "神話T3(☆2)", "神話T3(☆3)"
];

/* level → 素材テーブル（FireCrystalと同構造） */
type MaterialTable = Record<number, string[]>;

const materialTable: MaterialTable = {
    0: ["合金×1500", "研磨剤×15", "設計図面×0", "月光琥珀×0"],
    1: ["合金×3800", "研磨剤×40", "設計図面×0", "月光琥珀×0"],
    2: ["合金×7000", "研磨剤×70", "設計図面×0", "月光琥珀×0"],
    3: ["合金×9700", "研磨剤×95", "設計図面×0", "月光琥珀×0"],
    4: ["合金×0", "研磨剤×0", "設計図面×45", "月光琥珀×0"],
    5: ["合金×0", "研磨剤×0", "設計図面×50", "月光琥珀×0"],
    6: ["合金×0", "研磨剤×0", "設計図面×60", "月光琥珀×0"],
    7: ["合金×0", "研磨剤×0", "設計図面×70", "月光琥珀×0"],
    8: ["合金×6500", "研磨剤×65", "設計図面×40", "月光琥珀×0"],
    9: ["合金×8000", "研磨剤×80", "設計図面×50", "月光琥珀×0"],
    10: ["合金×10000", "研磨剤×95", "設計図面×60", "月光琥珀×0"],
    11: ["合金×11000", "研磨剤×110", "設計図面×70", "月光琥珀×0"],
    12: ["合金×13000", "研磨剤×130", "設計図面×85", "月光琥珀×0"],
    13: ["合金×15000", "研磨剤×160", "設計図面×100", "月光琥珀×0"],
    14: ["合金×22000", "研磨剤×220", "設計図面×40", "月光琥珀×0"],
    15: ["合金×23000", "研磨剤×230", "設計図面×40", "月光琥珀×0"],
    16: ["合金×25000", "研磨剤×250", "設計図面×45", "月光琥珀×0"],
    17: ["合金×26000", "研磨剤×260", "設計図面×45", "月光琥珀×0"],
    18: ["合金×28000", "研磨剤×280", "設計図面×45", "月光琥珀×0"],
    19: ["合金×30000", "研磨剤×300", "設計図面×55", "月光琥珀×0"],
    20: ["合金×32000", "研磨剤×320", "設計図面×55", "月光琥珀×0"],
    21: ["合金×35000", "研磨剤×340", "設計図面×55", "月光琥珀×0"],
    22: ["合金×38000", "研磨剤×360", "設計図面×55", "月光琥珀×0"],
    23: ["合金×43000", "研磨剤×430", "設計図面×75", "月光琥珀×0"],
    24: ["合金×45000", "研磨剤×460", "設計図面×80", "月光琥珀×0"],
    25: ["合金×48000", "研磨剤×500", "設計図面×85", "月光琥珀×0"],
    26: ["合金×50000", "研磨剤×530", "設計図面×85", "月光琥珀×10"],
    27: ["合金×52000", "研磨剤×560", "設計図面×90", "月光琥珀×10"],
    28: ["合金×54000", "研磨剤×590", "設計図面×95", "月光琥珀×10"],
    29: ["合金×56000", "研磨剤×620", "設計図面×100", "月光琥珀×10"],
    30: ["合金×59000", "研磨剤×670", "設計図面×110", "月光琥珀×15"],
    31: ["合金×61000", "研磨剤×700", "設計図面×115", "月光琥珀×15"],
    32: ["合金×63000", "研磨剤×730", "設計図面×120", "月光琥珀×15"],
    33: ["合金×65000", "研磨剤×760", "設計図面×125", "月光琥珀×15"],
    34: ["合金×68000", "研磨剤×810", "設計図面×135", "月光琥珀×20"],
    35: ["合金×70000", "研磨剤×840", "設計図面×140", "月光琥珀×20"],
    36: ["合金×72000", "研磨剤×870", "設計図面×145", "月光琥珀×20"],
    37: ["合金×74000", "研磨剤×900", "設計図面×150", "月光琥珀×20"],
    38: ["合金×77000", "研磨剤×950", "設計図面×160", "月光琥珀×25"],
    39: ["合金×80000", "研磨剤×990", "設計図面×165", "月光琥珀×25"],
    40: ["合金×83000", "研磨剤×1030", "設計図面×170", "月光琥珀×25"],
    41: ["合金×86000", "研磨剤×1070", "設計図面×180", "月光琥珀×25"]
};

/* ===============================
   コンポーネント
================================ */
export default function ChiefGearTool() {

    /* FireCrystalと同じlevels構造 */
    const [levels, setLevels] = useState(
        setNames.map(() => ({ start: 0, end: 0 }))
    );

    /* LevelSelector（完全共通） */
    function LevelSelector({
        value,
        onChange,
    }: {
        value: number;
        onChange: (v: number) => void;
    }) {
        return (
            <div className={Style.levelSelector}>
                <button onClick={() => onChange(Math.max(0, value - 1))}>−</button>
                <select value={value} onChange={e => onChange(Number(e.target.value))}>
                    {rankLabels.map((l, i) => (
                        <option key={i} value={i}>{l}</option>
                    ))}
                </select>
                <button onClick={() => onChange(Math.min(rankLabels.length - 1, value + 1))}>＋</button>
            </div>
        );
    }

    function updateLevel(i: number, key: "start" | "end", v: number) {
        setLevels(prev =>
            prev.map((item, idx) =>
                idx === i ? { ...item, [key]: v } : item
            )
        );
    }

    /* ===============================
       計算（FireCrystal完全一致）
    ================================ */
    const totalsPerSet = setNames.map(() => ({
        合金: 0, 研磨剤: 0, 設計図面: 0, 月光琥珀: 0
    }));

    const totalAll = { ...totalsPerSet[0] };

    levels.forEach((lv, i) => {
        if (lv.start >= lv.end) return;

        for (let l = lv.start; l < lv.end; l++) {
            materialTable[l]?.forEach(entry => {
                const [name, val] = entry.split("×");
                const key = name as MaterialKey;
                const num = Number(val);

                totalsPerSet[i][key] += num;
                totalAll[key] += num;
            });
        }
    });

    /* ===============================
       JSX
    ================================ */
    return (
        <>
            <Header title="Whiteout Survival" />

            <PageHero
                title="領主装備 計算ツール"
                imageUrl="/images/home-hero.png"
            />

            <CategoryTextNav categories={[
                { label: "トップ", href: "/" },
                { label: "素材計算", href: "/tools/materials" },
                { label: "領主装備", href: "/tools/chief-gear" },
            ]} />

            <PageIntro
                title="領主装備計算ツール"
                description="領主装備のランク差分から必要素材を自動計算します。"
                updatedAt="2025年12月19日"
                toc={[
                    { label: "計算ツール", targetId: "tool" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main>
                <section className={Style.section}>
                    <div id="tool" className={Style.sectionTitle}>領主装備計算ツール</div>
                    <p>※ レベルを逆に入力すると値は出ません</p>
                    <div className={Style.card}>
                        {setNames.map((name, i) => (
                            <div key={i} className={Style.buildingRow}>
                                <div className={Style.buildingName}>{name}</div>
                                <div className={Style.buildingSelectors}>
                                    <LevelSelector
                                        value={levels[i].start}
                                        onChange={v => updateLevel(i, "start", v)}
                                    />
                                    <LevelSelector
                                        value={levels[i].end}
                                        onChange={v => updateLevel(i, "end", v)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={Style.resultTitle}>必要素材一覧</div>

                    <table className={Style.resultTable}>
                        <thead>
                            <tr>
                                <th>部位</th>
                                {materialKeys.map(k => <th key={k}>{k}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {setNames.map((name, i) => (
                                <tr key={i}>
                                    <td>{name}</td>
                                    {materialKeys.map(k => (
                                        <td key={k}>{totalsPerSet[i][k]}</td>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                <td><strong>合計</strong></td>
                                {materialKeys.map(k => (
                                    <td key={k}><strong>{totalAll[k]}</strong></td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section id="usage" className={Style.section}>
                    <div className={Style.sectionTitle}>使い方</div>
                    <ol className={Style.usageList}>
                        <li>各装備部位ごとに、現在のランクと目標ランクを選択します。</li>
                        <li>「必要素材一覧」に、各素材の必要数が表示されます。</li>
                        <li>レベルを逆に入力すると値は出ませんのでご注意ください。</li>
                    </ol>
                </section>
            </main >

            <Footer />
        </>
    );
}
