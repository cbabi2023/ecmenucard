'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/supabase';
import { FiX, FiUser, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './OrderForm.module.css';

interface OrderFormProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onOrderPlaced: () => void;
}

const WHATSAPP_NUMBER = '919605984498';

export default function OrderForm({ isOpen, items, onClose, onOrderPlaced }: OrderFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.cart_quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);

    // Build WhatsApp message
    let message = `🛒 *New Order from EC Menu Card*\n\n`;
    message += `👤 *Customer:* ${name.trim()}\n`;
    message += `📱 *Phone:* ${phone.trim()}\n\n`;
    message += `📋 *Order Details:*\n`;
    message += `─────────────────\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   ${item.quantity} × ${item.cart_quantity} = ₹${(item.price * item.cart_quantity).toFixed(0)}\n`;
    });

    message += `─────────────────\n`;
    message += `💰 *Total: ₹${total.toFixed(0)}*\n\n`;
    message += `Thank you for your order! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setSubmitting(false);
    setName('');
    setPhone('');
    onOrderPlaced();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Complete Your Order</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className={styles.orderSummary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className={styles.summaryItem}>
              <span>{item.name} × {item.cart_quantity}</span>
              <span className={styles.summaryPrice}>₹{(item.price * item.cart_quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="customerName">
              <FiUser size={14} /> Your Name
            </label>
            <input
              id="customerName"
              type="text"
              className={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="customerPhone">
              <FiPhone size={14} /> Phone Number
            </label>
            <input
              id="customerPhone"
              type="tel"
              className={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!name.trim() || !phone.trim() || submitting}
          >
            <FaWhatsapp size={20} />
            {submitting ? 'Sending...' : 'Send Order via WhatsApp'}
          </button>

          <p className={styles.note}>
            Your order will be sent to our WhatsApp. We&apos;ll confirm your order shortly!
          </p>
        </form>
      </div>
    </>
  );
}
