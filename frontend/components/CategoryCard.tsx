import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function CategoryCard({
    label,
    href,
    image,
}: {
    label: string;
    href: string;
    image?: string;
}) {
    return (
        <Link href={href} className={styles.card}>
            {image && (
                <img
                    src={image}
                    alt={label}
                    className={styles.cardImage}
                />
            )}
            <span>{label}</span>
        </Link>
    );
}
