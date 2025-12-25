import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import Style from "@/styles/tools/march-time.module.css";
import Header from "@/components/Header";


const JST_OFFSET = 9 * 60 * 60 * 1000; // JST = UTC+9


type Phase = "PRE" | "GATHERING" | "MARCH" | "ARRIVED";

type UnitState = {
    gatheringTimeMin: number; // minutes
    marchTimeSec: number; // seconds
    phase: Phase;
    countdownText: string; // startまでの表示
    gatheringText: string; // 集結カウント or "行軍開始！"
    marchText: string; // 行軍カウント or "到着！"
};

function pad2(n: number) {
    return n.toString().padStart(2, "0");
}
function pad3(n: number) {
    return n.toString().padStart(3, "0");
}

function parseHHMMSS(t: string): { h: number; m: number; s: number } {
    const parts = t.split(":").map((x) => Number(x));
    const h = parts[0] ?? 0;
    const m = parts[1] ?? 0;
    const s = parts[2] ?? 0;
    return { h, m, s };
}

function formatHHMMSSFromUTCDate(d: Date) {
    return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(
        d.getUTCSeconds()
    )}`;
}

function toJST(d: Date) {
    return new Date(d.getTime() + JST_OFFSET);
}

/**
 * arrivalTime (UTCのHH:MM:SS) を、今日or明日の "実到着Date(UTC基準)" にする
 * - いま(オフセット反映後)より過去なら翌日に繰り上げ
 */
function buildArrivalDateUTC(arrivalTime: string, nowAdjustedMs: number): Date {
    const { h, m, s } = parseHHMMSS(arrivalTime);
    const base = new Date(nowAdjustedMs);
    const arrival = new Date(base.getTime());
    arrival.setUTCHours(h, m, s, 0);

    // いまより過去なら翌日に
    if (arrival.getTime() < nowAdjustedMs) {
        arrival.setUTCDate(arrival.getUTCDate() + 1);
    }
    return arrival;
}

/**
 * スタート時刻 = 到着 - 集結 - 行軍
 */
function calcStartDateUTC(
    arrivalDateUTC: Date,
    gatheringMin: number,
    marchSec: number
): Date {
    const startMs =
        arrivalDateUTC.getTime() - gatheringMin * 60_000 - marchSec * 1000;
    return new Date(startMs);
}

function formatCountdownHHMMSS(diffMs: number) {
    const diffSec = diffMs / 1000;
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = Math.floor(diffSec % 60);

    // 元JSの「+1秒」っぽい見た目を再現
    const s = (seconds + 1).toString().padStart(2, "0");
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${s}`;
}

