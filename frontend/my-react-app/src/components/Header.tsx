import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>就活アプリ</div>
      <ul className={styles.links}>
        <li>
          <Link to="/" className={styles.link}>
            企業情報
          </Link>
        </li>
        <li>
          <Link to="/products" className={styles.link}>
            インターン
          </Link>
        </li>
        <li>
          <Link to="/cart" className={styles.link}>
            自己分析
          </Link>
        </li>
        <li>
          <Link to="/login" className={styles.link}>
            ログアウト
          </Link>
        </li>
      </ul>
    </nav>
  );
}
