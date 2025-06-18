"use client"

import useIntern from "@/hooks/input/useIntern"
import Header from "@/components/Header"
// import HeaderSpacer from "./header-spacer"
import styles from "@/styles/list/interninput.module.css"

export default function AddIntern() {
  const { addIntern, error, loading } = useIntern()

  return (
    <>
      <Header />
      {/* <HeaderSpacer /> */}
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>インターン情報追加</h1>

            {error && (
              <div className={styles.errorAlert}>
                <p>{error}</p>
              </div>
            )}

            <form className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  タイトル <span className={styles.required}>*</span>
                </label>
                <input type="text" placeholder="タイトル" className={styles.input} />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  企業名 <span className={styles.required}>*</span>
                </label>
                <input type="text" placeholder="企業名" className={styles.input} />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>開始時間</label>
                  <input type="number" placeholder="9" className={styles.input} min="0" max="23" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>終了時間</label>
                  <input type="number" placeholder="17" className={styles.input} min="0" max="23" />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>内容</label>
                <textarea placeholder="インターンの詳細内容を入力してください" className={styles.textarea} rows={4} />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>選考ステータス</label>
                <select className={styles.select}>
                  <option value="">選択してください</option>
                  <option value="応募前">応募前</option>
                  <option value="書類選考">書類選考</option>
                  <option value="面接">面接</option>
                  <option value="合格">合格</option>
                  <option value="不合格">不合格</option>
                </select>
              </div>

              <div className={styles.checkboxGroup}>
                <input type="checkbox" id="priority" className={styles.checkbox} />
                <label htmlFor="priority" className={styles.checkboxLabel}>
                  優先度高
                </label>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "追加中..." : "追加"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
