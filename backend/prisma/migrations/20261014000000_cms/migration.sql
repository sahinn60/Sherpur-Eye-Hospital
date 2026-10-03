-- CMS: key-value site settings
CREATE TABLE "site_settings" (
  "key"       TEXT NOT NULL PRIMARY KEY,
  "value"     TEXT NOT NULL DEFAULT '',
  "group"     TEXT NOT NULL DEFAULT 'general',
  "labelBn"   TEXT NOT NULL DEFAULT '',
  "labelEn"   TEXT NOT NULL DEFAULT '',
  "type"      TEXT NOT NULL DEFAULT 'text',   -- text | textarea | url | image
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CMS: homepage section visibility & order
CREATE TABLE "homepage_sections" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "key"       TEXT NOT NULL UNIQUE,
  "labelBn"   TEXT NOT NULL,
  "labelEn"   TEXT NOT NULL,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CMS: notices (scrolling ticker / notice board)
CREATE TABLE "notices" (
  "id"          TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "textBn"      TEXT NOT NULL,
  "textEn"      TEXT NOT NULL DEFAULT '',
  "link"        TEXT,
  "isActive"    BOOLEAN NOT NULL DEFAULT true,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "expiresAt"   TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed default site settings
INSERT INTO "site_settings" ("key","value","group","labelBn","labelEn","type") VALUES
  ('hospital_name_bn',    'শেরপুর আধুনিক চক্ষু হাসপাতাল',   'hospital', 'হাসপাতালের নাম (বাংলা)',   'Hospital Name (Bangla)',   'text'),
  ('hospital_name_en',    'Sherpur Adhunik Eye Hospital',      'hospital', 'হাসপাতালের নাম (ইংরেজি)', 'Hospital Name (English)', 'text'),
  ('tagline_bn',          'ও ফ্যাকো সেন্টার',                 'hospital', 'ট্যাগলাইন (বাংলা)',        'Tagline (Bangla)',         'text'),
  ('tagline_en',          '& Phaco Center',                    'hospital', 'ট্যাগলাইন (ইংরেজি)',       'Tagline (English)',        'text'),
  ('phone',               '+880 1700-000000',                  'contact',  'ফোন নম্বর',               'Phone Number',            'text'),
  ('emergency',           '+880 1800-000000',                  'contact',  'জরুরি নম্বর',             'Emergency Number',        'text'),
  ('email',               'info@sherpureyehospital.com',       'contact',  'ইমেইল',                   'Email',                   'text'),
  ('address_bn',          'শেরপুর সদর, শেরপুর-২১০০',          'contact',  'ঠিকানা (বাংলা)',           'Address (Bangla)',         'textarea'),
  ('address_en',          'Sherpur Sadar, Sherpur-2100',       'contact',  'ঠিকানা (ইংরেজি)',          'Address (English)',        'textarea'),
  ('map_embed_url',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.0!2d90.0!3d25.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDAwJzAwLjAiTiA5MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890', 'contact', 'ম্যাপ এম্বেড URL', 'Map Embed URL', 'url'),
  ('hours_bn',            'শনি–বৃহস্পতি: সকাল ৮টা – রাত ৮টা','hours',   'সময়সূচি (বাংলা)',          'Hours (Bangla)',           'text'),
  ('hours_en',            'Sat–Thu: 8:00 AM – 8:00 PM',       'hours',    'সময়সূচি (ইংরেজি)',         'Hours (English)',          'text'),
  ('friday_bn',           'শুক্রবার: সকাল ১০টা – দুপুর ১টা', 'hours',   'শুক্রবার সময় (বাংলা)',     'Friday Hours (Bangla)',    'text'),
  ('friday_en',           'Friday: 10:00 AM – 1:00 PM',       'hours',    'শুক্রবার সময় (ইংরেজি)',    'Friday Hours (English)',   'text'),
  ('social_facebook',     'https://facebook.com',              'social',   'ফেসবুক লিংক',             'Facebook Link',           'url'),
  ('social_youtube',      'https://youtube.com',               'social',   'ইউটিউব লিংক',             'YouTube Link',            'url'),
  ('social_instagram',    '',                                  'social',   'ইনস্টাগ্রাম লিংক',        'Instagram Link',          'url'),
  ('hero_badge_bn',       'শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র','hero',  'হিরো ব্যাজ (বাংলা)',       'Hero Badge (Bangla)',      'text'),
  ('hero_badge_en',       'Modern Eye Care Center in Sherpur', 'hero',     'হিরো ব্যাজ (ইংরেজি)',      'Hero Badge (English)',     'text'),
  ('hero_title_bn',       'আপনার দৃষ্টিশক্তি আমাদের দায়িত্ব', 'hero',   'হিরো শিরোনাম (বাংলা)',     'Hero Title (Bangla)',      'text'),
  ('hero_title_en',       'Your Vision, Our Responsibility',   'hero',     'হিরো শিরোনাম (ইংরেজি)',    'Hero Title (English)',     'text'),
  ('hero_desc_bn',        'শেরপুর আধুনিক চক্ষু হাসপাতালে আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের মাধ্যমে আপনার চোখের সর্বোত্তম যত্ন নিশ্চিত করি।', 'hero', 'হিরো বিবরণ (বাংলা)', 'Hero Description (Bangla)', 'textarea'),
  ('hero_desc_en',        'At Sherpur Adhunik Eye Hospital, we ensure the best care for your eyes through modern technology and experienced doctors.', 'hero', 'হিরো বিবরণ (ইংরেজি)', 'Hero Description (English)', 'textarea'),
  ('stat1_value_bn',      '১০+',          'stats', 'পরিসংখ্যান ১ মান (বাংলা)',   'Stat 1 Value (Bangla)',   'text'),
  ('stat1_value_en',      '10+',           'stats', 'পরিসংখ্যান ১ মান (ইংরেজি)', 'Stat 1 Value (English)',  'text'),
  ('stat1_label_bn',      'বছরের অভিজ্ঞতা','stats','পরিসংখ্যান ১ লেবেল (বাংলা)','Stat 1 Label (Bangla)',   'text'),
  ('stat1_label_en',      'Years Experience','stats','পরিসংখ্যান ১ লেবেল (ইংরেজি)','Stat 1 Label (English)', 'text'),
  ('stat2_value_bn',      '৫+',            'stats', 'পরিসংখ্যান ২ মান (বাংলা)',   'Stat 2 Value (Bangla)',   'text'),
  ('stat2_value_en',      '5+',            'stats', 'পরিসংখ্যান ২ মান (ইংরেজি)', 'Stat 2 Value (English)',  'text'),
  ('stat2_label_bn',      'বিশেষজ্ঞ চিকিৎসক','stats','পরিসংখ্যান ২ লেবেল (বাংলা)','Stat 2 Label (Bangla)', 'text'),
  ('stat2_label_en',      'Specialist Doctors','stats','পরিসংখ্যান ২ লেবেল (ইংরেজি)','Stat 2 Label (English)','text'),
  ('stat3_value_bn',      '৫০+',           'stats', 'পরিসংখ্যান ৩ মান (বাংলা)',   'Stat 3 Value (Bangla)',   'text'),
  ('stat3_value_en',      '50+',           'stats', 'পরিসংখ্যান ৩ মান (ইংরেজি)', 'Stat 3 Value (English)',  'text'),
  ('stat3_label_bn',      'চিকিৎসা সেবা', 'stats', 'পরিসংখ্যান ৩ লেবেল (বাংলা)','Stat 3 Label (Bangla)',   'text'),
  ('stat3_label_en',      'Medical Services','stats','পরিসংখ্যান ৩ লেবেল (ইংরেজি)','Stat 3 Label (English)', 'text'),
  ('stat4_value_bn',      '১০,০০০+',       'stats', 'পরিসংখ্যান ৪ মান (বাংলা)',   'Stat 4 Value (Bangla)',   'text'),
  ('stat4_value_en',      '10,000+',       'stats', 'পরিসংখ্যান ৪ মান (ইংরেজি)', 'Stat 4 Value (English)',  'text'),
  ('stat4_label_bn',      'সন্তুষ্ট রোগী', 'stats','পরিসংখ্যান ৪ লেবেল (বাংলা)','Stat 4 Label (Bangla)',   'text'),
  ('stat4_label_en',      'Happy Patients', 'stats','পরিসংখ্যান ৪ লেবেল (ইংরেজি)','Stat 4 Label (English)', 'text'),
  ('about_title_bn',      'আমাদের সম্পর্কে',                  'about',    'সম্পর্কে শিরোনাম (বাংলা)', 'About Title (Bangla)',     'text'),
  ('about_title_en',      'About Us',                          'about',    'সম্পর্কে শিরোনাম (ইংরেজি)','About Title (English)',    'text'),
  ('about_desc_bn',       'শেরপুর আধুনিক চক্ষু হাসপাতাল শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি আধুনিক চক্ষু হাসপাতাল। আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের মাধ্যমে সাশ্রয়ী মূল্যে সর্বোচ্চ মানের চক্ষু সেবা প্রদান করে আসছি।', 'about', 'সম্পর্কে বিবরণ (বাংলা)', 'About Description (Bangla)', 'textarea'),
  ('about_desc_en',       'Sherpur Adhunik Eye Hospital is a modern eye hospital dedicated to eye care for the people of Sherpur district. We provide the highest quality eye care at affordable prices through modern technology and experienced doctors.', 'about', 'সম্পর্কে বিবরণ (ইংরেজি)', 'About Description (English)', 'textarea'),
  ('about_mission_bn',    'সাশ্রয়ী মূল্যে সর্বোচ্চ মানের চক্ষু সেবা প্রদান করা।', 'about', 'মিশন (বাংলা)', 'Mission (Bangla)', 'textarea'),
  ('about_mission_en',    'To provide the highest quality eye care at affordable prices.', 'about', 'মিশন (ইংরেজি)', 'Mission (English)', 'textarea'),
  ('about_vision_bn',     'শেরপুর জেলায় অন্ধত্বমুক্ত সমাজ গড়ে তোলা।', 'about', 'ভিশন (বাংলা)', 'Vision (Bangla)', 'textarea'),
  ('about_vision_en',     'To build a blindness-free society in Sherpur district.', 'about', 'ভিশন (ইংরেজি)', 'Vision (English)', 'textarea');

-- Seed default homepage sections
INSERT INTO "homepage_sections" ("id","key","labelBn","labelEn","isVisible","sortOrder") VALUES
  ('sec_hero',         'hero',         'হিরো সেকশন',          'Hero Section',          true,  1),
  ('sec_intro',        'intro',        'পরিচিতি সেকশন',       'Intro Section',         true,  2),
  ('sec_services',     'services',     'সেবা সেকশন',          'Services Section',      true,  3),
  ('sec_phaco',        'phaco',        'ফ্যাকো ব্যানার',       'Phaco Banner',          true,  4),
  ('sec_why',          'why',          'কেন আমরা সেকশন',      'Why Choose Section',    true,  5),
  ('sec_stats',        'stats',        'পরিসংখ্যান সেকশন',    'Stats Section',         true,  6),
  ('sec_doctors',      'doctors',      'চিকিৎসক সেকশন',       'Doctors Section',       true,  7),
  ('sec_facilities',   'facilities',   'সুবিধা সেকশন',        'Facilities Section',    true,  8),
  ('sec_care',         'care',         'সেবা প্রক্রিয়া',      'Care Process Section',  true,  9),
  ('sec_testimonials', 'testimonials', 'প্রশংসাপত্র সেকশন',   'Testimonials Section',  true,  10),
  ('sec_articles',     'articles',     'আর্টিকেল সেকশন',      'Articles Section',      true,  11),
  ('sec_gallery',      'gallery',      'গ্যালারি সেকশন',      'Gallery Section',       true,  12),
  ('sec_contact_cta',  'contact_cta',  'যোগাযোগ CTA',         'Contact CTA',           true,  13),
  ('sec_map',          'map',          'ম্যাপ সেকশন',         'Map Section',           true,  14),
  ('sec_notices',      'notices',      'নোটিশ টিকার',         'Notice Ticker',         true,  0);
