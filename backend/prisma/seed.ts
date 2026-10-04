import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Super Admin ──────────────────────────────────────────────────────────
  const password = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@sherpureyehospital.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@sherpureyehospital.com",
      password,
      role: "SUPER_ADMIN",
    },
  });

  // ── Seed Permissions ─────────────────────────────────────────────────────
  const permissions = [
    { key: "dashboard.view",       labelBn: "ড্যাশবোর্ড দেখুন",         labelEn: "View Dashboard",         group: "dashboard" },
    { key: "appointments.view",    labelBn: "অ্যাপয়েন্টমেন্ট দেখুন",   labelEn: "View Appointments",      group: "appointments" },
    { key: "appointments.manage",  labelBn: "অ্যাপয়েন্টমেন্ট পরিচালনা", labelEn: "Manage Appointments",   group: "appointments" },
    { key: "doctors.view",         labelBn: "চিকিৎসক দেখুন",            labelEn: "View Doctors",           group: "doctors" },
    { key: "doctors.manage",       labelBn: "চিকিৎসক পরিচালনা",         labelEn: "Manage Doctors",         group: "doctors" },
    { key: "services.view",        labelBn: "সেবা দেখুন",               labelEn: "View Services",          group: "services" },
    { key: "services.manage",      labelBn: "সেবা পরিচালনা",            labelEn: "Manage Services",        group: "services" },
    { key: "gallery.view",         labelBn: "গ্যালারি দেখুন",           labelEn: "View Gallery",           group: "gallery" },
    { key: "gallery.manage",       labelBn: "গ্যালারি পরিচালনা",        labelEn: "Manage Gallery",         group: "gallery" },
    { key: "news.view",            labelBn: "সংবাদ দেখুন",              labelEn: "View News",              group: "news" },
    { key: "news.manage",          labelBn: "সংবাদ পরিচালনা",           labelEn: "Manage News",            group: "news" },
    { key: "users.view",           labelBn: "ব্যবহারকারী দেখুন",        labelEn: "View Users",             group: "users" },
    { key: "users.manage",         labelBn: "ব্যবহারকারী পরিচালনা",     labelEn: "Manage Users",           group: "users" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: { id: `perm-${perm.key.replace(".", "-")}`, ...perm },
    });
  }

  // ── Doctors ──────────────────────────────────────────────────────────────
  const d1 = await prisma.doctor.upsert({
    where: { id: "seed-doctor-1" },
    update: {},
    create: {
      id: "seed-doctor-1",
      nameBn: "ডা. [চিকিৎসকের নাম]",
      nameEn: "Dr. [Doctor Name]",
      designationBn: "চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন",
      designationEn: "Eye Specialist & Phaco Surgeon",
      qualificationBn: "এমবিবিএস, ডিও, এমএস (চক্ষু)",
      qualificationEn: "MBBS, DO, MS (Ophthalmology)",
      specialtyBn: "ফ্যাকো ক্যাটারেক্ট সার্জারি",
      specialtyEn: "Phaco Cataract Surgery",
      experienceBn: "১০+ বছরের অভিজ্ঞতা",
      experienceEn: "10+ years of experience",
      biographyBn: "ডা. [নাম] একজন অভিজ্ঞ চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন। [এই তথ্য আপডেট করুন]",
      biographyEn: "Dr. [Name] is an experienced eye specialist and phaco surgeon. [Update this information]",
      schedule: [
        { dayBn: "শনি – বৃহস্পতি", dayEn: "Sat – Thu", timeBn: "সকাল ৯টা – দুপুর ১টা", timeEn: "9:00 AM – 1:00 PM" },
        { dayBn: "শনি – বৃহস্পতি", dayEn: "Sat – Thu", timeBn: "বিকাল ৫টা – রাত ৮টা", timeEn: "5:00 PM – 8:00 PM" },
      ],
      sortOrder: 1,
    },
  });

  const d2 = await prisma.doctor.upsert({
    where: { id: "seed-doctor-2" },
    update: {},
    create: {
      id: "seed-doctor-2",
      nameBn: "ডা. [চিকিৎসকের নাম]",
      nameEn: "Dr. [Doctor Name]",
      designationBn: "চক্ষু বিশেষজ্ঞ",
      designationEn: "Eye Specialist",
      qualificationBn: "এমবিবিএস, ডিও",
      qualificationEn: "MBBS, DO",
      specialtyBn: "রেটিনা ও গ্লুকোমা",
      specialtyEn: "Retina & Glaucoma",
      experienceBn: "৫+ বছরের অভিজ্ঞতা",
      experienceEn: "5+ years of experience",
      biographyBn: "ডা. [নাম] রেটিনা ও গ্লুকোমা চিকিৎসায় বিশেষজ্ঞ। [এই তথ্য আপডেট করুন]",
      biographyEn: "Dr. [Name] specializes in retina and glaucoma treatment. [Update this information]",
      schedule: [
        { dayBn: "রবি – বৃহস্পতি", dayEn: "Sun – Thu", timeBn: "সকাল ১০টা – দুপুর ২টা", timeEn: "10:00 AM – 2:00 PM" },
      ],
      sortOrder: 2,
    },
  });

  const d3 = await prisma.doctor.upsert({
    where: { id: "seed-doctor-3" },
    update: {},
    create: {
      id: "seed-doctor-3",
      nameBn: "ডা. [চিকিৎসকের নাম]",
      nameEn: "Dr. [Doctor Name]",
      designationBn: "শিশু চক্ষু বিশেষজ্ঞ",
      designationEn: "Pediatric Eye Specialist",
      qualificationBn: "এমবিবিএস, ডিও",
      qualificationEn: "MBBS, DO",
      specialtyBn: "শিশু চক্ষু চিকিৎসা",
      specialtyEn: "Pediatric Ophthalmology",
      experienceBn: "৭+ বছরের অভিজ্ঞতা",
      experienceEn: "7+ years of experience",
      biographyBn: "ডা. [নাম] শিশুদের চোখের সমস্যা নির্ণয় ও চিকিৎসায় বিশেষজ্ঞ। [এই তথ্য আপডেট করুন]",
      biographyEn: "Dr. [Name] specializes in diagnosing and treating eye problems in children. [Update this information]",
      schedule: [
        { dayBn: "শনি, সোম, বুধ", dayEn: "Sat, Mon, Wed", timeBn: "সকাল ৯টা – দুপুর ১২টা", timeEn: "9:00 AM – 12:00 PM" },
      ],
      sortOrder: 3,
    },
  });

  // ── Services ─────────────────────────────────────────────────────────────
  const services = [
    {
      id: "seed-service-1",
      category: "PHACO" as const,
      nameBn: "ফ্যাকো ক্যাটারেক্ট সার্জারি",
      nameEn: "Phaco Cataract Surgery",
      shortDescBn: "আধুনিক ফ্যাকোইমালসিফিকেশন পদ্ধতিতে ব্যথামুক্ত ছানি অপারেশন।",
      shortDescEn: "Painless cataract removal using modern phacoemulsification technique.",
      fullDescBn: "ফ্যাকোইমালসিফিকেশন হলো ছানি অপারেশনের সবচেয়ে আধুনিক পদ্ধতি। এই পদ্ধতিতে অতি ক্ষুদ্র ছিদ্রের মাধ্যমে আল্ট্রাসাউন্ড তরঙ্গ ব্যবহার করে ছানি ভেঙে বের করা হয় এবং কৃত্রিম লেন্স স্থাপন করা হয়। অপারেশনটি মাত্র ১৫-২০ মিনিটে সম্পন্ন হয়, সম্পূর্ণ ব্যথামুক্ত এবং দ্রুত সুস্থতা নিশ্চিত করে। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "Phacoemulsification is the most modern method of cataract surgery. In this method, ultrasound waves are used through a tiny incision to break up and remove the cataract, and an artificial lens is implanted. The surgery is completed in just 15-20 minutes, is completely painless, and ensures fast recovery. [Update detailed information]",
      icon: "👁️",
      doctorId: d1.id,
      sortOrder: 1,
    },
    {
      id: "seed-service-2",
      category: "CATARACT" as const,
      nameBn: "ক্যাটারেক্ট (ছানি) চিকিৎসা",
      nameEn: "Cataract Treatment",
      shortDescBn: "চোখের ছানি নির্ণয় ও সম্পূর্ণ চিকিৎসা সেবা।",
      shortDescEn: "Complete diagnosis and treatment of eye cataracts.",
      fullDescBn: "ছানি হলো চোখের লেন্সের ঘোলাটে হয়ে যাওয়া, যা দৃষ্টিশক্তি কমিয়ে দেয়। আমাদের হাসপাতালে আধুনিক যন্ত্রপাতি দিয়ে ছানি নির্ণয় করা হয় এবং রোগীর অবস্থা অনুযায়ী সর্বোত্তম চিকিৎসা পদ্ধতি নির্বাচন করা হয়। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "Cataract is the clouding of the eye's lens, which reduces vision. At our hospital, cataracts are diagnosed with modern equipment and the best treatment method is selected according to the patient's condition. [Update detailed information]",
      icon: "🔍",
      doctorId: d1.id,
      sortOrder: 2,
    },
    {
      id: "seed-service-3",
      category: "RETINA" as const,
      nameBn: "রেটিনা চিকিৎসা",
      nameEn: "Retina Treatment",
      shortDescBn: "রেটিনার জটিল রোগের আধুনিক চিকিৎসা ও লেজার থেরাপি।",
      shortDescEn: "Advanced treatment for retinal diseases and laser therapy.",
      fullDescBn: "রেটিনা চোখের সবচেয়ে গুরুত্বপূর্ণ অংশ যা আলো গ্রহণ করে মস্তিষ্কে পাঠায়। রেটিনার বিভিন্ন রোগ যেমন রেটিনাল ডিটাচমেন্ট, ম্যাকুলার ডিজেনারেশন ইত্যাদির আধুনিক চিকিৎসা আমাদের হাসপাতালে পাওয়া যায়। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "The retina is the most important part of the eye that receives light and sends it to the brain. Modern treatment for various retinal diseases such as retinal detachment, macular degeneration, etc. is available at our hospital. [Update detailed information]",
      icon: "🔬",
      doctorId: d2.id,
      sortOrder: 3,
    },
    {
      id: "seed-service-4",
      category: "GLAUCOMA" as const,
      nameBn: "গ্লুকোমা চিকিৎসা",
      nameEn: "Glaucoma Treatment",
      shortDescBn: "চোখের চাপ পরীক্ষা ও গ্লুকোমার সম্পূর্ণ ব্যবস্থাপনা।",
      shortDescEn: "Eye pressure testing and complete glaucoma management.",
      fullDescBn: "গ্লুকোমা একটি নীরব দৃষ্টিনাশক রোগ যা প্রায়ই কোনো লক্ষণ ছাড়াই দৃষ্টিশক্তি নষ্ট করে দেয়। নিয়মিত চোখের চাপ পরীক্ষা এবং সময়মতো চিকিৎসার মাধ্যমে গ্লুকোমা নিয়ন্ত্রণ করা সম্ভব। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "Glaucoma is a silent vision-destroying disease that often destroys vision without any symptoms. Glaucoma can be controlled through regular eye pressure testing and timely treatment. [Update detailed information]",
      icon: "💧",
      doctorId: d2.id,
      sortOrder: 4,
    },
    {
      id: "seed-service-5",
      category: "PEDIATRIC" as const,
      nameBn: "শিশু চক্ষু চিকিৎসা",
      nameEn: "Pediatric Eye Care",
      shortDescBn: "শিশুদের চোখের সমস্যার বিশেষজ্ঞ চিকিৎসা ও যত্ন।",
      shortDescEn: "Specialist treatment and care for children's eye problems.",
      fullDescBn: "শিশুদের চোখের সমস্যা প্রাথমিক পর্যায়ে ধরা পড়লে সহজেই চিকিৎসা করা যায়। আমাদের শিশু চক্ষু বিশেষজ্ঞ শিশুদের চোখ ট্যারা, অলস চোখ, চশমার পাওয়ার সহ সকল সমস্যার চিকিৎসা করেন। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "Children's eye problems are easily treatable when detected early. Our pediatric eye specialist treats all problems including squint, lazy eye, and glasses power in children. [Update detailed information]",
      icon: "🧒",
      doctorId: d3.id,
      sortOrder: 5,
    },
    {
      id: "seed-service-6",
      category: "EXAMINATION" as const,
      nameBn: "চোখের সম্পূর্ণ পরীক্ষা",
      nameEn: "Complete Eye Examination",
      shortDescBn: "আধুনিক যন্ত্রপাতি দিয়ে চোখের সম্পূর্ণ পরীক্ষা ও চশমার পাওয়ার নির্ধারণ।",
      shortDescEn: "Complete eye examination and spectacle power determination with modern equipment.",
      fullDescBn: "আমাদের হাসপাতালে আধুনিক অটো রিফ্র্যাক্টোমিটার, স্লিট ল্যাম্প ও অন্যান্য যন্ত্রপাতি দিয়ে চোখের সম্পূর্ণ পরীক্ষা করা হয়। সঠিক চশমার পাওয়ার নির্ধারণ ও প্রেসক্রিপশন প্রদান করা হয়। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "At our hospital, a complete eye examination is performed with modern auto refractometer, slit lamp, and other equipment. Accurate spectacle power determination and prescription are provided. [Update detailed information]",
      icon: "👓",
      sortOrder: 6,
    },
    {
      id: "seed-service-7",
      category: "DIABETIC" as const,
      nameBn: "ডায়াবেটিক চক্ষু সেবা",
      nameEn: "Diabetic Eye Care",
      shortDescBn: "ডায়াবেটিস রোগীদের চোখের বিশেষ পরীক্ষা ও চিকিৎসা।",
      shortDescEn: "Special eye examination and treatment for diabetic patients.",
      fullDescBn: "ডায়াবেটিস চোখের রেটিনাকে ক্ষতিগ্রস্ত করতে পারে যা ডায়াবেটিক রেটিনোপ্যাথি নামে পরিচিত। ডায়াবেটিস রোগীদের নিয়মিত চোখ পরীক্ষা করানো অত্যন্ত জরুরি। আমাদের হাসপাতালে ডায়াবেটিক চোখের বিশেষ পরীক্ষা ও চিকিৎসা পাওয়া যায়। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "Diabetes can damage the retina of the eye, known as diabetic retinopathy. It is very important for diabetic patients to have regular eye examinations. Special diabetic eye examination and treatment are available at our hospital. [Update detailed information]",
      icon: "🩺",
      sortOrder: 7,
    },
    {
      id: "seed-service-8",
      category: "GENERAL" as const,
      nameBn: "জরুরি চক্ষু সেবা",
      nameEn: "Emergency Eye Care",
      shortDescBn: "চোখের যেকোনো জরুরি সমস্যায় দ্রুত চিকিৎসা সেবা।",
      shortDescEn: "Rapid treatment for any emergency eye condition.",
      fullDescBn: "চোখে আঘাত, হঠাৎ দৃষ্টিশক্তি কমে যাওয়া, চোখে রাসায়নিক পদার্থ পড়া সহ যেকোনো জরুরি চোখের সমস্যায় আমাদের হাসপাতালে দ্রুত চিকিৎসা সেবা পাওয়া যায়। [বিস্তারিত তথ্য আপডেট করুন]",
      fullDescEn: "Rapid treatment is available at our hospital for any emergency eye condition including eye injury, sudden vision loss, chemical exposure to the eye. [Update detailed information]",
      icon: "🚨",
      sortOrder: 8,
    },
  ];

  for (const service of services) {
    const { doctorId, ...rest } = service;
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: {
        ...rest,
        ...(doctorId ? { doctorId } : {}),
      },
    });
  }

  console.log("✅ Seed complete");
  console.log("   Admin: admin@sherpureyehospital.com / admin123");
  console.log("   Doctors: 3 | Services: 8 | Permissions: 14");
  console.log("   ⚠️  Update names and info from the admin panel");

  // ── CMS Settings ─────────────────────────────────────────────────────────
  const cmsSettings = [
    // Hospital
    { key: "hospital_name_bn",    value: "শেরপুর আধুনিক চক্ষু হাসপাতাল", group: "hospital", labelBn: "হাসপাতালের নাম (বাংলা)",    labelEn: "Hospital Name (Bangla)",    type: "text" },
    { key: "hospital_name_en",    value: "Sherpur Modern Eye Hospital",    group: "hospital", labelBn: "হাসপাতালের নাম (ইংরেজি)",  labelEn: "Hospital Name (English)",  type: "text" },
    { key: "hospital_tagline_bn", value: "আপনার দৃষ্টি, আমাদের অঙ্গীকার", group: "hospital", labelBn: "ট্যাগলাইন (বাংলা)",         labelEn: "Tagline (Bangla)",         type: "text" },
    { key: "hospital_tagline_en", value: "Your Vision, Our Commitment",    group: "hospital", labelBn: "ট্যাগলাইন (ইংরেজি)",       labelEn: "Tagline (English)",       type: "text" },
    { key: "hospital_logo",       value: "",                               group: "hospital", labelBn: "হাসপাতাল লোগো",            labelEn: "Hospital Logo",            type: "image" },
    { key: "hospital_founded",    value: "২০১০",                           group: "hospital", labelBn: "প্রতিষ্ঠার সাল",           labelEn: "Founded Year",             type: "text" },
    // Contact
    { key: "contact_address_bn",  value: "শেরপুর সদর, শেরপুর",            group: "contact",  labelBn: "ঠিকানা (বাংলা)",           labelEn: "Address (Bangla)",         type: "textarea" },
    { key: "contact_address_en",  value: "Sherpur Sadar, Sherpur",         group: "contact",  labelBn: "ঠিকানা (ইংরেজি)",         labelEn: "Address (English)",       type: "textarea" },
    { key: "contact_phone",       value: "01700-000000",                   group: "contact",  labelBn: "ফোন নম্বর",               labelEn: "Phone Number",             type: "text" },
    { key: "contact_email",       value: "info@sherpureyehospital.com",    group: "contact",  labelBn: "ইমেইল",                   labelEn: "Email",                    type: "text" },
    { key: "contact_map_url",     value: "",                               group: "contact",  labelBn: "Google Map Embed URL",     labelEn: "Google Map Embed URL",     type: "url" },
    // Hours
    { key: "hours_weekday_bn",    value: "শনি – বৃহস্পতি: সকাল ৯টা – রাত ৮টা", group: "hours", labelBn: "সাপ্তাহিক সময়সূচি (বাংলা)", labelEn: "Weekday Hours (Bangla)", type: "text" },
    { key: "hours_weekend_bn",    value: "শুক্রবার: বিকাল ৩টা – রাত ৮টা",      group: "hours", labelBn: "শুক্রবার সময়সূচি (বাংলা)",  labelEn: "Friday Hours (Bangla)",  type: "text" },
    { key: "hours_emergency",     value: "জরুরি সেবা: ২৪ ঘণ্টা",               group: "hours", labelBn: "জরুরি সেবার সময়",          labelEn: "Emergency Hours",        type: "text" },
    // Social
    { key: "social_facebook",     value: "", group: "social", labelBn: "Facebook URL",  labelEn: "Facebook URL",  type: "url" },
    { key: "social_youtube",      value: "", group: "social", labelBn: "YouTube URL",   labelEn: "YouTube URL",   type: "url" },
    { key: "social_instagram",    value: "", group: "social", labelBn: "Instagram URL", labelEn: "Instagram URL", type: "url" },
    // Hero
    { key: "hero_title_bn",       value: "আপনার দৃষ্টি রক্ষায় আমরা প্রতিশ্রুতিবদ্ধ", group: "hero", labelBn: "হিরো শিরোনাম (বাংলা)",  labelEn: "Hero Title (Bangla)",  type: "text" },
    { key: "hero_subtitle_bn",    value: "আধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসক দল",   group: "hero", labelBn: "হিরো সাবটাইটেল (বাংলা)", labelEn: "Hero Subtitle (Bangla)", type: "text" },
    { key: "hero_image",          value: "", group: "hero", labelBn: "হিরো ব্যাকগ্রাউন্ড ছবি", labelEn: "Hero Background Image", type: "image" },
    // Stats
    { key: "stats_patients",      value: "৫০,০০০+", group: "stats", labelBn: "মোট রোগী",       labelEn: "Total Patients",    type: "text" },
    { key: "stats_surgeries",     value: "১০,০০০+", group: "stats", labelBn: "সফল অপারেশন",   labelEn: "Successful Surgeries", type: "text" },
    { key: "stats_doctors",       value: "১০+",     group: "stats", labelBn: "বিশেষজ্ঞ চিকিৎসক", labelEn: "Expert Doctors",   type: "text" },
    { key: "stats_experience",    value: "১৫+",     group: "stats", labelBn: "বছরের অভিজ্ঞতা",  labelEn: "Years Experience",  type: "text" },
    // About
    { key: "about_title_bn",      value: "আমাদের সম্পর্কে",                group: "about", labelBn: "শিরোনাম (বাংলা)",    labelEn: "Title (Bangla)",    type: "text" },
    { key: "about_desc_bn",       value: "শেরপুর আধুনিক চক্ষু হাসপাতাল একটি অত্যাধুনিক চক্ষু চিকিৎসা কেন্দ্র।", group: "about", labelBn: "বিবরণ (বাংলা)", labelEn: "Description (Bangla)", type: "textarea" },
    { key: "about_image_1",       value: "", group: "about", labelBn: "About ছবি ১", labelEn: "About Image 1", type: "image" },
    { key: "about_image_2",       value: "", group: "about", labelBn: "About ছবি ২", labelEn: "About Image 2", type: "image" },

    // Page Heroes
    { key: "hero_about_image",       value: "", group: "page_heroes", labelBn: "About পেজ হিরো ছবি",       labelEn: "About Page Hero Image",       type: "image" },
    { key: "hero_appointment_image", value: "", group: "page_heroes", labelBn: "Appointment পেজ হিরো ছবি",  labelEn: "Appointment Page Hero Image",  type: "image" },
    { key: "hero_doctors_image",     value: "", group: "page_heroes", labelBn: "Doctors পেজ হিরো ছবি",    labelEn: "Doctors Page Hero Image",    type: "image" },
    { key: "hero_gallery_image",     value: "", group: "page_heroes", labelBn: "Gallery পেজ হিরো ছবি",    labelEn: "Gallery Page Hero Image",    type: "image" },
    { key: "hero_services_image",    value: "", group: "page_heroes", labelBn: "Services পেজ হিরো ছবি",   labelEn: "Services Page Hero Image",   type: "image" },
    { key: "hero_news_image",        value: "", group: "page_heroes", labelBn: "News পেজ হিরো ছবি",       labelEn: "News Page Hero Image",       type: "image" },
    { key: "hero_contact_image",     value: "", group: "page_heroes", labelBn: "Contact পেজ হিরো ছবি",    labelEn: "Contact Page Hero Image",    type: "image" },

    // Nav Icons
    { key: "nav_icon_home",        value: "", group: "nav_icons", labelBn: "হোম আইকন",          labelEn: "Home Icon",        type: "image" },
    { key: "nav_icon_about",       value: "", group: "nav_icons", labelBn: "আমাদের সম্পর্কে আইকন", labelEn: "About Icon",      type: "image" },
    { key: "nav_icon_doctors",     value: "", group: "nav_icons", labelBn: "চিকিৎসক আইকন",      labelEn: "Doctors Icon",     type: "image" },
    { key: "nav_icon_services",    value: "", group: "nav_icons", labelBn: "সেবা আইকন",          labelEn: "Services Icon",    type: "image" },
    { key: "nav_icon_appointment", value: "", group: "nav_icons", labelBn: "অ্যাপয়েন্টমেন্ট আইকন", labelEn: "Appointment Icon", type: "image" },
    { key: "nav_icon_gallery",     value: "", group: "nav_icons", labelBn: "গ্যালারি আইকন",       labelEn: "Gallery Icon",     type: "image" },
    { key: "nav_icon_news",        value: "", group: "nav_icons", labelBn: "সংবাদ আইকন",          labelEn: "News Icon",        type: "image" },
    { key: "nav_icon_contact",     value: "", group: "nav_icons", labelBn: "যোগাযোগ আইকন",       labelEn: "Contact Icon",     type: "image" },

    // Service Icons
    { key: "icon_service_1", value: "👁️", group: "icons_services", labelBn: "সেবা আইকন ১", labelEn: "Service Icon 1", type: "text" },
    { key: "icon_service_2", value: "🔬", group: "icons_services", labelBn: "সেবা আইকন ২", labelEn: "Service Icon 2", type: "text" },
    { key: "icon_service_3", value: "👓", group: "icons_services", labelBn: "সেবা আইকন ৩", labelEn: "Service Icon 3", type: "text" },
    { key: "icon_service_4", value: "💧", group: "icons_services", labelBn: "সেবা আইকন ৪", labelEn: "Service Icon 4", type: "text" },
    { key: "icon_service_5", value: "🧒", group: "icons_services", labelBn: "সেবা আইকন ৫", labelEn: "Service Icon 5", type: "text" },
    { key: "icon_service_6", value: "🏥", group: "icons_services", labelBn: "সেবা আইকন ৬", labelEn: "Service Icon 6", type: "text" },

    // Why Us Icons
    { key: "icon_why_1", value: "🏆", group: "icons_why", labelBn: "কেন আমরা আইকন ১", labelEn: "Why Us Icon 1", type: "text" },
    { key: "icon_why_2", value: "⚙️", group: "icons_why", labelBn: "কেন আমরা আইকন ২", labelEn: "Why Us Icon 2", type: "text" },
    { key: "icon_why_3", value: "💙", group: "icons_why", labelBn: "কেন আমরা আইকন ৩", labelEn: "Why Us Icon 3", type: "text" },
    { key: "icon_why_4", value: "💰", group: "icons_why", labelBn: "কেন আমরা আইকন ৪", labelEn: "Why Us Icon 4", type: "text" },
    { key: "icon_why_5", value: "🕐", group: "icons_why", labelBn: "কেন আমরা আইকন ৫", labelEn: "Why Us Icon 5", type: "text" },
    { key: "icon_why_6", value: "📍", group: "icons_why", labelBn: "কেন আমরা আইকন ৬", labelEn: "Why Us Icon 6", type: "text" },

    // Facilities Icons
    { key: "icon_facility_1", value: "🏨", group: "icons_facilities", labelBn: "সুবিধা আইকন ১", labelEn: "Facility Icon 1", type: "text" },
    { key: "icon_facility_2", value: "🔭", group: "icons_facilities", labelBn: "সুবিধা আইকন ২", labelEn: "Facility Icon 2", type: "text" },
    { key: "icon_facility_3", value: "🛏️", group: "icons_facilities", labelBn: "সুবিধা আইকন ৩", labelEn: "Facility Icon 3", type: "text" },
    { key: "icon_facility_4", value: "🚑", group: "icons_facilities", labelBn: "সুবিধা আইকন ৪", labelEn: "Facility Icon 4", type: "text" },
    { key: "icon_facility_5", value: "💊", group: "icons_facilities", labelBn: "সুবিধা আইকন ৫", labelEn: "Facility Icon 5", type: "text" },
    { key: "icon_facility_6", value: "🅿️", group: "icons_facilities", labelBn: "সুবিধা আইকন ৬", labelEn: "Facility Icon 6", type: "text" },

    // About Page Icons
    { key: "icon_mission",  value: "🎯", group: "icons_about", labelBn: "মিশন আইকন",    labelEn: "Mission Icon",   type: "text" },
    { key: "icon_vision",   value: "🌟", group: "icons_about", labelBn: "ভিশন আইকন",    labelEn: "Vision Icon",    type: "text" },
    { key: "icon_value_1",  value: "❤️", group: "icons_about", labelBn: "মূল্যবোধ আইকন ১", labelEn: "Value Icon 1", type: "text" },
    { key: "icon_value_2",  value: "✅", group: "icons_about", labelBn: "মূল্যবোধ আইকন ২", labelEn: "Value Icon 2", type: "text" },
    { key: "icon_value_3",  value: "🤝", group: "icons_about", labelBn: "মূল্যবোধ আইকন ৩", labelEn: "Value Icon 3", type: "text" },
    { key: "icon_value_4",  value: "🌱", group: "icons_about", labelBn: "মূল্যবোধ আইকন ৪", labelEn: "Value Icon 4", type: "text" },
    { key: "icon_value_5",  value: "🏘️", group: "icons_about", labelBn: "মূল্যবোধ আইকন ৫", labelEn: "Value Icon 5", type: "text" },
    { key: "icon_value_6",  value: "📚", group: "icons_about", labelBn: "মূল্যবোধ আইকন ৬", labelEn: "Value Icon 6", type: "text" },
  ];

  for (const s of cmsSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // ── Homepage Sections ─────────────────────────────────────────────────────
  const homeSections = [
    { key: "hero",         labelBn: "হিরো সেকশন",       labelEn: "Hero Section",       isVisible: true,  sortOrder: 1 },
    { key: "stats",        labelBn: "পরিসংখ্যান",        labelEn: "Stats Section",      isVisible: true,  sortOrder: 2 },
    { key: "services",     labelBn: "সেবাসমূহ",          labelEn: "Services Section",   isVisible: true,  sortOrder: 3 },
    { key: "doctors",      labelBn: "চিকিৎসকগণ",         labelEn: "Doctors Section",    isVisible: true,  sortOrder: 4 },
    { key: "about",        labelBn: "আমাদের সম্পর্কে",   labelEn: "About Section",      isVisible: true,  sortOrder: 5 },
    { key: "gallery",      labelBn: "গ্যালারি",           labelEn: "Gallery Section",    isVisible: true,  sortOrder: 6 },
    { key: "testimonials", labelBn: "রোগীদের মতামত",    labelEn: "Testimonials",       isVisible: true,  sortOrder: 7 },
    { key: "news",         labelBn: "সংবাদ",             labelEn: "News Section",       isVisible: true,  sortOrder: 8 },
    { key: "contact",      labelBn: "যোগাযোগ",           labelEn: "Contact Section",    isVisible: true,  sortOrder: 9 },
  ];

  for (const sec of homeSections) {
    await prisma.homepageSection.upsert({
      where: { key: sec.key },
      update: {},
      create: sec,
    });
  }

  console.log("✅ CMS settings & sections seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
