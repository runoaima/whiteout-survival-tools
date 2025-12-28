import { useEffect, useMemo, useState } from "react";
import Style from "@/styles/events/events-today.module.css";
import { events, EventItem } from "@/data/eventsDailyData";
import { startMessages, endMessages } from "@/data/todayMessageData";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CategoryTextNav from "@/components/CategoryTextNav";
import PageIntro from "@/components/PageIntro";
import Footer from "@/components/Footer";



/* =========================
   Utils
========================= */

const ymd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const d2 = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${d2}`;
};

function dayDiff(a: Date, b: Date) {
    const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((ua - ub) / 86400000);
}

function isMatchDate(event: EventItem, date: Date) {
    const rule = event.repeat;
    const dateStr = ymd(date);

    // 単発
    if (rule.type === "once") {
        return rule.date === dateStr;
    }

    const start = new Date(rule.startDate);
    if (date < start) return false;

    // 毎日
    if (rule.type === "daily") {
        const diff =
            Math.floor((+date - +start) / 86400000);
        return diff % rule.interval === 0;
    }

    // 毎週
    if (rule.type === "weekly") {
        const diffWeeks =
            Math.floor((+date - +start) / (7 * 86400000));

        return (
            diffWeeks % rule.interval === 0 &&
            rule.weekdays.includes(date.getDay())
        );
    }

    // 毎月
    if (rule.type === "monthly") {
        const diffMonths =
            (date.getFullYear() - start.getFullYear()) * 12 +
            (date.getMonth() - start.getMonth());

        return (
            diffMonths % rule.interval === 0 &&
            date.getDate() === rule.day
        );
    }

    return false;
}


/* =========================
   Component
========================= */

export default function TodayEventPanel() {
    const [selectedDate, setSelectedDate] = useState(ymd(new Date()));
    const [startMsg, setStartMsg] = useState("");
    const [endMsg, setEndMsg] = useState("");
    const [copied, setCopied] = useState(false);

    /* ランダム文言を保持 */
    useEffect(() => {
        const savedStart = localStorage.getItem("today_start");
        const savedEnd = localStorage.getItem("today_end");

        if (savedStart && savedEnd) {
            setStartMsg(savedStart);
            setEndMsg(savedEnd);
        } else {
            shuffleMessage();
        }
    }, []);

    const shuffleMessage = () => {
        const s = startMessages[Math.floor(Math.random() * startMessages.length)];
        const e = endMessages[Math.floor(Math.random() * endMessages.length)];

        setStartMsg(s);
        setEndMsg(e);

        localStorage.setItem("today_start", s);
        localStorage.setItem("today_end", e);
    };

    const text = useMemo(() => {
        const date = new Date(selectedDate);
        let result = `${startMsg}\n\n`;
        result += "----本日のイベント----\n\n";


        events.forEach(ev => {
            if (!isMatchDate(ev, date)) return;

            result += `${ev.title}\n`;
            ev.times.forEach(t => {
                result += `${t.start}〜${t.end}\n`;
            });
            result += "\n";
        });

        result += endMsg;
        return result.trim();
    }, [selectedDate, startMsg, endMsg]);

    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

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
                title="本日のイベント"
                updatedAt="2025年12月28日15:39"
                description="本日のイベント情報をコピーしやすい形式で表示します。"
                toc={[
                    { label: "本日のイベント", targetId: "calendar" },
                ]}
            />
            <main id="calendar" className={Style.main}>
                <section id="fire-crystal" className={Style.section}>
                    <div className={Style.sectionTitle}>火晶微粒子計算ツール</div>
                </section>
                <div className={Style.container}>
                    <div className={Style.card}>
                        <div className={Style.header}>
                            <div>
                                <h2 className={Style.title}>本日のイベント</h2>
                                <p className={Style.sub}>日付と文言を調整できます</p>
                            </div>


                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className={Style.dateInput}
                            />
                        </div>

                        <div className={Style.body}>
                            <pre className={Style.pre}>{text}</pre>
                        </div>

                        <div className={Style.footer}>
                            <button className={Style.copyBtn} onClick={copy}>
                                {copied ? "コピーしました！" : "📋 コピー"}
                            </button>

                            <button
                                className={Style.copyBtn}
                                onClick={shuffleMessage}
                            >
                                🔀 文言をランダム
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
