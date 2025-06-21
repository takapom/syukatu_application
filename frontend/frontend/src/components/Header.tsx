'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Header.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const toggleNav = () => {
    setOpen(prev => !prev);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandText}>Home</span>
        </Link>
        
        <button
          className={styles.toggleButton}
          type="button"
          onClick={toggleNav}
          aria-label="Toggle navigation"
        >
          <span className={`${styles.hamburger} ${open ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`${styles.navCollapse} ${open ? styles.show : ''}`}>
          <div className={styles.navMenu}>
            <Link
              href="/company"
              className={styles.navItem}
              onClick={() => setOpen(false)}
            >
              企業リスト
            </Link>
            <Link
              href="/InternList"
              className={styles.navItem}
              onClick={() => setOpen(false)}
            >
              インターンリスト
            </Link>
            <Link
              href="/analysis"
              className={styles.navItem}
              onClick={() => setOpen(false)}
            >
              自己分析
            </Link>
            <Link
              href="/"
              className={styles.navItem}
              onClick={() => setOpen(false)}
            >
              就活掲示板
            </Link>
            <Link
              href="/"
              className={styles.navItem}
              onClick={() => setOpen(false)}
            >
              設定
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

