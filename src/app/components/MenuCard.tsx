'use client';

import { MenuItem, CartItem } from '@/lib/supabase';
import { FiPlus, FiMinus } from 'react-icons/fi';
import styles from './MenuCard.module.css';

interface MenuCardProps {
  item: MenuItem;
  cartItem?: CartItem;
  onAdd: (item: MenuItem) => void;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
}

export default function MenuCard({ item, cartItem, onAdd, onIncrement, onDecrement }: MenuCardProps) {
  const quantity = cartItem?.cart_quantity || 0;
  const categoryName = item.category?.name ?? 'Fresh Pick';
  const fallbackInitials = item.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        {item.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.name} className={styles.image} />
          </>
        ) : (
          <div className={styles.imageFallback}>
            <span className={styles.fallbackInitials}>{fallbackInitials}</span>
          </div>
        )}
        {!item.is_available && (
          <div className={styles.soldOutOverlay}>
            <span className={styles.soldOutText}>Unavailable</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.badgeRow}>
          <span className={styles.categoryBadge}>{categoryName}</span>
          {item.is_available && <span className={styles.freshBadge}>Fresh Today</span>}
        </div>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{Number(item.price).toFixed(0)}</span>
          {item.is_available && (
            <div className={styles.actions}>
              {quantity > 0 ? (
                <div className={styles.quantityControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => onDecrement(item.id)}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => onIncrement(item.id)}
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              ) : (
                <button className={styles.addBtn} onClick={() => onAdd(item)}>
                  <FiPlus size={14} />
                  <span className={styles.addBtnText}>Add</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
