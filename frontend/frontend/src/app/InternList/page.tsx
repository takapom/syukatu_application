"use client"

import useIntern from "@/hooks/get/useIntern"
import Header from "@/components/Header"
import Link from "next/link"
import styles from "@/styles/list/intern-list.module.css"

export default function InternList() {
  const { internships, loading, error } = useIntern()
  console.log(internships)

  if (loading)
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      </>
    )

  if (error)
    return (
      <>
        <Header />
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.errorCard}>
              <p>エラー: {error}</p>
            </div>
          </div>
        </div>
      </>
    )

  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>インターンリスト</h1>
            <Link href="/AddIntern" className={styles.addButtonLink}>
              <button className={styles.addButton}>追加</button>
            </Link>
          </div>

          <div className={styles.grid}>
            {internships.map((intern) => (
              <div key={intern.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.internTitle}>{intern.title}</h3>
                  <span className={styles.company}>（{intern.company}）</span>
                </div>

                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>時間:</span>
                    <span className={styles.value}>
                      {intern.dailystart}時〜{intern.dailyfinish}時
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.label}>内容:</span>
                    <span className={styles.value}>{intern.content}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.label}>選考状況:</span>
                    <span className={styles.value}>{intern.selection}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.label}>参加:</span>
                    <span className={intern.joined ? `${styles.value} ${styles.completed}` : `${styles.value} ${styles.pending}`}>
                      {intern.joined ? "済" : "未"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {internships.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyCard}>
                <p>インターン情報が登録されていません</p>
                <Link href="/AddIntern" className={styles.emptyAddLink}>
                  <button className={styles.emptyAddButton}>最初のインターンを追加</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
