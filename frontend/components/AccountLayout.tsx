import styles from "@/styles/account.module.css";
import Link from "next/link";

export default function AccountLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.card}>{children}</div>

      <div className={styles.back}>
        <Link href="/account">← プロフィールに戻る</Link>
      </div>
    </div>
  );
}
