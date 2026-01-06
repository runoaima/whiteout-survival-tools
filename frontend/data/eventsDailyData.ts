export type RepeatRule =
    | {
        type: "once";
        date: string;
    }
    | {
        type: "daily";
        startDate: string;
        interval: number;
        until?: string;
    }
    | {
        type: "weekly";
        startDate: string;
        interval: number;
        weekdays: number[];
        until?: string;
    }
    | {
        type: "monthly";
        startDate: string;
        interval: number;
        day: number;
        until?: string;
    };

export type TimeRange = {
    start: string;
    end: string;
};

export type EventItem = {
    id: string;
    title: string;
    times: TimeRange[];
    repeat: RepeatRule;
};

export const events: EventItem[] = [
    {
        id: "harvest",
        title: "同盟採取",
        times: [
            { start: "9:00(UTC00:00)", end: "鉄鉱" },
            { start: "21:00(UTC12:00)", end: "生肉" },
        ],
        repeat: {
            type: "daily",
            startDate: "2025-04-02",
            interval: 2,
        },
    },
    {
        id: "harvest",
        title: "同盟採取",
        times: [
            { start: "9:00(UTC00:00)", end: "木材" },
            { start: "21:00(UTC12:00)", end: "石炭" },
        ],
        repeat: {
            type: "daily",
            startDate: "2025-04-01",
            interval: 2,
        },
    },

    {
        id: "harvest",
        title: "熊狩り行動",
        times: [
            { start: "21:00(UTC12:00)", end: "くまその１" },
            { start: "22:00(UTC13:00)", end: "くまその２" },
        ],
        repeat: {
            type: "daily",
            startDate: "2025-04-01",
            interval: 2,
        },
    },

    {
        id: "State of Power",
        title: "最強王国",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-02-24",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6],
        }
    },

    {
        id: "Alliance Operation",
        title: "同盟大作戦",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-03-03",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6],
        }
    },

    {
        id: "King of Icefield",
        title: "氷原支配者",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-03-10",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6],
        }
    },

    {
        id: "Alliance Mobilization",
        title: "同盟総動員",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-03-17",
            interval: 4,
            weekdays: [0, 1, 2, 3, 4, 5, 6],
        }
    },

    {
        id: "Alliance Mobilization",
        title: "同盟争覇戦",
        times: [
            { start: "左ルート 盾:60 槍:10 弓:30", end: "" },
            { start: "ペットバフ付けてエントリーしてね！", end: "" },
        ],
        repeat: {
            type: "weekly",
            startDate: "2025-03-03",
            interval: 1,
            weekdays: [1, 2],
        }
    },

    {
        id: "Sunfire Castle",
        title: "王城決戦",
        times: [],
        repeat: {
            type: "daily",
            startDate: "2025-03-15",
            interval: 14,
        }
    },

    {
        id: "Fortress Battle",
        title: "砦争奪戦",
        times: [],
        repeat: {
            type: "daily",
            startDate: "2025-03-14",
            interval: 7,
        }
    },

    {
        id: "weapon1",
        title: "兵器工場争奪戦",
        times: [
            { start: "21:00(UTC12:00)", end: "兵器軍団１" },
            { start: "23:00(UTC14:00)", end: "兵器軍団２" }
        ],
        repeat: {
            type: "weekly",
            startDate: "2025-04-05",
            weekdays: [0],
            interval: 1,
        },
    },

    {
        id: "canyon Clash",
        title: "渓谷合戦",
        times: [],
        repeat: {
            type: "daily",
            startDate: "2025-03-22",
            interval: 28,
        }
    },

    {
        id: "Armament Competition",
        title: "軍備競技",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-03-31",
            interval: 2,
            weekdays: [1, 2],
        }
    },
    {
        id: "Armament Competition",
        title: "軍備競技",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-04-04",
            interval: 2,
            weekdays: [4, 5],
        }
    },

    {
        id: "Officer Project",
        title: "士官計画",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-04-02",
            interval: 2,
            weekdays: [0, 1],
        }
    },
    {
        id: "Officer Project",
        title: "烈火の牙前日",
        times: [
            { start: "17:00", end: "以降にアグネス使用！" },
            { start: "17:00", end: "以降の灯台赤ポチ注意！" },],
        repeat: {
            type: "weekly",
            startDate: "2025-04-06",
            interval: 2,
            weekdays: [0],
        }
    },
    {
        id: "Officer Project",
        title: "烈火の牙",
        times: [],
        repeat: {
            type: "weekly",
            startDate: "2025-04-07",
            interval: 2,
            weekdays: [1, 2],
        }
    },
];
