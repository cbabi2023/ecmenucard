'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiMenu, FiArrowLeft } from 'react-icons/fi';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title = 'EC Menu Card', showBack = false }: HeaderProps) {
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
              <FiMenu size={18} />
            </div>
          </div>
        )}

        <h1 className={styles.title}>{title}</h1>

        <div style={{ width: 36 }} aria-hidden="true" />
      </div>
    </header>
  );
}
