import { useMemo, useState } from "react";
import Style from "@/styles/tools/fire-crystal-shard.module.css";
import {
    SKILL_CONFIG,
    SkillId,
    MATERIAL_KEYS,
    MaterialKey,
    NODE_LAYOUT,
} from "@/data/fireCrystalShardData";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import Footer from "@/components/Footer";

/* 共通ユーティリティ */

function emptyTotals(): Record<MaterialKey, number> {
    return MATERIAL_KEYS.reduce((a, k) => {
        a[k] = 0;
        return a;
    }, {} as Record<MaterialKey, number>);
}

/* 素材計算 */
function calcSkillMaterials(skillId: SkillId, lv: number) {
    const cfg = SKILL_CONFIG[skillId];
    const t = emptyTotals();
    if (lv <= 0) return t;

    for (const k of MATERIAL_KEYS) {
        t[k] = cfg.materials[k].slice(0, lv).reduce((a, b) => a + b, 0);
    }
    return t;
}


/* レベル適用ルール */
function applySetLevel(
    prev: Record<SkillId, number>,
    skillId: SkillId,
    nextLevel: number
) {
    const next = { ...prev };
    const cfg = SKILL_CONFIG[skillId];
    const clamped = Math.max(0, Math.min(cfg.maxLevel, nextLevel));
    next[skillId] = clamped;

    if (clamped >= 1 && cfg.children) {
        cfg.children.forEach(child => {
            next[child] = SKILL_CONFIG[child].maxLevel;
        });
    }

    return next;
}


