import styles from "@/styles/Home.module.css";

export default function SearchBar() {
    return (
        <div className={styles.searchBar}>
            <input
                className={styles.searchInput}
                placeholder="コンテンツを検索"
            />
            <button className={styles.searchButton}>検索</button>
        </div>
    );
}
