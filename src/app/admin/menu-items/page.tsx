'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, Category, MenuItem } from '@/lib/supabase';
import Header from '../../components/Header';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUpload, FiImage } from 'react-icons/fi';
import styles from './menuitems.module.css';

const PAGE_SIZE = 10;

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

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_DIM = 800;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Image compression failed'));
        },
        'image/jpeg',
        0.7,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

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
  const [currentPage, setCurrentPage] = useState(1);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    setImagePreview(item.image_url || null);
    setUploadError(null);
    setShowForm(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be 5 MB or smaller.');
      e.target.value = '';
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const path = `items/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error: storageError } = await supabase.storage
        .from('menu-images')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: false });
      if (storageError) {
        setUploadError('Upload failed: ' + storageError.message);
        return;
      }
      const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(path);
      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      setImagePreview(urlData.publicUrl);
    } catch (err) {
      setUploadError('Image processing failed. Please try another image.');
      console.error(err);
    } finally {
      setUploading(false);
    }
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

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
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
                    <label>Item Image (optional)</label>
                    <div className={styles.uploadArea}>
                      {imagePreview ? (
                        <div className={styles.previewWrap}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePreview} alt="Preview" className={styles.previewImg} />
                          <button
                            type="button"
                            className={styles.removeImgBtn}
                            onClick={() => {
                              setImagePreview(null);
                              setFormData((prev) => ({ ...prev, image_url: '' }));
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.uploadBtn}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <span className={styles.uploadingText}>Compressing & uploading…</span>
                          ) : (
                            <>
                              <FiUpload size={18} />
                              <span>Upload Image</span>
                              <span className={styles.uploadHint}>Max 5 MB · JPEG / PNG / WebP</span>
                            </>
                          )}
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleImageSelect}
                        disabled={uploading}
                      />
                    </div>
                    {uploadError && <span className={styles.uploadError}>{uploadError}</span>}
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
                  <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
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
            <>
              <div className={styles.list}>
                {paginatedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={styles.listItem}
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className={styles.itemLeft}>
                      {item.image_url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                        </>
                      ) : (
                        <div className={styles.itemImageFallback}>
                          <FiImage size={18} />
                        </div>
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
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  <span className={styles.pageInfo}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
