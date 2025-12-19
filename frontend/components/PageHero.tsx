import styles from "@/styles/PageHero.module.css";

export default function PageHero({
    title,
    imageUrl,
}: {
    title: string;
    imageUrl: string;
}) {
    return (
        <div
            className={styles.hero}
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            <h1>{title}</h1>
        </div>
    );
}
