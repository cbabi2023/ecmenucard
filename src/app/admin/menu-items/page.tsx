'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, Category, MenuItem } from '@/lib/supabase';
import Header from '../../components/Header';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import styles from './menuitems.module.css';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  quantity: '1 piece',
  category_id: '',
  image_url: '',
  is_available: true,
  sort_order: 0,
};

export default function MenuItemsPageWrapper() {
  return (
    <Suspense>
      <MenuItemsPage />
    </Suspense>
  );
}

function MenuItemsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(() => searchParams.get('add') === 'true');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  const refreshData = async () => {
    const [itemRes, catRes] = await Promise.all([
      supabase.from('menu_items').select('*, category:categories(*)').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setItems(itemRes.data ?? []);
    setCategories(catRes.data ?? []);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [itemRes, catRes] = await Promise.all([
        supabase.from('menu_items').select('*, category:categories(*)').order('sort_order'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);

      if (!isMounted) {
        return;
      }

      setItems(itemRes.data ?? []);
      setCategories(catRes.data ?? []);
      setLoading(false);
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      quantity: item.quantity,
      category_id: item.category_id,
      image_url: item.image_url || '',
      is_available: item.is_available,
      sort_order: item.sort_order,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.category_id) return;

    setSaving(true);
    try {
      const saveData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingId) {
        await supabase.from('menu_items').update(saveData).eq('id', editingId);
      } else {
        await supabase.from('menu_items').insert(saveData);
      }
      resetForm();
      await refreshData();
    } catch (err) {
      console.error('Error saving menu item:', err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    await refreshData();
  };

  const toggleAvailability = async (id: string, currentValue: boolean) => {
    await supabase.from('menu_items').update({ is_available: !currentValue }).eq('id', id);
    await refreshData();
  };

  const filteredItems = filterCategory === 'all'
    ? items
    : items.filter((item) => item.category_id === filterCategory);

  return (
    <div className={styles.page}>
      <Header title="Menu Items" showBack />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <h2 className={styles.heading}>All Items</h2>
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>
              <FiPlus size={16} /> Add
            </button>
          </div>

          {/* Category Filter */}
          <div className={styles.filterBar}>
            <select
              className={styles.filterSelect}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Form Modal */}
          {showForm && (
            <>
              <div className={styles.overlay} onClick={resetForm} />
              <div className={styles.formModal}>
                <div className={styles.formHeader}>
                  <h3>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                  <button className={styles.closeBtn} onClick={resetForm}>
                    <FiX size={18} />
                  </button>
                </div>
                <form onSubmit={handleSave} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Item Name *</label>
                    <input
                      className={styles.input}
                      placeholder="e.g. Chicken Biryani"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                      className={styles.input}
                      placeholder="Brief description of the item"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        className={styles.input}
                        placeholder="250"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Quantity/Portion</label>
                      <input
                        className={styles.input}
                        placeholder="e.g. 1 plate, 250ml"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Category *</label>
                    <select
                      className={styles.input}
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Image URL (optional)</label>
                    <input
                      className={styles.input}
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <label>Sort Order</label>
                      <input
                        type="number"
                        className={styles.input}
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Available</label>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={formData.is_available}
                          onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    <FiSave size={16} /> {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* List */}
          {loading ? (
            <div className={styles.loadingList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonItem}>
                  <div className={styles.skeletonLine} style={{ width: '70%' }} />
                  <div className={styles.skeletonLine} style={{ width: '50%' }} />
                  <div className={styles.skeletonLine} style={{ width: '30%' }} />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No menu items yet</p>
              <span>Add your first menu item to get started</span>
            </div>
          ) : (
            <div className={styles.list}>
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.listItem}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className={styles.itemLeft}>
                    {item.image_url && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                      </>
                    )}
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      {item.description && <p className={styles.itemDesc}>{item.description}</p>}
                      <div className={styles.itemMeta}>
                        <span className={styles.itemPrice}>₹{Number(item.price).toFixed(0)}</span>
                        <span className={styles.itemQty}>{item.quantity}</span>
                        {item.category && <span className={styles.itemCat}>{(item.category as Category).name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <label className="toggle" title="Toggle availability">
                      <input
                        type="checkbox"
                        checked={item.is_available}
                        onChange={() => toggleAvailability(item.id, item.is_available)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <button className={styles.editBtn} onClick={() => handleEdit(item)} title="Edit">
                      <FiEdit2 size={15} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Delete">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
