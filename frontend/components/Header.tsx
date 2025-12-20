"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // ← ここが重要
import styles from "@/styles/Header.module.css";
import HamburgerMenu from "./HamburgerMenu";

export default function Header({ title }: { title: string }) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
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
