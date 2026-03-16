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
      <div className={styles.imageWrapper}>
        {item.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.name} className={styles.image} />
          </>
        ) : (
          <div className={styles.imageFallback}>
            <span className={styles.fallbackInitials}>{fallbackInitials}</span>
            <span className={styles.fallbackLabel}>Signature Selection</span>
          </div>
        )}
        <div className={styles.imageShade} />
        <div className={styles.cardBadges}>
          <span className={styles.categoryBadge}>{categoryName}</span>
          {item.is_available ? (
            <span className={styles.freshBadge}>Fresh Today</span>
          ) : (
            <div className={styles.unavailableBadge}>Unavailable</div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.info}>
            <div className={styles.titleRow}>
              <h3 className={styles.name}>{item.name}</h3>
              <span className={styles.priceTag}>₹{Number(item.price).toFixed(0)}</span>
            </div>
            {item.description && <p className={styles.description}>{item.description}</p>}
            <div className={styles.metaRow}>
              <span className={styles.quantity}>{item.quantity}</span>
              <span className={styles.dot} />
              <span className={styles.signatureNote}>Chef-styled serving</span>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomCopy}>
            <span className={styles.bottomLabel}>Add to order</span>
            <span className={styles.price}>Premium fresh prep</span>
          </div>
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
