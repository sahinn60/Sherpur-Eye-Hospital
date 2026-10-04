-- About page image settings
INSERT INTO "site_settings" ("key","value","group","labelBn","labelEn","type") VALUES
  ('about_main_image',   '', 'about', 'হাসপাতালের মূল ছবি',        'Hospital Main Image',     'image'),
  ('about_env_image_1',  '', 'about', 'পরিবেশ ছবি ১ (পরিষ্কার)',   'Environment Image 1',     'image'),
  ('about_env_image_2',  '', 'about', 'পরিবেশ ছবি ২ (শীতাতপ)',     'Environment Image 2',     'image'),
  ('about_env_image_3',  '', 'about', 'পরিবেশ ছবি ৩ (সুবিধা)',     'Environment Image 3',     'image'),
  ('about_env_image_4',  '', 'about', 'পরিবেশ ছবি ৪ (নিরাপদ)',     'Environment Image 4',     'image'),
  ('about_gallery_1',    '', 'about', 'গ্যালারি ছবি ১ (প্রবেশদ্বার)', 'Gallery Image 1 (Entrance)', 'image'),
  ('about_gallery_2',    '', 'about', 'গ্যালারি ছবি ২ (OT)',        'Gallery Image 2 (OT)',    'image'),
  ('about_gallery_3',    '', 'about', 'গ্যালারি ছবি ৩ (ডায়াগনস্টিক)', 'Gallery Image 3 (Diagnostic)', 'image'),
  ('about_gallery_4',    '', 'about', 'গ্যালারি ছবি ৪ (ওয়েটিং)',   'Gallery Image 4 (Waiting)', 'image'),
  ('about_gallery_5',    '', 'about', 'গ্যালারি ছবি ৫ (কনসালটেশন)', 'Gallery Image 5 (Consultation)', 'image'),
  ('about_gallery_6',    '', 'about', 'গ্যালারি ছবি ৬ (ফার্মেসি)',  'Gallery Image 6 (Pharmacy)', 'image')
ON CONFLICT ("key") DO NOTHING;
