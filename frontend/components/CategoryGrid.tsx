import CategoryCard from "./CategoryCard";
import styles from "@/styles/Home.module.css";

type Item = {
    label: string;
    href: string;
    image?: string; // ← 追加
};

export default function CategoryGrid({ items }: { items: Item[] }) {
    return (
        <div className={styles.grid}>
            {items.map((item, i) => (
                <CategoryCard
                    key={i}
                    label={item.label}
                    href={item.href}
                    image={item.image}
                />
            ))}
        </div>
    );
}
