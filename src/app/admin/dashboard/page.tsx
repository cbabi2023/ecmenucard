'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '../../components/Header';
import { FiGrid, FiList, FiLogOut, FiPlus } from 'react-icons/fi';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }

    const fetchCounts = async () => {
      const [catRes, menuRes] = await Promise.all([
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('menu_items').select('id', { count: 'exact', head: true }),
      ]);
      setCategoryCount(catRes.count || 0);
      setMenuItemCount(menuRes.count || 0);
      setLoading(false);
    };

    fetchCounts();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_auth');
    router.push('/admin');
  };

  return (
    <div className={styles.page}>
      <Header title="Dashboard" showBack />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.welcome}>
            <h2>Welcome, Admin 👋</h2>
            <p>Manage your menu categories and items</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(27, 94, 32, 0.1)' }}>
                <FiGrid size={22} color="#1B5E20" />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{loading ? '...' : categoryCount}</span>
                <span className={styles.statLabel}>Categories</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(46, 125, 50, 0.1)' }}>
                <FiList size={22} color="#2E7D32" />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{loading ? '...' : menuItemCount}</span>
                <span className={styles.statLabel}>Menu Items</span>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <Link href="/admin/categories" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <FiGrid size={24} />
                </div>
                <span className={styles.actionLabel}>Manage Categories</span>
                <span className={styles.actionDesc}>Add, edit or remove categories</span>
              </Link>
              <Link href="/admin/menu-items" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <FiList size={24} />
                </div>
                <span className={styles.actionLabel}>Manage Menu Items</span>
                <span className={styles.actionDesc}>Add, edit or remove menu items</span>
              </Link>
            </div>
          </div>

          <div className={styles.quickAdd}>
            <Link href="/admin/categories?add=true" className={styles.quickAddBtn}>
              <FiPlus size={18} /> Add Category
            </Link>
            <Link href="/admin/menu-items?add=true" className={styles.quickAddBtn}>
              <FiPlus size={18} /> Add Menu Item
            </Link>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </main>
    </div>
  );
}
