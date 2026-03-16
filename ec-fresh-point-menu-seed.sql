-- =============================================
-- EC Fresh Point — Menu Seed
-- Run this in your Supabase SQL Editor.
-- Clears ALL existing categories & items first,
-- then inserts the full EC Fresh Point menu.
-- =============================================

-- ---- 1. Clear existing data (cascade deletes menu_items too) ----
DELETE FROM menu_items;
DELETE FROM categories;

-- ---- 2. Insert categories ----
INSERT INTO categories (id, name, description, sort_order, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Juice',   'Fresh-pressed fruit and vegetable juices', 1, true),
  ('11111111-0000-0000-0000-000000000002', 'Tea',     'Hot brewed teas with natural spices',      2, true),
  ('11111111-0000-0000-0000-000000000003', 'Shake',   'Thick and creamy ice-cream shakes',        3, true),
  ('11111111-0000-0000-0000-000000000004', 'Coffee',  'Rich and aromatic hot coffees',            4, true),
  ('11111111-0000-0000-0000-000000000005', 'Snacks',  'Fresh bites and quick eats',               5, true);

-- ---- 3. Insert menu items ----

-- JUICE
INSERT INTO menu_items (category_id, name, price, quantity, sort_order, is_available) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Orange Juice',        60,  '300 ml', 1,  true),
  ('11111111-0000-0000-0000-000000000001', 'Mango Juice',         60,  '300 ml', 2,  true),
  ('11111111-0000-0000-0000-000000000001', 'Apple Juice',         80,  '300 ml', 3,  true),
  ('11111111-0000-0000-0000-000000000001', 'Watermelon Juice',    50,  '300 ml', 4,  true),
  ('11111111-0000-0000-0000-000000000001', 'Grape Juice',         60,  '300 ml', 5,  true),
  ('11111111-0000-0000-0000-000000000001', 'Papaya Juice',        60,  '300 ml', 6,  true),
  ('11111111-0000-0000-0000-000000000001', 'Moosambi Juice',      60,  '300 ml', 7,  true),
  ('11111111-0000-0000-0000-000000000001', 'Shammam Milk',        60,  '300 ml', 8,  true),
  ('11111111-0000-0000-0000-000000000001', 'Pineapple Juice',     60,  '300 ml', 9,  true),
  ('11111111-0000-0000-0000-000000000001', 'Avocado Juice',       100, '300 ml', 10, true),
  ('11111111-0000-0000-0000-000000000001', 'Pomegranate Juice',   80,  '300 ml', 11, true),
  ('11111111-0000-0000-0000-000000000001', 'ABC Juice',           80,  '300 ml', 12, true),
  ('11111111-0000-0000-0000-000000000001', 'Carrot Juice',        60,  '300 ml', 13, true),
  ('11111111-0000-0000-0000-000000000001', 'Beetroot Juice',      60,  '300 ml', 14, true);

-- TEA
INSERT INTO menu_items (category_id, name, price, quantity, sort_order, is_available) VALUES
  ('11111111-0000-0000-0000-000000000002', 'Tea',              15, '150 ml', 1, true),
  ('11111111-0000-0000-0000-000000000002', 'Elaichi Tea',      20, '150 ml', 2, true),
  ('11111111-0000-0000-0000-000000000002', 'Masala Tea',       20, '150 ml', 3, true),
  ('11111111-0000-0000-0000-000000000002', 'Ginger Tea',       20, '150 ml', 4, true),
  ('11111111-0000-0000-0000-000000000002', 'Cinnamon Tea',     20, '150 ml', 5, true),
  ('11111111-0000-0000-0000-000000000002', 'Ginger Lemon Tea', 20, '150 ml', 6, true),
  ('11111111-0000-0000-0000-000000000002', 'Lemon Tea',        20, '150 ml', 7, true),
  ('11111111-0000-0000-0000-000000000002', 'Black Tea',        15, '150 ml', 8, true);

-- SHAKE
INSERT INTO menu_items (category_id, name, price, quantity, sort_order, is_available) VALUES
  ('11111111-0000-0000-0000-000000000003', 'Chocolate Shake',       110, '350 ml', 1,  true),
  ('11111111-0000-0000-0000-000000000003', 'Strawberry Shake',      100, '350 ml', 2,  true),
  ('11111111-0000-0000-0000-000000000003', 'Butter Scotch Shake',   100, '350 ml', 3,  true),
  ('11111111-0000-0000-0000-000000000003', 'Pista Shake',           100, '350 ml', 4,  true),
  ('11111111-0000-0000-0000-000000000003', 'Mango Pista Shake',     100, '350 ml', 5,  true),
  ('11111111-0000-0000-0000-000000000003', 'Shammam Shake',         100, '350 ml', 6,  true),
  ('11111111-0000-0000-0000-000000000003', 'Sharja Shake',          100, '350 ml', 7,  true),
  ('11111111-0000-0000-0000-000000000003', 'Papaya Shake',          100, '350 ml', 8,  true),
  ('11111111-0000-0000-0000-000000000003', 'Tender Coconut Shake',  100, '350 ml', 9,  true),
  ('11111111-0000-0000-0000-000000000003', 'Blue Berry Shake',      100, '350 ml', 10, true),
  ('11111111-0000-0000-0000-000000000003', 'Vanilla Shake',         100, '350 ml', 11, true),
  ('11111111-0000-0000-0000-000000000003', 'Blackcurrant Shake',    100, '350 ml', 12, true),
  ('11111111-0000-0000-0000-000000000003', 'Avocado Shake',         120, '350 ml', 13, true),
  ('11111111-0000-0000-0000-000000000003', 'Oreo Shake',            100, '350 ml', 14, true),
  ('11111111-0000-0000-0000-000000000003', 'Kit Kat Shake',         100, '350 ml', 15, true),
  ('11111111-0000-0000-0000-000000000003', 'Dark Fantasy Shake',    100, '350 ml', 16, true);

-- COFFEE
INSERT INTO menu_items (category_id, name, price, quantity, sort_order, is_available) VALUES
  ('11111111-0000-0000-0000-000000000004', 'Black Coffee', 15, '150 ml', 1, true),
  ('11111111-0000-0000-0000-000000000004', 'Bru Coffee',   20, '150 ml', 2, true),
  ('11111111-0000-0000-0000-000000000004', 'Nescafe',      20, '150 ml', 3, true);

-- SNACKS (prices not specified — defaulting to 0, update via admin dashboard)
INSERT INTO menu_items (category_id, name, description, price, quantity, sort_order, is_available) VALUES
  ('11111111-0000-0000-0000-000000000005', 'Egg Salad',         'Fresh egg salad with crisp vegetables',       0, '1 plate', 1, true),
  ('11111111-0000-0000-0000-000000000005', 'Chicken Salad',     'Grilled chicken tossed with fresh greens',    0, '1 plate', 2, true),
  ('11111111-0000-0000-0000-000000000005', 'Egg Roll',          'Spiced egg wrapped in a soft roti',           0, '1 piece', 3, true),
  ('11111111-0000-0000-0000-000000000005', 'Chicken Roll',      'Tender chicken wrapped in a soft roti',       0, '1 piece', 4, true),
  ('11111111-0000-0000-0000-000000000005', 'Cheese Garlic Bread','Crispy bread with garlic butter and cheese', 0, '1 plate', 5, true),
  ('11111111-0000-0000-0000-000000000005', 'Bread Pizza',       'Toasted bread topped with pizza sauce',       0, '1 plate', 6, true),
  ('11111111-0000-0000-0000-000000000005', 'Vegetable Noodles', 'Stir-fried noodles with fresh vegetables',   0, '1 plate', 7, true),
  ('11111111-0000-0000-0000-000000000005', 'Egg Noodles',       'Stir-fried noodles with scrambled egg',       0, '1 plate', 8, true),
  ('11111111-0000-0000-0000-000000000005', 'Chicken Noodles',   'Stir-fried noodles with tender chicken',      0, '1 plate', 9, true);

-- =============================================
-- Done! 5 categories, 50 menu items inserted.
-- NOTE: Update snack prices via the admin
--       dashboard at /admin/menu-items
-- =============================================
