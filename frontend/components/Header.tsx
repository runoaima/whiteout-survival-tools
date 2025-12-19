import { useState } from "react";
import styles from "@/styles/Header.module.css";
import HamburgerMenu from "./HamburgerMenu";

export default function Header({ title }: { title: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.left}>{title}</div>

                <div className={styles.right}>
                    <button className={styles.icon}>🔍</button>
                    <button className={styles.icon}>👤</button>
                    <button className={styles.icon} onClick={() => setOpen(true)}>
                        ☰
                    </button>
                </div>
            </header>

            <HamburgerMenu open={open} onClose={() => setOpen(false)} />
        </>
    );
}
