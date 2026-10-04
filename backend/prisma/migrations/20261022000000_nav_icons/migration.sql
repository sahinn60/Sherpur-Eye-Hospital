INSERT INTO site_settings (key, value, "group", "labelBn", "labelEn", type, "updatedAt") VALUES
('nav_icon_home',        '', 'nav_icons', 'হোম পেজ আইকন',            'Home Icon',        'image', NOW()),
('nav_icon_about',       '', 'nav_icons', 'আমাদের সম্পর্কে আইকন',   'About Icon',       'image', NOW()),
('nav_icon_doctors',     '', 'nav_icons', 'ডাক্তার পেজ আইকন',        'Doctors Icon',     'image', NOW()),
('nav_icon_services',    '', 'nav_icons', 'সেবাসমূহ পেজ আইকন',       'Services Icon',    'image', NOW()),
('nav_icon_appointment', '', 'nav_icons', 'অ্যাপয়েন্টমেন্ট আইকন',  'Appointment Icon', 'image', NOW()),
('nav_icon_gallery',     '', 'nav_icons', 'গ্যালারি পেজ আইকন',       'Gallery Icon',     'image', NOW()),
('nav_icon_news',        '', 'nav_icons', 'সংবাদ পেজ আইকন',          'News Icon',        'image', NOW()),
('nav_icon_contact',     '', 'nav_icons', 'যোগাযোগ পেজ আইকন',        'Contact Icon',     'image', NOW())
ON CONFLICT (key) DO NOTHING;
