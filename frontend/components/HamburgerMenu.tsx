import Link from "next/link";
import styles from "@/styles/HamburgerMenu.module.css";

export default function HamburgerMenu({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <>
            {/* 背景オーバーレイ */}
            <div className={styles.overlay} onClick={onClose} />

            {/* メニュー本体 */}
            <nav className={styles.menu}>
                <button className={styles.close} onClick={onClose}>
                    ✕
                </button>

                <ul>
                    <li><Link href="/" onClick={onClose}>トップ</Link></li>
                    <li><Link href="/guides" onClick={onClose}>攻略情報</Link></li>
                    <li><Link href="/tools" onClick={onClose}>計算ツール</Link></li>
                    <li><Link href="/guides/events" onClick={onClose}>イベント攻略</Link></li>
                    <li><Link href="/guides/faq" onClick={onClose}>FAQ</Link></li>
                </ul>

                <hr />

                <ul>
                    <li><Link href="/login" onClick={onClose}>ログイン</Link></li>
                </ul>
            </nav>
        </>
    );
}
