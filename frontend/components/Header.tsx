"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/Header.module.css";
import HamburgerMenu from "./HamburgerMenu";
import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Header({ title }: { title: string }) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getFirebaseAuth();

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsubscribe();
    }, []);
    const accountLink = user ? "/account" : "/login";

    return (
        <>
            <header className={styles.header}>
                <Link href="/" className={styles.left}>
                    {title}
                </Link>

                <div className={styles.right}>
                    <button className={styles.icon}>🔍</button>

                    <Link href={accountLink} className={styles.icon}>
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
