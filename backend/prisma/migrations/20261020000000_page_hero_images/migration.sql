INSERT INTO site_settings (key, value, "group", "labelBn", "labelEn", type, "updatedAt") VALUES
('hero_about_image',       '', 'page_heroes', 'আমাদের সম্পর্কে পেজ হিরো ছবি',  'About Page Hero Image',       'image', NOW()),
('hero_appointment_image', '', 'page_heroes', 'অ্যাপয়েন্টমেন্ট পেজ হিরো ছবি', 'Appointment Page Hero Image', 'image', NOW()),
('hero_doctors_image',     '', 'page_heroes', 'চিকিৎসক পেজ হিরো ছবি',          'Doctors Page Hero Image',     'image', NOW()),
('hero_gallery_image',     '', 'page_heroes', 'গ্যালারি পেজ হিরো ছবি',          'Gallery Page Hero Image',     'image', NOW()),
('hero_services_image',    '', 'page_heroes', 'সেবাসমূহ পেজ হিরো ছবি',         'Services Page Hero Image',    'image', NOW()),
('hero_news_image',        '', 'page_heroes', 'সংবাদ পেজ হিরো ছবি',            'News Page Hero Image',        'image', NOW())
ON CONFLICT (key) DO NOTHING;
