"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/Header.module.css";
import HamburgerMenu from "./HamburgerMenu";
import { auth } from "@/lib/firebase";

export default function Header({ title }: { title: string }) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<unknown>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        // 🔴 firebase/auth をここで初めて読む
        import("firebase/auth").then(({ onAuthStateChanged }) => {
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
        });

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
