import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

type SavedCalculation = {
    id: number;
    tool: string;
    title: string;
    created_at: string;
    input: unknown;
    result: unknown;
};


export default function MyPage() {
    const [items, setItems] = useState<SavedCalculation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError("ログインしてください");
                    setLoading(false);
                    return;
                }

                const token = await user.getIdToken();

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tools/list/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("fetch failed");
                }

                const data = await res.json();
                setItems(data.results || []);
            } catch (e) {
                setError("保存データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <main style={{ padding: "16px" }}>
            <h1>マイページ</h1>

            {loading && <p>読み込み中...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && items.length === 0 && (
                <p>保存された計算はありません</p>
            )}

            {items.map(item => (
                <div
                    key={item.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                    }}
                >
                    <strong>{item.title || item.tool}</strong>
                    <div style={{ fontSize: "0.85em", color: "#666" }}>
                        {new Date(item.created_at).toLocaleString()}
                    </div>

                    <pre
                        style={{
                            background: "#f7f7f7",
                            padding: "8px",
                            marginTop: "8px",
                            fontSize: "0.8em",
                            overflowX: "auto",
                        }}
                    >
                        {JSON.stringify(item.result, null, 2)}
                    </pre>
                </div>
            ))}
        </main>
    );
}
