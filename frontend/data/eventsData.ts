// ==============================
// イベント繰り返しルール定義
// ==============================

export type RepeatRule =
    | {
        type: "once";
        date: string;
    }
    | {
        type: "daily";
        startDate: string;   // ← 追加（開始日）
        interval: number;    // 何日ごと
        until?: string;
        excludeDates?: string[];
    }
    | {
        type: "weekly";
        startDate: string;   // ← 追加
        interval: number;    // 何週ごと
        weekdays: number[];
        until?: string;
        excludeDates?: string[];
    }
    | {
        type: "monthly";
        startDate: string;   // ← 追加
        interval: number;
        day: number;
        until?: string;
        excludeDates?: string[];
    };



// ==============================
// 時間帯（1イベントに複数設定可）
// ==============================
export type TimeRange = {
    start: string; // "18:00"
    end: string;   // "23:00"
};


// ==============================
// イベント本体
// ==============================
export type EventItem = {
    id: string;              // 一意ID
    title: string;           // 表示名
    description?: string;    // 説明（任意）

    /** 1日に複数時間帯を持てる */
    times: TimeRange[];

    /** 繰り返しルール */
    repeat: RepeatRule;

    /** 表示色 */
    color?: string;
};

export const events: EventItem[] = [
    {
        id: "State of Power",
        title: "最強王国",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-02-23",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6], 
        },
        color: "#fbff2bff",
    },

    {
        id: "Alliance Operation",
        title: "同盟大作戦",
        times: [{ start: "9:00", end: "19:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-03-02",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6], 
        },
        color: "#392bffff",
    },

    {
        id: "King of Icefield",
        title: "氷原支配者",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-03-09",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6], 
        },
        color: "#fbff2bff",
    },

    {
        id: "Alliance Mobilization",
        title: "同盟総動員",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-03-16",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6], 
        },
        color: "#392bffff",
    },

    {
        id: "Sunfire Castle",
        title: "王城決戦",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "daily",
            startDate: "2025-03-14",
            interval: 14,
        },
        color: "#ff2b2bff",
    },

    {
        id: "Fortress Battle",
        title: "砦争奪戦",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "daily",
            startDate: "2025-03-13",
            interval: 7,
        },
        color: "#67ff2bff",
    },

    {
        id: "Foundry Battle",
        title: "兵器工場戦",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "daily",
            startDate: "2025-03-22",
            interval: 14,
        },
        color: "#fff12bff",
    },

    {
        id: "canyon Clash",
        title: "渓谷合戦",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "daily",
            startDate: "2025-03-21",
            interval: 28,
        },
        color: "#fff12bff",
    },

    {
        id: "Armament Competition",
        title: "軍備競技",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-03-30",
            interval: 2,
            weekdays: [0, 1], 
        },
        color: "#392bffff",
    },
    {
        id: "Armament Competition",
        title: "軍備競技",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-04-03",
            interval: 2,
            weekdays: [4, 5], 
        },
        color: "#392bffff",
    },

    {
        id: "Officer Project",
        title: "士官計画",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-04-01",
            interval: 2,
            weekdays: [2, 3], 
        },
        color: "#392bffff",
    },
    {
        id: "Officer Project",
        title: "士官計画",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-04-05",
            interval: 2,
            weekdays: [6, 0], 
        },
        color: "#392bffff",
    },

    {
        id: "Defeat nearby beasts",
        title: "野獣駆逐",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-04-07",
            interval: 2,
            weekdays: [1, 2], 
        },
        color: "#392bffff",
    },

    {
        id: "Brother In Arms",
        title: "全軍参戦",
        times: [{ start: "9:00", end: "9:00" }],
        repeat: {
            type: "weekly",
            startDate: "2025-04-10",
            interval: 4,
            weekdays: [4, 5], 
        },
        color: "#392bffff",
    },
];