/* ポップアップ */
function LevelPopup({
    skillId,
    current,
    onApply,
    onClose,
}: {
    skillId: SkillId;
    current: number;
    onApply: (lv: number) => void;
    onClose: () => void;
}) {
    const cfg = SKILL_CONFIG[skillId];

    return (
        <div className={Style.popupOverlay} onClick={onClose}>
            <div className={Style.popup} onClick={e => e.stopPropagation()}>
                <div className={Style.popupTitle}>{cfg.label}</div>
                <div className={Style.popupSub}>
                    現在 Lv {current} / {cfg.maxLevel}
                </div>

                <label className={Style.popupLabel}>設定Lv</label>
                <select
                    className={Style.popupSelect}
                    value={current}
                    onChange={e => onApply(Number(e.target.value))}
                >
                    {Array.from({ length: cfg.maxLevel + 1 }).map((_, i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>

                <div className={Style.popupHint}>
                    ※ 上位ノードを Lv1 以上にすると、直下の下位ノードは自動的に MAX になります
                </div>

                <button className={Style.popupClose} onClick={onClose}>
                    閉じる
                </button>
            </div>
        </div>
    );
}


/* メイン */
export default function HeroSkillTool() {
    const [levels, setLevels] = useState<Record<SkillId, number>>(() => {
        const init = {} as Record<SkillId, number>;
        (Object.keys(SKILL_CONFIG) as SkillId[]).forEach(id => (init[id] = 0));
        return init;
    });

    const [popup, setPopup] = useState<SkillId | null>(null);

    /* リセット */
    function resetAll() {
        const reset = {} as Record<SkillId, number>;
        (Object.keys(SKILL_CONFIG) as SkillId[]).forEach(id => (reset[id] = 0));
        setLevels(reset);
    }

    /* 計算 */
    const perNode = useMemo(() => {
        const r: Record<SkillId, Record<MaterialKey, number>> = {} as any;
        (Object.keys(SKILL_CONFIG) as SkillId[]).forEach(id => {
            r[id] = calcSkillMaterials(id, levels[id]);
        });
        return r;
    }, [levels]);

    const totalAll = useMemo(() => {
        const t = emptyTotals();
        (Object.keys(SKILL_CONFIG) as SkillId[]).forEach(id => {
            for (const k of MATERIAL_KEYS) t[k] += perNode[id][k];
        });
        return t;
    }, [perNode]);

    /* 線 */
    const edges = useMemo(() => {
        const list: { from: SkillId; to: SkillId }[] = [];
        (Object.keys(SKILL_CONFIG) as SkillId[]).forEach(id => {
            SKILL_CONFIG[id].children?.forEach(c => list.push({ from: id, to: c }));
        });
        return list;
    }, []);

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
                title="火晶微粒子計算ツール"
                updatedAt="2025年12月25日"
                description="火晶微粒子スキルノードのレベルに応じた必要素材を計算します。"
                toc={[
                    { label: "火晶微粒子計算ツール", targetId: "fire-crystal" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main>
                <section id="fire-crystal" className={Style.section}>
                    <div className={Style.sectionTitle}>火晶微粒子計算ツール</div>
                </section>
                <section className={Style.container}>
                    <div className={Style.treeWrap}>

                        <svg className={Style.lines} viewBox="0 0 100 100" preserveAspectRatio="none">
                            {edges.map((e, i) => {
                                const a = NODE_LAYOUT[e.from];
                                const b = NODE_LAYOUT[e.to];
                                return (
                                    <line
                                        key={i}
                                        x1={a.xPct}
                                        y1={a.yPct}
                                        x2={b.xPct}
                                        y2={b.yPct}
                                        className={Style.line}
                                    />
                                );
                            })}
                        </svg>

                        {(Object.keys(SKILL_CONFIG) as SkillId[]).map(id => {
                            const cfg = SKILL_CONFIG[id];
                            const pos = NODE_LAYOUT[id];
                            const isMax = levels[id] >= cfg.maxLevel;

                            return (
                                <button
                                    key={id}
                                    className={`${Style.node} ${isMax ? Style.nodeMax : ""}`}
                                    style={{
                                        left: `${pos.xPct}%`,
                                        top: `${pos.yPct}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                    onClick={() => setPopup(id)}
                                >
                                    <div className={Style.nodeLabel}>{cfg.label}</div>
                                    <div className={Style.nodeLv}>
                                        {levels[id]}/{cfg.maxLevel}
                                    </div>
                                </button>

                            );
                        })}
                    </div>

                    {/* リセットボタン */}
                    <div className={Style.resetWrap}>
                        <button className={Style.resetButton} onClick={resetAll}>
                            全てリセット
                        </button>
                    </div>

                    {/* 表 */}
                    <section className={Style.section}>
                        <div className={Style.sectionTitle}>必要素材一覧</div>
                        <div className={Style.tableWrap}>
                            <table className={Style.table}>
                                <thead>
                                    <tr>
                                        <th>スキル</th>
                                        <th>Lv</th>
                                        {MATERIAL_KEYS.map(k => (
                                            <th key={k}>{k}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Object.keys(SKILL_CONFIG) as SkillId[]).map(id => (
                                        <tr key={id}>
                                            <td>{SKILL_CONFIG[id].label}</td>
                                            <td>{levels[id]}</td>
                                            {MATERIAL_KEYS.map(k => (
                                                <td key={k}>{perNode[id][k]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr className={Style.totalRow}>
                                        <td>合計</td>
                                        <td>-</td>
                                        {MATERIAL_KEYS.map(k => (
                                            <td key={k}>{totalAll[k]}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {popup && (
                        <LevelPopup
                            skillId={popup}
                            current={levels[popup]}
                            onApply={lv => setLevels(prev => applySetLevel(prev, popup, lv))}
                            onClose={() => setPopup(null)}
                        />
                    )}
                </section>

                <section id="usage" className={Style.section}>
                    <div className={Style.sectionTitle}>使い方</div>
                    <ol className={Style.usageList}>
                        <li>各スキルノードをクリックして、現在のレベルを選択します。</li>
                        <li>上位ノードを Lv1 以上にすると、直下の下位ノードは自動的に MAX になります。</li>
                        <li>「必要素材一覧」に、各素材の必要数が表示されます。</li>
                    </ol>
                </section>
            </main>
            <Footer />
        </>
    );
}
