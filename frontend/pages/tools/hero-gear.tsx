import { useEffect, useState } from "react";
import styles from "@/styles/tools/hero-gear.module.css";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import Footer from "@/components/Footer";

import {
    materialKeys,
    enhanceMaterialTable,
    refineMaterialTable,
    ENHANCE_MAX_LEVEL,
    REFINE_MAX_LEVEL,
    MaterialKey,
} from "@/data/heroGearData";

type GearState = {
    start: number;
    end: number;
    refineStart: number;
    refineEnd: number;
};

export default function HeroGearEnhance() {
    const [gears, setGears] = useState<GearState[]>([
        { start: 0, end: ENHANCE_MAX_LEVEL, refineStart: 0, refineEnd: REFINE_MAX_LEVEL },
    ]);

    const [resultHtml, setResultHtml] = useState("");
    const [showSave, setShowSave] = useState(false);

    /* ===============================
       装備追加・削除
    =============================== */
    const addGear = () => {
        setGears(prev => [
            ...prev,
            { start: 0, end: ENHANCE_MAX_LEVEL, refineStart: 0, refineEnd: REFINE_MAX_LEVEL },
        ]);
    };

    const removeGear = () => {
        setGears(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    /* ===============================
       値変更
    =============================== */
    const updateGear = (
        index: number,
        key: keyof GearState,
        value: number
    ) => {
        setGears(prev =>
            prev.map((g, i) =>
                i === index ? { ...g, [key]: value } : g
            )
        );
    };

    /* ===============================
       計算処理
    =============================== */
    useEffect(() => {
        const totalsPerSet = gears.map(() => {
            const obj: Record<MaterialKey, number> = {} as any;
            materialKeys.forEach(k => (obj[k] = 0));
            return obj;
        });

        const totalAll: Record<MaterialKey, number> = {} as any;
        materialKeys.forEach(k => (totalAll[k] = 0));

        let hasMaterial = false;

        gears.forEach((g, idx) => {
            /* 強化 */
            for (let lv = g.start; lv < g.end; lv++) {
                enhanceMaterialTable[lv + 1]?.forEach(e => {
                    const [name, v] = e.split("×");
                    const n = Number(v);
                    const key = name as MaterialKey;
                    totalsPerSet[idx][key] += n;
                    totalAll[key] += n;
                    if (n > 0) hasMaterial = true;
                });
            }

            /* 製錬 */
            for (let lv = g.refineStart; lv < g.refineEnd; lv++) {
                refineMaterialTable[lv + 1]?.forEach(e => {
                    const [name, v] = e.split("×");
                    const n = Number(v);
                    const key = name as MaterialKey;
                    totalsPerSet[idx][key] += n;
                    totalAll[key] += n;
                    if (n > 0) hasMaterial = true;
                });
            }
        });

        /* HTML生成 */
        let html = `<table class="${styles.table}"><tr><th>装備</th>`;
        materialKeys.forEach(k => (html += `<th>${k}</th>`));
        html += `</tr>`;

        totalsPerSet.forEach((set, i) => {
            html += `<tr><td>装備${i + 1}</td>`;
            materialKeys.forEach(k => (html += `<td>${set[k]}</td>`));
            html += `</tr>`;
        });

        html += `<tr class="${styles.totalRow}"><td>合計</td>`;
        materialKeys.forEach(k => (html += `<td>${totalAll[k]}</td>`));
        html += `</tr></table>`;

        setResultHtml(html);
        setShowSave(hasMaterial);
    }, [gears]);

    /* ===============================
       JSX
    =============================== */
    return (
        <>
            <Header title="Whiteout Survival" />
            <PageHero title="領主宝石 計算ツール" imageUrl="/images/home-hero.png" />
            <CategoryTextNav categories={[
                { label: "トップ", href: "/" },
                { label: "素材計算", href: "/tools/materials" },
                { label: "領主宝石", href: "/tools/hero-gem" },
            ]} />
            <PageIntro
                title="英雄装備計算ツール"
                updatedAt="2025年12月19日"
                description="英雄装備のランク差分から必要素材を自動計算します。"
                toc={[
                    { label: "計算ツール", targetId: "tool" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main className={styles.section}>
                <div id="tool" className={styles.sectionTitle}>英雄装備計算ツール</div>

                {gears.map((g, i) => (
                    <div key={i} className={styles.gearBox}>
                        <h3>装備{i + 1}</h3>

                        <label>
                            現在Lv：{g.start}
                            <input
                                type="range"
                                min={0}
                                max={ENHANCE_MAX_LEVEL}
                                value={g.start}
                                onChange={e =>
                                    updateGear(i, "start", Number(e.target.value))
                                }
                            />
                        </label>

                        <label>
                            希望Lv：+{g.end}
                            <input
                                type="range"
                                min={0}
                                max={ENHANCE_MAX_LEVEL}
                                value={g.end}
                                onChange={e =>
                                    updateGear(i, "end", Number(e.target.value))
                                }
                            />
                        </label>

                        <label>
                            製錬現在Lv：{g.refineStart}
                            <input
                                type="range"
                                min={0}
                                max={REFINE_MAX_LEVEL}
                                value={g.refineStart}
                                onChange={e =>
                                    updateGear(i, "refineStart", Number(e.target.value))
                                }
                            />
                        </label>

                        <label>
                            製錬希望Lv：{g.refineEnd}
                            <input
                                type="range"
                                min={0}
                                max={REFINE_MAX_LEVEL}
                                value={g.refineEnd}
                                onChange={e =>
                                    updateGear(i, "refineEnd", Number(e.target.value))
                                }
                            />
                        </label>
                    </div>
                ))}

                <div className={styles.controls}>
                    <button onClick={addGear}>＋追加</button>
                    <button onClick={removeGear}>－削除</button>
                </div>

                <div className={styles.resultTitle}>必要素材一覧</div>
                <div
                    className={styles.result}
                    dangerouslySetInnerHTML={{ __html: resultHtml }}
                />
                <br />

                <section id="usage" className={styles.section}>
                    <div className={styles.sectionTitle}>使い方</div>
                    <ol className={styles.usageList}>
                        <li>各装備ごとに、現在のレベルと目標レベルを選択します。</li>
                        <li>「必要素材一覧」に、各素材の必要数が表示されます。</li>
                        <li>レベルを逆に入力すると値は出ませんのでご注意ください。</li>
                    </ol>
                </section>
            </main>
            <Footer />
        </>
    );
}
