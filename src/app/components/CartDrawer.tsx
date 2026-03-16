'use client';

import { CartItem } from '@/lib/supabase';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './CartDrawer.module.css';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.cart_quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.cart_quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Your Order</h2>
            <span className={styles.subtitle}>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty</p>
              <span>Add some delicious items from the menu!</span>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                    <span className={styles.itemPrice}>₹{Number(item.price).toFixed(0)} × {item.cart_quantity}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <span className={styles.itemTotal}>₹{(item.price * item.cart_quantity).toFixed(0)}</span>
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} onClick={() => onDecrement(item.id)}>
                        <FiMinus size={12} />
                      </button>
                      <span className={styles.qtyValue}>{item.cart_quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => onIncrement(item.id)}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>₹{total.toFixed(0)}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={onCheckout}>
              <FaWhatsapp size={20} />
              Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
