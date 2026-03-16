'use client';

import { Category } from '@/lib/supabase';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <button
          className={`${styles.tab} ${activeCategory === null ? styles.active : ''}`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.tab} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
