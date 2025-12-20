import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

const Header = dynamic(() => import("@/components/Header"), {
    ssr: false,
});

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
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tools/list/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            setItems(data.results || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <>
            <Header title="マイページ" />
            <main style={{ padding: 16 }}>
                {loading ? "Loading..." : JSON.stringify(items)}
            </main>
        </>
    );
}
