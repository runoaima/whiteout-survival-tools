import styles from "@/styles/Footer.module.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={styles.footer}>

            {/* 権利表記 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>当ゲームタイトルの権利表記</div>
                <p className={styles.copyrightText}>
                    ©2025 runoaima All Rights Reserved.<br />
                    当サイト上で使用しているゲーム画像の著作権および商標権、その他知的財産権は、
                    各権利所有者に帰属します。
                </p>
            </div>

            {/* フッターリンク */}
            <div className={styles.linkGrid}>
                <Link href="#">トップ</Link>
                <Link href="#">ヘルプ</Link>
                <Link href="#">運営会社</Link>
                <Link href="#">採用情報</Link>
                <Link href="#">利用規約</Link>
                <Link href="#">プライバシーポリシー</Link>
                <Link href="#">広告のご案内</Link>
                <Link href="#">お問い合わせ</Link>
            </div>

            <div className={styles.copy}>
                Copyright © runoaima All Rights Reserved.
            </div>
        </footer>
    );
}
