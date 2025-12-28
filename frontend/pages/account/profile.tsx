import AccountLayout from "@/components/AccountLayout";
import styles from "@/styles/form.module.css";
import btn from "@/styles/buttons.module.css";

export default function Profile() {
  return (
    <AccountLayout title="プロフィール編集">
      <div className={styles.group}>
        <label className={styles.label}>ユーザー名</label>
        <input className={styles.input} />
      </div>

      <button className={btn.primary}>保存</button>
    </AccountLayout>
  );
}
