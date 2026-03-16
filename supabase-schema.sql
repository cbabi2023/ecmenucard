-- EC Menu Card - Supabase Schema
-- Run this SQL in your Supabase SQL Editor

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity VARCHAR(100) DEFAULT '1 piece',
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access for customers
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on menu_items"
  ON menu_items FOR SELECT
  USING (true);

-- Allow full access for authenticated/service role (admin)
CREATE POLICY "Allow full access for service role on categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access for service role on menu_items"
  ON menu_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
CREATE INDEX idx_menu_items_sort ON menu_items(sort_order);

-- =============================================
-- Storage bucket for menu item images
-- Run AFTER the tables above.
-- =============================================

-- Create the public bucket (skip if it already exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880,  -- 5 MB hard limit at storage layer
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read images (public CDN)
CREATE POLICY "Public read access on menu-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

-- Allow insert / update / delete via anon key (admin panel uses anon key)
CREATE POLICY "Anon upload to menu-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Anon update menu-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-images');

CREATE POLICY "Anon delete menu-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-images');
