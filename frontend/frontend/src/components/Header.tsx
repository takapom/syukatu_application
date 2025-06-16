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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        Home
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNav}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
        <div className="navbar-nav">
          <Link
            href="/company"
            className={`nav-item nav-link ${styles.navItem}`}
          >
            企業リスト
          </Link>
          <Link
            href="/access"
            className={`nav-item nav-link ${styles.navItem}`}
          >
            インターンリスト
          </Link>
          <Link
            href="/careers"
            className={`nav-item nav-link ${styles.navItem}`}
          >
            自己分析
          </Link>
          <Link
            href="/english"
            className={`nav-item nav-link ${styles.navItem}`}
          >
            就活掲示板
          </Link>

        </div>
      </div>
    </nav>
  );
}
