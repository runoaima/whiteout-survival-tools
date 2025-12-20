import { getAuth } from "firebase/auth";

export async function saveToolCalculation(
    tool: string,
    title: string,
    input: any,
    result: any
) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("NOT_LOGGED_IN");
    }

    const token = await user.getIdToken();

    const res = await fetch("http://localhost:8000/api/tools/save/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            tool,
            title,
            input,
            result,
        }),
    });

    if (!res.ok) {
        throw new Error("SAVE_FAILED");
    }
}
