import { useMemo, useState } from "react";
import Style from "@/styles/events/events-calendar.module.css";
import { events, EventItem } from "@/data/eventsData";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";

/* =========================
    型
========================= */
type Mode = "month" | "day";

type ExpandedEvent = {
    date: string;
    start: string;
    end: string;
    event: EventItem;
};

type MergedEvent = {
    id: string;
    title: string;
    date: string;
    isStart: boolean;
    color?: string;
};

/* =========================
    Utils
========================= */

const ymd = (d: Date) => d.toISOString().slice(0, 10);

function buildMonth(base: Date) {
    const y = base.getFullYear();
    const m = base.getMonth();

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const start = new Date(first);
    start.setDate(start.getDate() - start.getDay());

    const days = [];
    const cur = new Date(start);

    while (cur <= last || cur.getDay() !== 0) {
        days.push({
            date: ymd(cur),
            day: cur.getDate(),
            inMonth: cur.getMonth() === m,
        });
        cur.setDate(cur.getDate() + 1);
    }

    return days;
}

/* =========================
    繰り返し展開
========================= */
function expandEvents(
    events: EventItem[],
    rangeStart: Date,
    rangeEnd: Date
): ExpandedEvent[] {
    const result: ExpandedEvent[] = [];

    for (const ev of events) {
        const rule = ev.repeat;

        const push = (d: Date) => {
            const date = ymd(d);
            ev.times.forEach(t => {
                result.push({
                    date,
                    start: t.start,
                    end: t.end,
                    event: ev,
                });
            });
        };

        if (rule.type === "once") {
            const d = new Date(rule.date);
            if (d >= rangeStart && d <= rangeEnd) push(d);
            continue;
        }

        const start = new Date(rule.startDate);
        const until = rule.until ? new Date(rule.until) : rangeEnd;

        const cur = new Date(start);

        while (cur <= rangeEnd && cur <= until) {
            if (cur < rangeStart) {
                cur.setDate(cur.getDate() + 1);
                continue;
            }

            const dateStr = ymd(cur);
            if (rule.excludeDates?.includes(dateStr)) {
                cur.setDate(cur.getDate() + 1);
                continue;
            }

            let hit = false;

            if (rule.type === "daily") {
                const diff = Math.floor(
                    (cur.getTime() - start.getTime()) / 86400000
                );
                hit = diff % rule.interval === 0;
            }

            if (rule.type === "weekly") {
                const diffWeeks = Math.floor(
                    (cur.getTime() - start.getTime()) / (7 * 86400000)
                );
                hit =
                    diffWeeks % rule.interval === 0 &&
                    rule.weekdays.includes(cur.getDay());
            }

            if (rule.type === "monthly") {
                const diffMonths =
                    (cur.getFullYear() - start.getFullYear()) * 12 +
                    (cur.getMonth() - start.getMonth());
                hit =
                    diffMonths % rule.interval === 0 &&
                    cur.getDate() === rule.day;
            }

            if (hit) push(cur);

            cur.setDate(cur.getDate() + 1);
        }
    }

    return result;
}

/* =========================
    連続イベント結合
========================= */
function mergeContinuous(events: ExpandedEvent[]): MergedEvent[] {
    const map = new Map<string, ExpandedEvent[]>();

    events.forEach(e => {
        if (!map.has(e.event.id)) map.set(e.event.id, []);
        map.get(e.event.id)!.push(e);
    });

    const result: MergedEvent[] = [];

    for (const list of map.values()) {
        const sorted = list.sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        for (let i = 0; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const curr = sorted[i];

            const isStart =
                !prev ||
                new Date(prev.date).getTime() + 86400000 !==
                new Date(curr.date).getTime();

            result.push({
                id: curr.event.id,
                title: curr.event.title,
                date: curr.date,
                isStart,
                color: curr.event.color,
            });
        }
    }

    return result;
}

/* =========================
    Main
========================= */
export default function EventsCalendar() {
    const [baseDate, setBaseDate] = useState(new Date());

    const days = useMemo(() => buildMonth(baseDate), [baseDate]);

    const expanded = useMemo(() => {
        const start = new Date(baseDate);
        start.setDate(1);
        const end = new Date(baseDate);
        end.setMonth(end.getMonth() + 1);
        return expandEvents(events, start, end);
    }, [baseDate]);

    const merged = useMemo(
        () => mergeContinuous(expanded),
        [expanded]
    );

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
                title="イベントカレンダー"
                updatedAt="2025年12月28日1:26"
                description="イベントの日程を確認できるカレンダーです。各イベントの開始日時と繰り返しルールを表示します。"
                toc={[
                    { label: "イベントカレンダー", targetId: "calendar" },
                ]}
            />

            <main id="calendar" className={Style.container}>
                <h1>イベントカレンダー</h1>

                <div className={Style.monthNav}>
                    <button onClick={() => setBaseDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>◀</button>
                    <span>{baseDate.getFullYear()}年 {baseDate.getMonth() + 1}月</span>
                    <button onClick={() => setBaseDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>▶</button>
                </div>

                <div className={Style.calendar}>
                    {["日", "月", "火", "水", "木", "金", "土"].map(w => (
                        <div key={w} className={Style.week}>{w}</div>
                    ))}

                    {days.map(d => (
                        <div key={d.date} className={Style.dayCell}>
                            <div className={Style.dayNum}>{d.day}</div>

                            {merged
                                .filter(e => e.date === d.date)
                                .map(e => (
                                    <div
                                        key={e.id}
                                        className={Style.eventBar}
                                        style={{ background: e.color }}
                                    >
                                        {e.isStart ? e.title : ""}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
