import Link from "next/link";
import styles from "@/styles/CategoryTextNav.module.css";

export default function CategoryTextNav({
    categories,
}: {
    categories: { label: string; href: string }[];
}) {
    return (
        <nav className={styles.nav}>
            {categories.map((c) => (
                <Link key={c.href} href={c.href} className={styles.item}>
                    {c.label}
                </Link>
            ))}
        </nav>
    );
}
