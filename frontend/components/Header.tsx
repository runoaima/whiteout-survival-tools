"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/Header.module.css";
import HamburgerMenu from "./HamburgerMenu";
import { getFirebaseAuth } from "@/lib/firebase";


export default function Header({ title }: { title: string }) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<unknown>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        (async () => {
            const auth = await getFirebaseAuth();
            const { onAuthStateChanged } = await import("firebase/auth");

            unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
            });
        })();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);


    return (
        <>
            <header className={styles.header}>
                <div className={styles.left}>{title}</div>

                <div className={styles.right}>
                    <button className={styles.icon}>🔍</button>

                    <Link
                        href={user ? "/mypage" : "/login"}
                        className={styles.icon}
                    >
                        👤
                    </Link>

                    <button
                        className={styles.icon}
                        onClick={() => setOpen(true)}
                    >
                        ☰
                    </button>
                </div>
            </header>

            <HamburgerMenu open={open} onClose={() => setOpen(false)} />
        </>
    );
}
