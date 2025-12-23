import { useState } from "react";
import Style from "@/styles/tools/chief-charm.module.css";
import dynamic from "next/dynamic";
import PageHero from "@/components/PageHero";
import PageIntro from "@/components/PageIntro";
import CategoryTextNav from "@/components/CategoryTextNav";
import Footer from "@/components/Footer";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

/* ===============================
   定数
================================ */
const materialKeys = ["追加ステータス", "ハンドブック", "宝石図面", "宝石秘典"] as const;
type MaterialKey = typeof materialKeys[number];

type MaterialTable = Record<number, string[]>;

const materialTable: MaterialTable = {
    1: ["追加ステータス×9", "ハンドブック×5", "宝石図面×5", "宝石秘典×0"],
    2: ["追加ステータス×3", "ハンドブック×40", "宝石図面×15", "宝石秘典×0"],
    3: ["追加ステータス×4", "ハンドブック×60", "宝石図面×40", "宝石秘典×0"],
    4: ["追加ステータス×3", "ハンドブック×80", "宝石図面×100", "宝石秘典×0"],
    5: ["追加ステータス×6", "ハンドブック×100", "宝石図面×200", "宝石秘典×0"],
    6: ["追加ステータス×5", "ハンドブック×120", "宝石図面×300", "宝石秘典×0"],
    7: ["追加ステータス×5", "ハンドブック×140", "宝石図面×400", "宝石秘典×0"],
    8: ["追加ステータス×5", "ハンドブック×200", "宝石図面×400", "宝石秘典×0"],
    9: ["追加ステータス×5", "ハンドブック×300", "宝石図面×400", "宝石秘典×0"],
    10:["追加ステータス×5", "ハンドブック×420", "宝石図面×420", "宝石秘典×0"],
    11:["追加ステータス×5", "ハンドブック×560", "宝石図面×420", "宝石秘典×0"],
    12:["追加ステータス×9", "ハンドブック×580", "宝石図面×450", "宝石秘典×15"],
    13:["追加ステータス×9", "ハンドブック×580", "宝石図面×450", "宝石秘典×30"],
    14:["追加ステータス×9", "ハンドブック×600", "宝石図面×500", "宝石秘典×45"],
    15:["追加ステータス×9", "ハンドブック×600", "宝石図面×500", "宝石秘典×70"],
    16:["追加ステータス×9", "ハンドブック×650", "宝石図面×550", "宝石秘典×100"],
};

/* ===============================
   Component
================================ */
type Gem = { start: number; end: number };

export default function HeroGemTool() {

    const [gems, setGems] = useState<Gem[]>([{ start: 0, end: 16 }]);

    function updateGem(i: number, key: "start" | "end", v: number) {
        setGems(prev =>
            prev.map((g, idx) =>
                idx === i
                    ? { ...g, [key]: key === "start" ? Math.min(v, g.end) : Math.max(v, g.start) }
                    : g
            )
        );
    }

    function addGem() {
        setGems(prev => [...prev, { start: 0, end: 16 }]);
    }

    function removeGem() {
        setGems(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }

    /* ===============================
       計算（FireCrystal完全一致）
    ================================ */
    const totalsPerSet = gems.map(() => ({
        追加ステータス: 0, ハンドブック: 0, 宝石図面: 0, 宝石秘典: 0
    }));
    const totalAll = { ...totalsPerSet[0] };

    gems.forEach((g, i) => {
        if (g.start >= g.end) return;
        for (let lv = g.start; lv < g.end; lv++) {
            materialTable[lv + 1]?.forEach(entry => {
                const [name, val] = entry.split("×");
                const key = name as MaterialKey;
                const num = Number(val);
                totalsPerSet[i][key] += num;
                totalAll[key] += num;
            });
        }
    });

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
                title="領主宝石計算ツール"
                updatedAt="2025年12月19日"
                description="宝石レベル差分から必要素材を自動計算します。"
                toc={[
                    { label: "領主宝石計算ツール", targetId: "chief-gem-tool" },
                    { label: "使い方", targetId: "usage" },
                ]}
            />

            <main className={Style.section}>
                <div id="chief-gem-tool" className={Style.sectionTitle}>領主宝石計算ツール</div>
                {gems.map((g, i) => (
                    <div key={i} className={Style.card}>
                        <div className={Style.gemTitle}>宝石{i + 1}</div>

                        <label>現在Lv: {g.start}</label>
                        <input
                            type="range"
                            min={0}
                            max={16}
                            value={g.start}
                            onChange={e => updateGem(i, "start", Number(e.target.value))}
                        />

                        <label>希望Lv: {g.end}</label>
                        <input
                            type="range"
                            min={0}
                            max={16}
                            value={g.end}
                            onChange={e => updateGem(i, "end", Number(e.target.value))}
                        />
                    </div>
                ))}

                <div className={Style.controls}>
                    <button onClick={addGem}>＋ 宝石追加</button>
                    <button onClick={removeGem}>− 削除</button>
                </div>

                <div className={Style.resultTitle}>必要素材一覧</div>
                <table className={Style.resultTable}>
                    <thead>
                        <tr>
                            <th>宝石</th>
                            {materialKeys.map(k => <th key={k}>{k}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {gems.map((_, i) => (
                            <tr key={i}>
                                <td>宝石{i + 1}</td>
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

                <section id="usage" className={Style.section}>
                    <div className={Style.sectionTitle}>使い方</div>
                    <ol className={Style.usageList}>
                        <li>各宝石ごとに、現在のレベルと目標レベルを選択します。</li>
                        <li>「必要素材一覧」に、各素材の必要数が表示されます。</li>
                        <li>レベルを逆に入力すると値は出ませんのでご注意ください。</li>
                    </ol>
                </section>
            </main>

            <Footer />
        </>
    );
}
