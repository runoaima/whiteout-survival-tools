/** スキルID（ボタンIDとCSSクラス名を兼ねる） */
export type SkillId =
    | "healing"
    | "training"
    | "firstaid"
    | "marksman"
    | "attack"
    | "legion"
    | "defense"
    | "lethality"
    | "armor"
    | "squad";

/** 素材キー（固定：6種類） */
export type MaterialKey =
    | "火晶微粒子"
    | "鋼材"
    | "生肉"
    | "木材"
    | "石炭"
    | "鉄鉱";

export const MATERIAL_KEYS: MaterialKey[] = [
    "火晶微粒子",
    "鋼材",
    "生肉",
    "木材",
    "石炭",
    "鉄鉱",
];

/** Lvごとの素材テーブル */
export type MaterialsPerLevel = Record<MaterialKey, number[]>;

/* スキル1つ分の定義 */
export type SkillConfig = {
    label: string; // 表示名
    maxLevel: number; // 最大Lv
    materials: MaterialsPerLevel; // Lvごとの素材（6種類）
    parent?: SkillId[]; // 上位スキル（複数可）
    children?: SkillId[]; // 下位スキル（複数可）
};

/*
 * ノードの配置（画像の雰囲気に合わせた例）
 * - x,y は「%」で指定（レスポンシブに強い）
 * - ここを調整すれば画像と同じ配置に寄せられる
 */
export const NODE_LAYOUT: Record<
    SkillId,
    { xPct: number; yPct: number }
> = {
    // 上段3つ
    healing: { xPct: 18, yPct: 18 },
    training: { xPct: 50, yPct: 10 },
    firstaid: { xPct: 82, yPct: 18 },

    // 中央（烈日兵士）
    marksman: { xPct: 50, yPct: 32 },

    // 中段3つ
    attack: { xPct: 18, yPct: 55 },
    legion: { xPct: 50, yPct: 62 },
    defense: { xPct: 82, yPct: 55 },

    // 下段2つ
    lethality: { xPct: 18, yPct: 78 },
    armor: { xPct: 82, yPct: 78 },

    // 最下段
    squad: { xPct: 50, yPct: 90 },
};

/*
 * スキル定義本体（あなたのデータを踏襲）
 */
export const SKILL_CONFIG: Record<SkillId, SkillConfig> = {
    healing: {
        label: "烈日治癒",
        maxLevel: 10,
        materials: {
            火晶微粒子: [10, 10, 12, 12, 14, 14, 16, 16, 18, 20],
            鋼材: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            生肉: [5, 5, 6, 6, 7, 7, 8, 8, 9, 10],
            木材: [5, 5, 6, 6, 7, 7, 8, 8, 9, 10],
            石炭: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            鉄鉱: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        children: ["marksman"],
    },

    training: {
        label: "烈日訓練",
        maxLevel: 10,
        materials: {
            火晶微粒子: [6, 6, 8, 8, 10, 10, 12, 12, 14, 16],
            鋼材: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            生肉: [3, 3, 4, 4, 5, 5, 6, 6, 7, 8],
            木材: [3, 3, 4, 4, 5, 5, 6, 6, 7, 8],
            石炭: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            鉄鉱: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        children: ["marksman"],
    },

    firstaid: {
        label: "烈日救急",
        maxLevel: 10,
        materials: {
            火晶微粒子: [6, 6, 8, 8, 10, 10, 12, 12, 14, 16],
            鋼材: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            生肉: [3, 3, 4, 4, 5, 5, 6, 6, 7, 8],
            木材: [3, 3, 4, 4, 5, 5, 6, 6, 7, 8],
            石炭: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            鉄鉱: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        children: ["marksman"],
    },

    marksman: {
        label: "烈日兵士",
        maxLevel: 1,
        materials: {
            火晶微粒子: [50],
            鋼材: [0],
            生肉: [0],
            木材: [0],
            石炭: [0],
            鉄鉱: [0],
        },
        parent: ["healing", "training", "firstaid"],
        children: ["attack", "legion", "defense"],
    },

    attack: {
        label: "攻撃強化",
        maxLevel: 12,
        materials: {
            火晶微粒子: [8, 8, 10, 10, 12, 12, 14, 16, 18, 20, 22, 24],
            鋼材: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
            生肉: [10, 10, 12, 12, 14, 14, 16, 18, 20, 22, 24, 26],
            木材: [10, 10, 12, 12, 14, 14, 16, 18, 20, 22, 24, 26],
            石炭: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
            鉄鉱: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
        },
        parent: ["marksman"],
        children: ["lethality"],
    },

    legion: {
        label: "烈日軍団",
        maxLevel: 12,
        materials: {
            火晶微粒子: [8, 8, 10, 10, 12, 12, 14, 16, 18, 20, 22, 24],
            鋼材: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
            生肉: [10, 10, 12, 12, 14, 14, 16, 18, 20, 22, 24, 26],
            木材: [10, 10, 12, 12, 14, 14, 16, 18, 20, 22, 24, 26],
            石炭: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
            鉄鉱: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
        },
        parent: ["marksman"],
        children: ["lethality", "armor"],
    },

    defense: {
        label: "防御強化",
        maxLevel: 12,
        materials: {
            火晶微粒子: [8, 8, 10, 10, 12, 12, 14, 16, 18, 20, 22, 24],
            鋼材: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
            生肉: [10, 10, 12, 12, 14, 14, 16, 18, 20, 22, 24, 26],
            木材: [10, 10, 12, 12, 14, 14, 16, 18, 20, 22, 24, 26],
            石炭: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
            鉄鉱: [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5],
        },
        parent: ["marksman"],
        children: ["armor"],
    },

    lethality: {
        label: "殺傷力強化",
        maxLevel: 8,
        materials: {
            火晶微粒子: [10, 10, 12, 12, 14, 16, 18, 20],
            鋼材: [2, 2, 3, 3, 4, 4, 5, 5],
            生肉: [12, 12, 14, 14, 16, 18, 20, 22],
            木材: [12, 12, 14, 14, 16, 18, 20, 22],
            石炭: [2, 2, 3, 3, 4, 4, 5, 5],
            鉄鉱: [2, 2, 3, 3, 4, 4, 5, 5],
        },
        parent: ["attack", "legion"],
        children: ["squad"],
    },

    armor: {
        label: "HP強化",
        maxLevel: 8,
        materials: {
            火晶微粒子: [10, 10, 12, 12, 14, 16, 18, 20],
            鋼材: [2, 2, 3, 3, 4, 4, 5, 5],
            生肉: [12, 12, 14, 14, 16, 18, 20, 22],
            木材: [12, 12, 14, 14, 16, 18, 20, 22],
            石炭: [2, 2, 3, 3, 4, 4, 5, 5],
            鉄鉱: [2, 2, 3, 3, 4, 4, 5, 5],
        },
        parent: ["defense", "legion"],
        children: ["squad"],
    },

    squad: {
        label: "烈日戦隊",
        maxLevel: 5,
        materials: {
            火晶微粒子: [20, 22, 24, 26, 28],
            鋼材: [5, 5, 6, 6, 7],
            生肉: [30, 32, 34, 36, 38],
            木材: [30, 32, 34, 36, 38],
            石炭: [5, 5, 6, 6, 7],
            鉄鉱: [5, 5, 6, 6, 7],
        },
        parent: ["lethality", "armor"],
    },
};
