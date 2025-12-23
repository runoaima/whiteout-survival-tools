import { useMemo, useState } from "react";
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

/* ===============================
   型定義
=============================== */
type GearState = {
    start: number;
    end: number;
    refineStart: number;
    refineEnd: number;
};

export default function HeroGearEnhance() {
    /* ===============================
       State
    =============================== */
    const [gears, setGears] = useState<GearState[]>([
        {
            start: 0,
            end: ENHANCE_MAX_LEVEL,
            refineStart: 0,
            refineEnd: REFINE_MAX_LEVEL,
        },
    ]);

    /* ===============================
       装備追加・削除
    =============================== */
    const addGear = () => {
        setGears(prev => [
            ...prev,
            {
                start: 0,
                end: ENHANCE_MAX_LEVEL,
                refineStart: 0,
                refineEnd: REFINE_MAX_LEVEL,
            },
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
       計算処理（useMemo）
       ※ useEffect + setState は使わない
    =============================== */
    const { resultHtml, hasMaterial } = useMemo(() => {
        // 装備ごとの合計
        const totalsPerSet: Record<MaterialKey, number>[] = gears.map(() => {
            const obj: Record<MaterialKey, number> = {} as Record<MaterialKey, number>;
            materialKeys.forEach(k => (obj[k] = 0));
            return obj;
        });

        // 全体合計
        const totalAll: Record<MaterialKey, number> = {} as Record<MaterialKey, number>;
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
        materialKeys.forEach(k => {
            html += `<th>${k}</th>`;
        });
        html += `</tr>`;

        totalsPerSet.forEach((set, i) => {
            html += `<tr><td>装備${i + 1}</td>`;
            materialKeys.forEach(k => {
                html += `<td>${set[k]}</td>`;
            });
            html += `</tr>`;
        });

        html += `<tr class="${styles.totalRow}"><td>合計</td>`;
        materialKeys.forEach(k => {
            html += `<td>${totalAll[k]}</td>`;
        });
        html += `</tr></table>`;

        return { resultHtml: html, hasMaterial };
    }, [gears]);

    /* ===============================
       JSX
    =============================== */
    return (
        <>
            <Header title="Whiteout Survival" />
            <PageHero
                title="英雄装備 計算ツール"
                imageUrl="/images/home-hero.png"
            />

            <CategoryTextNav
                categories={[
                    { label: "トップ", href: "/" },
                    { label: "素材計算", href: "/tools/materials" },
                    { label: "英雄装備", href: "/tools/hero-gear" },
                ]}
            />

            <PageIntro
                title="英雄装備計算ツール"
                updatedAt="2025年12月19日"
                description="英雄装備の強化・製錬レベル差分から必要素材を自動計算します。"
                toc={[
                    { label: "計算ツール", targetId: "tool" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main className={styles.section}>
                <div id="tool" className={styles.sectionTitle}>
                    英雄装備計算ツール
                </div>

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
                            希望Lv：{g.end}
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

                {hasMaterial ? (
                    <div
                        className={styles.result}
                        dangerouslySetInnerHTML={{ __html: resultHtml }}
                    />
                ) : (
                    <p className={styles.noResult}>
                        条件を選択すると必要素材が表示されます。
                    </p>
                )}

                <section id="usage" className={styles.section}>
                    <div className={styles.sectionTitle}>使い方</div>
                    <ol className={styles.usageList}>
                        <li>各装備ごとに、現在のレベルと目標レベルを選択します。</li>
                        <li>必要素材が自動で集計されます。</li>
                        <li>レベルを逆に設定すると素材は加算されません。</li>
                    </ol>
                </section>
            </main>

            <Footer />
        </>
    );
}
