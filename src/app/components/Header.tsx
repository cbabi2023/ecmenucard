'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title = 'EC Fresh Point', showBack = false }: HeaderProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {showBack ? (
          <Link href={isAdmin ? '/admin/dashboard' : '/'} className={styles.backBtn}>
            <FiArrowLeft size={20} />
          </Link>
        ) : (
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <span className={styles.logoText}>EC</span>
            </div>
          </div>
        )}

        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{title}</h1>
          {!isAdmin && !showBack && (
            <span className={styles.tagline}>Fresh Menu &amp; Ordering</span>
          )}
        </div>

        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    </header>
  );
}
