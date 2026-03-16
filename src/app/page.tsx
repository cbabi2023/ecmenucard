'use client';

import { useEffect, useState } from 'react';
import { supabase, Category, MenuItem, CartItem } from '@/lib/supabase';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import OrderForm from './components/OrderForm';
import { FiShoppingCart } from 'react-icons/fi';
import styles from './page.module.css';

export default function CustomerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('menu_items').select('*, category:categories(*)').eq('is_available', true).order('sort_order'),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(catRes.data ?? []);
        setMenuItems(menuRes.data ?? []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.category_id === activeCategory)
    : menuItems;

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, cart_quantity: c.cart_quantity + 1 } : c));
      }
      return [...prev, { ...item, cart_quantity: 1 }];
    });
  };

  const incrementCart = (itemId: string) => {
    setCart((prev) => prev.map((c) => (c.id === itemId ? { ...c, cart_quantity: c.cart_quantity + 1 } : c)));
  };

  const decrementCart = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === itemId ? { ...c, cart_quantity: c.cart_quantity - 1 } : c))
        .filter((c) => c.cart_quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.cart_quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + item.price * item.cart_quantity, 0);
  const activeCategoryName = activeCategory
    ? categories.find((category) => category.id === activeCategory)?.name ?? 'Curated Collection'
    : 'Chef Curated Fresh Picks';

  const handleOrderPlaced = () => {
    setCart([]);
    setOrderFormOpen(false);
    setCartOpen(false);
  };

  return (
    <div className={styles.page}>
      <Header title="EC Fresh Point" />

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <div className={styles.heroBackdrop} />
            <div className={styles.heroCard}>
              <span className={styles.heroKicker}>EC Fresh Point</span>
              <h2 className={styles.heroTitle}>Fresh-crafted flavors with a premium menu experience.</h2>
              <p className={styles.heroText}>
                Explore elegant daily picks, seasonal specialties, and WhatsApp ordering designed to feel effortless.
              </p>
              <div className={styles.heroPills}>
                <span className={styles.heroPill}>Freshly prepared</span>
                <span className={styles.heroPill}>Fast WhatsApp ordering</span>
                <span className={styles.heroPill}>Curated every day</span>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{categories.length}</span>
                  <span className={styles.heroStatLabel}>collections</span>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{menuItems.length}</span>
                  <span className={styles.heroStatLabel}>fresh picks</span>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{totalCartItems}</span>
                  <span className={styles.heroStatLabel}>in your cart</span>
                </div>
              </div>
            </div>
          </section>

          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Now Serving</span>
              <h3 className={styles.sectionTitle}>{activeCategoryName}</h3>
              <p className={styles.sectionText}>
                Beautifully presented favorites chosen for freshness, flavor, and quick ordering.
              </p>
            </div>
            <div className={styles.sectionBadge}>{filteredItems.length} items</div>
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonLine} style={{ width: '70%' }} />
                    <div className={styles.skeletonLine} style={{ width: '90%' }} />
                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No fresh picks found</p>
              <span>We are refreshing this collection. Check back shortly for the next drop.</span>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredItems.map((item, index) => (
                <div key={item.id} style={{ animationDelay: `${index * 0.05}s` }} className={styles.gridItem}>
                  <MenuCard
                    item={item}
                    cartItem={cart.find((c) => c.id === item.id)}
                    onAdd={addToCart}
                    onIncrement={incrementCart}
                    onDecrement={decrementCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {totalCartItems > 0 && (
        <button className={styles.cartFab} onClick={() => setCartOpen(true)}>
          <FiShoppingCart size={22} />
          <span className={styles.cartBadge}>{totalCartItems}</span>
          <span className={styles.cartTotal}>₹{totalCartValue.toFixed(0)}</span>
        </button>
      )}

      <CartDrawer
        isOpen={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onIncrement={incrementCart}
        onDecrement={decrementCart}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setOrderFormOpen(true);
        }}
      />

      <OrderForm
        isOpen={orderFormOpen}
        items={cart}
        onClose={() => setOrderFormOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  );
}
