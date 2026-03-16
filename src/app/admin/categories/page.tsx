'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, Category } from '@/lib/supabase';
import Header from '../../components/Header';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import styles from './categories.module.css';

export default function CategoriesPageWrapper() {
  return (
    <Suspense>
      <CategoriesPage />
    </Suspense>
  );
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
    }
  }, [router, searchParams]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData({ name: '', description: '', sort_order: 0, is_active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      description: cat.description || '',
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await supabase.from('categories').update(formData).eq('id', editingId);
      } else {
        await supabase.from('categories').insert(formData);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated menu items will also be deleted.')) return;

    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    await supabase.from('categories').update({ is_active: !currentValue }).eq('id', id);
    fetchCategories();
  };

  return (
    <div className={styles.page}>
      <Header title="Categories" showBack />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <h2 className={styles.heading}>All Categories</h2>
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>
              <FiPlus size={16} /> Add
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <>
              <div className={styles.overlay} onClick={resetForm} />
              <div className={styles.formModal}>
                <div className={styles.formHeader}>
                  <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
                  <button className={styles.closeBtn} onClick={resetForm}>
                    <FiX size={18} />
                  </button>
                </div>
                <form onSubmit={handleSave} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Category Name</label>
                    <input
                      className={styles.input}
                      placeholder="e.g. Starters, Main Course"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Description (optional)</label>
                    <textarea
                      className={styles.input}
                      placeholder="Brief description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      <label>Active</label>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  <div className={styles.skeletonLine} style={{ width: '40%' }} />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No categories yet</p>
              <span>Add your first category to get started</span>
            </div>
          ) : (
            <div className={styles.list}>
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className={styles.listItem}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <h4 className={styles.itemName}>{cat.name}</h4>
                      <span className={`badge ${cat.is_active ? 'badge-green' : 'badge-red'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {cat.description && <p className={styles.itemDesc}>{cat.description}</p>}
                    <span className={styles.itemMeta}>Sort: {cat.sort_order}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <label className="toggle" title="Toggle active">
                      <input
                        type="checkbox"
                        checked={cat.is_active}
                        onChange={() => toggleActive(cat.id, cat.is_active)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <button className={styles.editBtn} onClick={() => handleEdit(cat)} title="Edit">
                      <FiEdit2 size={15} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id)} title="Delete">
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
