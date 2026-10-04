-- Add logo and hero image settings
INSERT INTO "site_settings" ("key","value","group","labelBn","labelEn","type") VALUES
  ('logo_url',        '', 'hospital', 'হাসপাতাল লোগো',          'Hospital Logo',          'image'),
  ('hero_image_url',  '', 'hero',     'হিরো ব্যাকগ্রাউন্ড ছবি', 'Hero Background Image',  'image')
ON CONFLICT ("key") DO NOTHING;
