import styles from "@/styles/PageIntro.module.css";

type TocItem = {
    label: string;
    targetId: string;
};

export default function PageIntro({
    title,
    updatedAt,
    description,
    toc,
}: {
    title: string;
    updatedAt: string;
    description: string;
    toc: TocItem[];
}) {
    return (
        <section className={styles.wrapper}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.updated}>最終更新：{updatedAt}</p>
            <p className={styles.description}>{description}</p>

            <div className={styles.toc}>
                <p className={styles.tocTitle}>目次（タップで移動）</p>
                <ul>
                    {toc.map((item) => (
                        <li key={item.targetId}>
                            <a href={`#${item.targetId}`}>{item.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
