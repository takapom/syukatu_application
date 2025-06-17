"use client"

import useCompany from "@/hooks/get/useCompany"
import Header from "@/components/Header"
import styles from "@/styles/list/company-list.module.css"
import Link from "next/link"

export default function Company() {
  const { companyLists, error, loading } = useCompany()

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>読み込み中...</p>
      </div>
    )

  if (error)
    return (
      <div className={styles.background}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <p>エラー: {error.message}</p>
          </div>
        </div>
      </div>
    )

  return (
    <>
          <Header />
    <div className={styles.background}>
      <div className={styles.container}>
        <h1 className={styles.title}>企業リスト</h1>
        <Link href="/companylists">
        <button className={styles.addButton}>追加する</button>
        </Link>
        <div className={styles.grid}>
          {Array.isArray(companyLists) &&
            companyLists.map((company, index) => (
              <div key={company.id || index} className={styles.card}>
                <h3 className={styles.companyName}>{company.company}</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>職種:</span>
                    <span
                      className={company.occupation === "未設定" ? `${styles.value} ${styles.unset}` : styles.value}
                    >
                      {company.occupation}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>人数:</span>
                    <span className={company.member === 0 ? `${styles.value} ${styles.unset}` : styles.value}>
                      {company.member}人
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>選考状況:</span>
                    <span className={company.selection === "未設定" ? `${styles.value} ${styles.unset}` : styles.value}>
                      {company.selection}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>インターン:</span>
                    <span
                      className={
                        company.intern ? `${styles.value} ${styles.positive}` : `${styles.value} ${styles.negative}`
                      }
                    >
                      {company.intern ? "希望" : "希望しない"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {(!Array.isArray(companyLists) || companyLists.length === 0) && (
          <div className={styles.emptyState}>
            <div className={styles.emptyCard}>
              <p>企業情報が登録されていません</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
