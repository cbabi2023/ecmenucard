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

  return (
    <div className={styles.card}>
      {item.image_url && (
        <div className={styles.imageWrapper}>
          <img src={item.image_url} alt={item.name} className={styles.image} />
          {!item.is_available && <div className={styles.unavailableBadge}>Unavailable</div>}
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.info}>
            <h3 className={styles.name}>{item.name}</h3>
            {item.description && <p className={styles.description}>{item.description}</p>}
            <span className={styles.quantity}>{item.quantity}</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.price}>₹{Number(item.price).toFixed(0)}</span>
          {item.is_available && (
            <div className={styles.actions}>
              {quantity > 0 ? (
                <div className={styles.quantityControl}>
                  <button className={styles.qtyBtn} onClick={() => onDecrement(item.id)}>
                    <FiMinus size={14} />
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button className={styles.qtyBtn} onClick={() => onIncrement(item.id)}>
                    <FiPlus size={14} />
                  </button>
                </div>
              ) : (
                <button className={styles.addBtn} onClick={() => onAdd(item)}>
                  <FiPlus size={14} /> Add
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