export default function MarchTimerTool() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // arrival-time (UTC HH:MM:SS)
    const [arrivalTime, setArrivalTime] = useState<string>("00:10:00");

    // offset (seconds, float)
    const [offset, setOffset] = useState<number>(0);

    // 「現在時刻」表示用（100ms更新）
    const [nowReal, setNowReal] = useState<Date>(new Date());
    const nowAdjusted = useMemo(
        () => new Date(Date.now() + offset * 1000),
        [nowReal, offset]
    );

    // 3部隊
    const [units, setUnits] = useState<UnitState[]>(() =>
        [1, 2, 3].map(() => ({
            gatheringTimeMin: 5,
            marchTimeSec: 60,
            phase: "PRE" as Phase,
            countdownText: "",
            gatheringText: "",
            marchText: "",
        }))
    );

    // 集結/行軍のintervalは部隊ごとに保持（stateに入れない）
    const gatheringIntervalsRef = useRef<Array<number | null>>([null, null, null]);
    const marchIntervalsRef = useRef<Array<number | null>>([null, null, null]);

    // arrivalDateUTC / JST表示
    const arrivalDateUTC = useMemo(
        () => buildArrivalDateUTC(arrivalTime, nowAdjusted.getTime()),
        [arrivalTime, nowAdjusted]
    );

    const arrivalJST = useMemo(() => toJST(arrivalDateUTC), [arrivalDateUTC]);

    // 初期：今+10分
    useEffect(() => {
        setArrivalTimeToMinutesLater(10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // now表示更新（100ms）
    useEffect(() => {
        const id = window.setInterval(() => {
            setNowReal(new Date());
        }, 100);
        return () => window.clearInterval(id);
    }, []);

    // 走ってる集結/行軍intervalを全部止める
    function clearAllIntervalsForUnit(index0: number) {
        const gId = gatheringIntervalsRef.current[index0];
        if (gId != null) {
            window.clearInterval(gId);
            gatheringIntervalsRef.current[index0] = null;
        }
        const mId = marchIntervalsRef.current[index0];
        if (mId != null) {
            window.clearInterval(mId);
            marchIntervalsRef.current[index0] = null;
        }
    }

    // 部隊の表示を初期化（JSのresetGatheringCountdown+resetMarchCountdown相当）
    function resetUnitUI(index0: number) {
        clearAllIntervalsForUnit(index0);
        setUnits((prev) =>
            prev.map((u, i) =>
                i === index0
                    ? {
                        ...u,
                        phase: "PRE",
                        gatheringText: "",
                        marchText: "",
                    }
                    : u
            )
        );
    }

    function setArrivalTimeToMinutesLater(minutesToAdd: number) {
        const now = new Date(); // 元JSはoffset無視のnow
        const future = new Date(now.getTime() + minutesToAdd * 60_000);
        const hh = pad2(future.getUTCHours());
        const mm = pad2(future.getUTCMinutes());
        setArrivalTime(`${hh}:${mm}:00`);
        // calculateStartTime() はReactでは描画から自動で反映
    }

    function adjustArrivalTime(minOffset: number) {
        const { h, m, s } = parseHHMMSS(arrivalTime);
        const d = new Date();
        d.setUTCHours(h, m, s, 0);
        d.setUTCMinutes(d.getUTCMinutes() + minOffset);
        const hh = pad2(d.getUTCHours());
        const mm = pad2(d.getUTCMinutes());
        setArrivalTime(`${hh}:${mm}:00`);
    }

    function set5959() {
        const hh = arrivalTime.slice(0, 2);
        setArrivalTime(`${hh}:59:59`);
    }

    function adjustOffset(delta: number) {
        setOffset((prev) => Number((prev + delta).toFixed(1)));
    }

    function adjustMarchTime(index0: number, deltaSec: number) {
        setUnits((prev) =>
            prev.map((u, i) => {
                if (i !== index0) return u;
                let next = u.marchTimeSec + deltaSec;
                next = Math.max(1, Math.min(300, next)); // 1〜300秒
                return { ...u, marchTimeSec: next };
            })
        );
    }

    function setGatheringTime(index0: number, minutes: number) {
        setUnits((prev) =>
            prev.map((u, i) => (i === index0 ? { ...u, gatheringTimeMin: minutes } : u))
        );
        resetUnitUI(index0);
    }

    // 行軍開始（JSのstartMarchCountdown）
    function startMarchCountdown(index0: number) {
        setUnits((prev) =>
            prev.map((u, i) =>
                i === index0 ? { ...u, phase: "MARCH", marchText: "" } : u
            )
        );

        // 既存があれば止める
        const old = marchIntervalsRef.current[index0];
        if (old != null) {
            window.clearInterval(old);
            marchIntervalsRef.current[index0] = null;
        }

        // remainingSeconds = marchTime - 1
        let remaining = Math.max(0, units[index0].marchTimeSec - 1);

        const id = window.setInterval(() => {
            if (remaining > 0) {
                setUnits((prev) =>
                    prev.map((u, i) =>
                        i === index0
                            ? { ...u, marchText: remaining.toString().padStart(2, "0") }
                            : u
                    )
                );
                remaining--;
            } else {
                // 到着！
                window.clearInterval(id);
                marchIntervalsRef.current[index0] = null;

                setUnits((prev) =>
                    prev.map((u, i) =>
                        i === index0
                            ? {
                                ...u,
                                phase: "ARRIVED",
                                marchText: "到着！",
                                gatheringText: "",
                            }
                            : u
                    )
                );

                // 集結側も止める
                const gId = gatheringIntervalsRef.current[index0];
                if (gId != null) {
                    window.clearInterval(gId);
                    gatheringIntervalsRef.current[index0] = null;
                }
            }
        }, 1000);

        marchIntervalsRef.current[index0] = id;
    }

    // 集結開始（JSのstartGatheringCountdown）
    function startGatheringCountdown(index0: number) {
        // すでにGATHERING/MARCH/ARRIVEDなら開始しない（元JSのガード）
        const current = units[index0];
        if (current.phase !== "PRE") return;

        // gathering=0なら即行軍開始
        if (current.gatheringTimeMin === 0) {
            setUnits((prev) =>
                prev.map((u, i) =>
                    i === index0
                        ? { ...u, phase: "MARCH", gatheringText: "行軍開始！" }
                        : u
                )
            );
            startMarchCountdown(index0);
            return;
        }

        // 既存interval停止
        const old = gatheringIntervalsRef.current[index0];
        if (old != null) {
            window.clearInterval(old);
            gatheringIntervalsRef.current[index0] = null;
        }

        setUnits((prev) =>
            prev.map((u, i) =>
                i === index0 ? { ...u, phase: "GATHERING", gatheringText: "" } : u
            )
        );

        // remainingSeconds = gatheringTime*60 - 1
        let remaining = current.gatheringTimeMin * 60 - 1;

        const id = window.setInterval(() => {
            if (remaining > 0) {
                const mm = Math.floor(remaining / 60);
                const ss = remaining % 60;
                setUnits((prev) =>
                    prev.map((u, i) =>
                        i === index0
                            ? {
                                ...u,
                                gatheringText: `${mm.toString().padStart(2, "0")}:${ss
                                    .toString()
                                    .padStart(2, "0")}`,
                            }
                            : u
                    )
                );
                remaining--;
            } else {
                window.clearInterval(id);
                gatheringIntervalsRef.current[index0] = null;

                // 0ms後に「行軍開始！」→行軍開始（元JSのsetTimeout(0)再現）
                setTimeout(() => {
                    setUnits((prev) =>
                        prev.map((u, i) =>
                            i === index0 ? { ...u, gatheringText: "行軍開始！" } : u
                        )
                    );
                    startMarchCountdown(index0);
                }, 0);
            }
        }, 1000);

        gatheringIntervalsRef.current[index0] = id;
    }

    // 100msごとに countdown を更新（元JS updateCountdown相当）
    useEffect(() => {
        const id = window.setInterval(() => {
            const nowMs = Date.now() + offset * 1000;
            const arrival = buildArrivalDateUTC(arrivalTime, nowMs);

            setUnits((prev) =>
                prev.map((u, index0) => {
                    const start = calcStartDateUTC(arrival, u.gatheringTimeMin, u.marchTimeSec);
                    const diff = start.getTime() - nowMs;

                    // PREフェーズ：startまでのカウント
                    if (diff >= 0) {
                        const text = formatCountdownHHMMSS(diff);

                        // もし以前Go!!になって集結/行軍が走ってたが、到着時刻等の変更で未来になった場合
                        // → リセット（元JSの resetGatheringCountdown 相当）
                        if (u.phase !== "PRE") {
                            // intervalはここで止める（state更新外で副作用なので別途）
                            // → ここではマークだけ、実際の停止は直後に行う
                        }

                        return {
                            ...u,
                            countdownText: text,
                        };
                    }

                    // diff < 0 → "Go!!" になった
                    return {
                        ...u,
                        countdownText: "Go!!",
                    };
                })
            );

            // interval停止や開始などの副作用は state反映後に判定しづらいので、
            // ここで「今のunits」を参照して処理する（ズレが出ないよう最小限に）
            // - "Go!!" になったPREのものは startGatheringCountdown
            // - 未来に戻ったものは resetUnitUI
            // ※ units はクロージャで古い可能性があるので、最小限の判定に留める
        }, 100);

        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivalTime, offset]);

    // units/countdownTextの変化を見て、Go!!トリガーやリセットを実行
    useEffect(() => {
        units.forEach((u, index0) => {
            if (u.countdownText === "Go!!") {
                // PREなら集結開始
                if (u.phase === "PRE") {
                    startGatheringCountdown(index0);
                }
            } else {
                // "Go!!" 以外の表示に戻った時：集結/行軍が動いてたらリセット
                if (u.phase !== "PRE") {
                    resetUnitUI(index0);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [units.map((u) => `${u.phase}:${u.countdownText}`).join("|")]);

    // calculateStartTime相当：start-time-1..3 を作る（表示用）
    const startTimesUTC = useMemo(() => {
        return units.map((u) => {
            const start = calcStartDateUTC(arrivalDateUTC, u.gatheringTimeMin, u.marchTimeSec);
            return formatHHMMSSFromUTCDate(start);
        });
    }, [units, arrivalDateUTC]);

    // time-after 表示（UTC + msの先頭1桁 + JST）
    const timeAfterUTC = useMemo(() => {
        const d = nowAdjusted;
        const hh = pad2(d.getUTCHours());
        const mm = pad2(d.getUTCMinutes());
        const ss = pad2(d.getUTCSeconds());
        const ms = pad3(d.getUTCMilliseconds());
        // 元JS：ミリ秒は1桁だけ表示していた
        return { text: `${hh}:${mm}:${ss}.`, msFirstDigit: ms.slice(0, 1) };
    }, [nowAdjusted]);

    const timeAfterJST = useMemo(() => {
        const jst = toJST(nowAdjusted);
        return `${pad2(jst.getUTCHours())}:${pad2(jst.getUTCMinutes())}:${pad2(
            jst.getUTCSeconds()
        )}`;
    }, [nowAdjusted]);

    const arrivalTimeJSTText = useMemo(() => {
        return `${pad2(arrivalJST.getUTCHours())}:${pad2(
            arrivalJST.getUTCMinutes()
        )}:${pad2(arrivalJST.getUTCSeconds())}`;
    }, [arrivalJST]);

    // arrivalTime変更時は全リセット（元JSのchangeでresetGatheringCountdown）
    function onArrivalTimeChange(v: string) {
        setArrivalTime(v);
        [0, 1, 2].forEach((i) => resetUnitUI(i));
    }

    if (!mounted) {
        return null;
    }

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
                title="行軍時間計算ツール"
                updatedAt="2025年12月26日"
                description="行軍時間と到着時刻を計算します。"
                toc={
                    [
                        { label: "計算ツール", targetId: "tool" },
                        { label: "使い方", targetId: "usage" },
                    ]
                }
            />

            <main className={Style.container}>
                <h1 className={Style.sectionTitle}>行軍タイマー</h1>

                {/* 現在時刻 */}
                <section className={Style.card}>
                    <div className={Style.timeRow}>
                        <div className={Style.timeBlock}>
                            <div className={Style.timeLabel}>現在時刻（UTC, offset反映）</div>
                            <div className={Style.timeMain}>
                                {timeAfterUTC.text}
                                <span className={Style.milliseconds}>
                                    {timeAfterUTC.msFirstDigit}
                                </span>
                            </div>
                        </div>

                        <div className={Style.timeBlock}>
                            <div className={Style.timeLabel}>（JST）</div>
                            <div className={Style.timeSub}>{timeAfterJST}</div>
                        </div>
                    </div>

                    <div className={Style.offsetRow}>
                        <label className={Style.timeLabel}>
                            offset（秒）
                            <input
                                type="number"
                                step="0.1"
                                value={offset}
                                onChange={(e) => setOffset(Number(e.target.value))}
                                className={Style.offsetInput}
                            />
                        </label>

                        <button className={Style.btn} onClick={() => adjustOffset(0.1)}>+0.1</button>
                        <button className={Style.btn} onClick={() => adjustOffset(-0.1)}>-0.1</button>
                    </div>
                </section>

                {/* 到着時刻 */}
                <section className={Style.card}>
                    <div className={Style.arrivalRow}>
                        <div>
                            <div className={Style.timeLabel}>到着時刻（UTC）</div>
                            <input
                                type="time"
                                step={1}
                                value={arrivalTime}
                                onChange={(e) => onArrivalTimeChange(e.target.value)}
                                className={Style.arrivalInput}
                            />
                        </div>

                        <div>
                            <div className={Style.timeLabel}>到着時刻（JST）</div>
                            <div className={Style.arrivalJst}>
                                （JST）{arrivalTimeJSTText}
                            </div>
                        </div>
                    </div>

                    <div className={Style.offsetRow}>
                        <button className={Style.btn} onClick={set5959}>この時間の59:59</button>
                        <button className={Style.btn} onClick={() => setArrivalTimeToMinutesLater(5)}>今+5分</button>
                        <button className={Style.btn} onClick={() => setArrivalTimeToMinutesLater(10)}>今+10分</button>
                        <button className={Style.btn} onClick={() => adjustArrivalTime(1)}>+1分</button>
                        <button className={Style.btn} onClick={() => adjustArrivalTime(-1)}>-1分</button>
                    </div>
                </section>

                {/* 3部隊 */}
                <section className={Style.unitGrid}>
                    {units.map((u, idx) => (
                        <div key={idx} className={Style.unitCard}>
                            <h3 className={Style.unitTitle}>部隊 {idx + 1}</h3>

                            <div className={Style.settingBlock}>
                                <div className={Style.settingLabel}>集結時間（分）</div>
                                <div className={Style.radioRow}>
                                    {[0, 5, 10, 15, 30].map(min => (
                                        <label key={min}>
                                            <input
                                                type="radio"
                                                checked={u.gatheringTimeMin === min}
                                                onChange={() => setGatheringTime(idx, min)}
                                            />
                                            {min}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={Style.settingBlock}>
                                <div className={Style.settingLabel}>行軍時間（秒）</div>
                                <div className={Style.marchRow}>
                                    <button className={Style.btn} onClick={() => adjustMarchTime(idx, -1)}>-1</button>
                                    <input
                                        type="number"
                                        value={u.marchTimeSec}
                                        className={Style.marchInput}
                                        onChange={(e) =>
                                            setUnits(prev =>
                                                prev.map((x, i) =>
                                                    i === idx ? { ...x, marchTimeSec: Number(e.target.value) } : x
                                                )
                                            )
                                        }
                                    />
                                    <button className={Style.btn} onClick={() => adjustMarchTime(idx, 1)}>+1</button>
                                </div>
                            </div>

                            <div className={Style.resultBlock}>
                                <div className={Style.resultLabel}>開始時刻（UTC）</div>
                                <div className={Style.mono}>{startTimesUTC[idx]}</div>
                            </div>

                            <div className={Style.resultBlock}>
                                <div className={Style.resultLabel}>開始まで</div>
                                <div className={Style.monoBig}>{u.countdownText}</div>
                            </div>

                            <div className={Style.resultBlock}>
                                <div className={Style.resultLabel}>集結</div>
                                <div className={Style.mono}>{u.gatheringText}</div>
                            </div>

                            <div className={Style.resultBlock}>
                                <div className={Style.resultLabel}>行軍</div>
                                <div className={Style.mono}>{u.marchText}</div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className={Style.usageSection} id="usage">
                    <h2 className={Style.sectionTitle}>使い方</h2>
                    <ol className={Style.usageList}>
                        <li>到着時刻（UTC）を設定します。</li>
                        <li>各部隊の集結時間と行軍時間を設定します。</li>
                        <li>各部隊の「開始まで」カウントが0になると、自動的に集結と行軍のカウントダウンが始まります。</li>
                        <li>集結や行軍のカウントダウン中に到着時刻を変更すると、カウントダウンがリセットされます。</li>
                    </ol>
                </section>
            </main>

            <Footer />
        </>
    );
}
