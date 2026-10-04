INSERT INTO "site_settings" ("key","value","group","labelBn","labelEn","type") VALUES
  ('about_founded_bn',  'প্রতিষ্ঠাকাল: [সাল]',        'about', 'প্রতিষ্ঠাকাল (বাংলা)',   'Founded (Bangla)',   'text'),
  ('about_founded_en',  'Established: [Year]',          'about', 'প্রতিষ্ঠাকাল (ইংরেজি)', 'Founded (English)', 'text'),
  ('about_location_bn', 'শেরপুর সদর, শেরপুর',          'about', 'অবস্থান (বাংলা)',        'Location (Bangla)', 'text'),
  ('about_location_en', 'Sherpur Sadar, Sherpur',       'about', 'অবস্থান (ইংরেজি)',       'Location (English)','text'),
  ('about_tag_bn',      'আমাদের পরিচয়',                'about', 'ট্যাগ (বাংলা)',           'Tag (Bangla)',       'text'),
  ('about_tag_en',      'Who We Are',                   'about', 'ট্যাগ (ইংরেজি)',          'Tag (English)',      'text'),
  ('about_intro_title_bn', 'শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার', 'about', 'পরিচিতি শিরোনাম (বাংলা)', 'Intro Title (Bangla)', 'text'),
  ('about_intro_title_en', 'Sherpur Adhunik Eye Hospital & Phaco Center',      'about', 'পরিচিতি শিরোনাম (ইংরেজি)','Intro Title (English)','text'),
  ('about_para1_bn',    'শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি বিশেষায়িত চিকিৎসা প্রতিষ্ঠান।', 'about', 'অনুচ্ছেদ ১ (বাংলা)', 'Paragraph 1 (Bangla)', 'textarea'),
  ('about_para1_en',    'Sherpur Adhunik Eye Hospital & Phaco Center is a specialized medical institution dedicated to eye care for the people of Sherpur district.', 'about', 'অনুচ্ছেদ ১ (ইংরেজি)', 'Paragraph 1 (English)', 'textarea'),
  ('about_para2_bn',    'আমাদের হাসপাতালে অভিজ্ঞ চক্ষু বিশেষজ্ঞ চিকিৎসক দল, আধুনিক ডায়াগনস্টিক যন্ত্রপাতি এবং সর্বোচ্চ মানের চিকিৎসা সেবা নিশ্চিত করা হয়।', 'about', 'অনুচ্ছেদ ২ (বাংলা)', 'Paragraph 2 (Bangla)', 'textarea'),
  ('about_para2_en',    'Our hospital ensures an experienced team of eye specialists, modern diagnostic equipment, and the highest quality medical care.', 'about', 'অনুচ্ছেদ ২ (ইংরেজি)', 'Paragraph 2 (English)', 'textarea')
ON CONFLICT ("key") DO NOTHING;
