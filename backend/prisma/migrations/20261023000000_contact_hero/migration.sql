INSERT INTO site_settings (key, value, "group", "labelBn", "labelEn", type, "updatedAt")
VALUES ('hero_contact_image', '', 'page_heroes', 'যোগাযোগ পেজ হিরো ছবি', 'Contact Page Hero Image', 'image', NOW())
ON CONFLICT (key) DO NOTHING;
