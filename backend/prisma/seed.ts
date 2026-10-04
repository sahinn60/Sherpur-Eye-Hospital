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
    { key: "hospital_name_en",    value: "Sherpur Adhunik Eye Hospital",    group: "hospital", labelBn: "হাসপাতালের নাম (ইংরেজি)",  labelEn: "Hospital Name (English)",  type: "text" },
    { key: "hospital_tagline_bn", value: "ও ফ্যাকো সেন্টার",              group: "hospital", labelBn: "ট্যাগলাইন (বাংলা)",         labelEn: "Tagline (Bangla)",         type: "text" },
    { key: "hospital_tagline_en", value: "& Phaco Center",                  group: "hospital", labelBn: "ট্যাগলাইন (ইংরেজি)",       labelEn: "Tagline (English)",       type: "text" },
    { key: "hospital_logo",       value: "",                               group: "hospital", labelBn: "হাসপাতাল লোগো",            labelEn: "Hospital Logo",            type: "image" },
    { key: "hospital_founded",    value: "২০১০",                           group: "hospital", labelBn: "প্রতিষ্ঠার সাল",           labelEn: "Founded Year",             type: "text" },
    // Contact
    { key: "contact_address_bn",  value: "শেরপুর সদর, শেরপুর",            group: "contact",  labelBn: "ঠিকানা (বাংলা)",           labelEn: "Address (Bangla)",         type: "textarea" },
    { key: "contact_address_en",  value: "Sherpur Sadar, Sherpur",         group: "contact",  labelBn: "ঠিকানা (ইংরেজি)",         labelEn: "Address (English)",       type: "textarea" },
    { key: "contact_phone",       value: "01700-000000",                   group: "contact",  labelBn: "ফোন নম্বর",               labelEn: "Phone Number",             type: "text" },
    { key: "contact_email",       value: "info@sherpureyehospital.com",    group: "contact",  labelBn: "ইমেইল",                   labelEn: "Email",                    type: "text" },
    { key: "contact_map_url",     value: "",                               group: "contact",  labelBn: "Google Map Embed URL",     labelEn: "Google Map Embed URL",     type: "url" },
    // Hours
    { key: "hours_weekday_bn",    value: "শনি – বৃহস্পতি: সকাল ৮টা – রাত ৮টা", group: "hours", labelBn: "সাপ্তাহিক সময়সূচি (বাংলা)", labelEn: "Weekday Hours (Bangla)", type: "text" },
    { key: "hours_weekday_en",    value: "Sat–Thu: 8:00 AM – 8:00 PM",          group: "hours", labelBn: "সাপ্তাহিক সময়সূচি (ইংরেজি)", labelEn: "Weekday Hours (English)", type: "text" },
    { key: "hours_weekend_bn",    value: "শুক্রবার: সকাল ১০টা – দুপুর ১টা",      group: "hours", labelBn: "শুক্রবার সময়সূচি (বাংলা)",  labelEn: "Friday Hours (Bangla)",  type: "text" },
    { key: "hours_weekend_en",    value: "Friday: 10:00 AM – 1:00 PM",           group: "hours", labelBn: "শুক্রবার সময়সূচি (ইংরেজি)",  labelEn: "Friday Hours (English)",  type: "text" },
    { key: "hours_emergency",     value: "জরুরি সেবা: ২৪ ঘণ্টা",               group: "hours", labelBn: "জরুরি সেবার সময়",          labelEn: "Emergency Hours",        type: "text" },
    // Social
    { key: "social_facebook",     value: "", group: "social", labelBn: "Facebook URL",  labelEn: "Facebook URL",  type: "url" },
    { key: "social_youtube",      value: "", group: "social", labelBn: "YouTube URL",   labelEn: "YouTube URL",   type: "url" },
    { key: "social_instagram",    value: "", group: "social", labelBn: "Instagram URL", labelEn: "Instagram URL", type: "url" },
    // Hero
    { key: "hero_badge_bn",    value: "শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র", group: "hero", labelBn: "ব্যাজ টেক্সট (বাংলা)",  labelEn: "Badge Text (Bangla)",  type: "text" },
    { key: "hero_badge_en",    value: "Modern Eye Care Center in Sherpur",  group: "hero", labelBn: "ব্যাজ টেক্সট (ইংরেজি)",  labelEn: "Badge Text (English)",  type: "text" },
    { key: "hero_title_bn",    value: "আপনার দৃষ্টিশক্তি আমাদের দায়িত্ব", group: "hero", labelBn: "হিরো শিরোনাম (বাংলা)",  labelEn: "Hero Title (Bangla)",  type: "text" },
    { key: "hero_title_en",    value: "Your Vision, Our Responsibility",    group: "hero", labelBn: "হিরো শিরোনাম (ইংরেজি)",  labelEn: "Hero Title (English)",  type: "text" },
    { key: "hero_desc_bn",     value: "শেরপুর আধুনিক চক্ষু হাসপাতালে আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের মাধ্যমে আপনার চোখের সর্বোত্তম যত্ন নিশ্চিত করি।", group: "hero", labelBn: "হিরো বিবরণ (বাংলা)",  labelEn: "Hero Description (Bangla)",  type: "textarea" },
    { key: "hero_desc_en",     value: "At Sherpur Adhunik Eye Hospital, we ensure the best care for your eyes through modern technology and experienced doctors.", group: "hero", labelBn: "হিরো বিবরণ (ইংরেজি)",  labelEn: "Hero Description (English)",  type: "textarea" },
    { key: "hero_image",       value: "", group: "hero", labelBn: "হিরো ব্যাকগ্রাউন্ড ছবি", labelEn: "Hero Background Image", type: "image" },
    // Stats
    { key: "stat1_value_bn",   value: "১০+",       group: "stats", labelBn: "স্ট্যাট ১ মান (বাংলা)",  labelEn: "Stat 1 Value (Bangla)",  type: "text" },
    { key: "stat1_value_en",   value: "10+",        group: "stats", labelBn: "স্ট্যাট ১ মান (ইংরেজি)",  labelEn: "Stat 1 Value (English)",  type: "text" },
    { key: "stat1_label_bn",   value: "বছরের অভিজ্ঞতা",  group: "stats", labelBn: "স্ট্যাট ১ লেবেল (বাংলা)", labelEn: "Stat 1 Label (Bangla)", type: "text" },
    { key: "stat1_label_en",   value: "Years Experience", group: "stats", labelBn: "স্ট্যাট ১ লেবেল (ইংরেজি)", labelEn: "Stat 1 Label (English)", type: "text" },
    { key: "stat2_value_bn",   value: "৫+",        group: "stats", labelBn: "স্ট্যাট ২ মান (বাংলা)",  labelEn: "Stat 2 Value (Bangla)",  type: "text" },
    { key: "stat2_value_en",   value: "5+",         group: "stats", labelBn: "স্ট্যাট ২ মান (ইংরেজি)",  labelEn: "Stat 2 Value (English)",  type: "text" },
    { key: "stat2_label_bn",   value: "বিশেষজ্ঞ চিকিৎসক", group: "stats", labelBn: "স্ট্যাট ২ লেবেল (বাংলা)", labelEn: "Stat 2 Label (Bangla)", type: "text" },
    { key: "stat2_label_en",   value: "Specialist Doctors", group: "stats", labelBn: "স্ট্যাট ২ লেবেল (ইংরেজি)", labelEn: "Stat 2 Label (English)", type: "text" },
    { key: "stat3_value_bn",   value: "৫০+",       group: "stats", labelBn: "স্ট্যাট ৩ মান (বাংলা)",  labelEn: "Stat 3 Value (Bangla)",  type: "text" },
    { key: "stat3_value_en",   value: "50+",        group: "stats", labelBn: "স্ট্যাট ৩ মান (ইংরেজি)",  labelEn: "Stat 3 Value (English)",  type: "text" },
    { key: "stat3_label_bn",   value: "চিকিৎসা সেবা",    group: "stats", labelBn: "স্ট্যাট ৩ লেবেল (বাংলা)", labelEn: "Stat 3 Label (Bangla)", type: "text" },
    { key: "stat3_label_en",   value: "Medical Services",  group: "stats", labelBn: "স্ট্যাট ৩ লেবেল (ইংরেজি)", labelEn: "Stat 3 Label (English)", type: "text" },
    { key: "stat4_value_bn",   value: "১০,০০০+",   group: "stats", labelBn: "স্ট্যাট ৪ মান (বাংলা)",  labelEn: "Stat 4 Value (Bangla)",  type: "text" },
    { key: "stat4_value_en",   value: "10,000+",    group: "stats", labelBn: "স্ট্যাট ৪ মান (ইংরেজি)",  labelEn: "Stat 4 Value (English)",  type: "text" },
    { key: "stat4_label_bn",   value: "সন্তুষ্ট রোগী",   group: "stats", labelBn: "স্ট্যাট ৪ লেবেল (বাংলা)", labelEn: "Stat 4 Label (Bangla)", type: "text" },
    { key: "stat4_label_en",   value: "Happy Patients",    group: "stats", labelBn: "স্ট্যাট ৪ লেবেল (ইংরেজি)", labelEn: "Stat 4 Label (English)", type: "text" },
    // About
    { key: "about_title_bn",      value: "আমাদের সম্পর্কে",   group: "about", labelBn: "শিরোনাম (বাংলা)",         labelEn: "Title (Bangla)",          type: "text" },
    { key: "about_title_en",      value: "About Us",           group: "about", labelBn: "শিরোনাম (ইংরেজি)",        labelEn: "Title (English)",         type: "text" },
    { key: "about_tag_bn",        value: "আমাদের পরিচয়",      group: "about", labelBn: "ট্যাগ (বাংলা)",            labelEn: "Tag (Bangla)",            type: "text" },
    { key: "about_tag_en",        value: "Who We Are",         group: "about", labelBn: "ট্যাগ (ইংরেজি)",           labelEn: "Tag (English)",           type: "text" },
    { key: "about_intro_title_bn",value: "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার", group: "about", labelBn: "ভূমিকা শিরোনাম (বাংলা)", labelEn: "Intro Title (Bangla)", type: "text" },
    { key: "about_intro_title_en",value: "Sherpur Adhunik Eye Hospital & Phaco Center",     group: "about", labelBn: "ভূমিকা শিরোনাম (ইংরেজি)",labelEn: "Intro Title (English)",type: "text" },
    { key: "about_para1_bn",      value: "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি বিশেষায়িত চিকিৎসা প্রতিষ্ঠান।", group: "about", labelBn: "অনুচ্ছেদ ১ (বাংলা)", labelEn: "Paragraph 1 (Bangla)", type: "textarea" },
    { key: "about_para1_en",      value: "Sherpur Adhunik Eye Hospital & Phaco Center is a specialized medical institution dedicated to eye care for the people of Sherpur district.", group: "about", labelBn: "অনুচ্ছেদ ১ (ইংরেজি)", labelEn: "Paragraph 1 (English)", type: "textarea" },
    { key: "about_para2_bn",      value: "আমাদের হাসপাতালে অভিজ্ঞ চক্ষু বিশেষজ্ঞ চিকিৎসক দল, আধুনিক ডায়াগনস্টিক যন্ত্রপাতি এবং সর্বোচ্চ মানের চিকিৎসা সেবা নিশ্চিত করা হয়।", group: "about", labelBn: "অনুচ্ছেদ ২ (বাংলা)", labelEn: "Paragraph 2 (Bangla)", type: "textarea" },
    { key: "about_para2_en",      value: "Our hospital ensures an experienced team of eye specialists, modern diagnostic equipment, and the highest quality medical care.", group: "about", labelBn: "অনুচ্ছেদ ২ (ইংরেজি)", labelEn: "Paragraph 2 (English)", type: "textarea" },
    { key: "about_founded_bn",    value: "প্রতিষ্ঠাকাল: ২০১০", group: "about", labelBn: "প্রতিষ্ঠাকাল (বাংলা)",    labelEn: "Founded (Bangla)",        type: "text" },
    { key: "about_founded_en",    value: "Established: 2010",  group: "about", labelBn: "প্রতিষ্ঠাকাল (ইংরেজি)",  labelEn: "Founded (English)",       type: "text" },
    { key: "about_location_bn",   value: "শেরপুর সদর, শেরপুর", group: "about", labelBn: "অবস্থান (বাংলা)",         labelEn: "Location (Bangla)",       type: "text" },
    { key: "about_location_en",   value: "Sherpur Sadar, Sherpur", group: "about", labelBn: "অবস্থান (ইংরেজি)",      labelEn: "Location (English)",      type: "text" },
    { key: "about_mission_bn",    value: "সাশ্রয়ী মূল্যে সর্বোচ্চ মানের চক্ষু সেবা প্রদান করা।", group: "about", labelBn: "মিশন (বাংলা)", labelEn: "Mission (Bangla)", type: "textarea" },
    { key: "about_mission_en",    value: "To provide the highest quality eye care at affordable prices.", group: "about", labelBn: "মিশন (ইংরেজি)", labelEn: "Mission (English)", type: "textarea" },
    { key: "about_vision_bn",     value: "শেরপুর জেলায় অন্ধত্বমুক্ত সমাজ গড়ে তোলা।", group: "about", labelBn: "ভিশন (বাংলা)", labelEn: "Vision (Bangla)", type: "textarea" },
    { key: "about_vision_en",     value: "To build a blindness-free society in Sherpur district.", group: "about", labelBn: "ভিশন (ইংরেজি)", labelEn: "Vision (English)", type: "textarea" },
    { key: "about_desc_bn",       value: "শেরপুর আধুনিক চক্ষু হাসপাতাল একটি অত্যাধুনিক চক্ষু চিকিৎসা কেন্দ্র।", group: "about", labelBn: "বিবরণ (বাংলা)", labelEn: "Description (Bangla)", type: "textarea" },
    { key: "about_desc_en",       value: "Sherpur Adhunik Eye Hospital is a state-of-the-art eye care center.", group: "about", labelBn: "বিবরণ (ইংরেজি)", labelEn: "Description (English)", type: "textarea" },
    { key: "about_image_1",       value: "", group: "about", labelBn: "মূল ছবি (About)",   labelEn: "Main Image (About)",  type: "image" },
    { key: "about_image_2",       value: "", group: "about", labelBn: "গ্যালারি ছবি ১",    labelEn: "Gallery Image 1",     type: "image" },
    { key: "about_image_3",       value: "", group: "about", labelBn: "গ্যালারি ছবি ২",    labelEn: "Gallery Image 2",     type: "image" },
    { key: "about_image_4",       value: "", group: "about", labelBn: "গ্যালারি ছবি ৩",    labelEn: "Gallery Image 3",     type: "image" },
    { key: "about_image_5",       value: "", group: "about", labelBn: "গ্যালারি ছবি ৪",    labelEn: "Gallery Image 4",     type: "image" },
    { key: "about_image_6",       value: "", group: "about", labelBn: "গ্যালারি ছবি ৫",    labelEn: "Gallery Image 5",     type: "image" },
    { key: "about_image_7",       value: "", group: "about", labelBn: "গ্যালারি ছবি ৬",    labelEn: "Gallery Image 6",     type: "image" },
    { key: "about_env_image_1",   value: "", group: "about", labelBn: "পরিবেশ ছবি ১",      labelEn: "Environment Image 1", type: "image" },
    { key: "about_env_image_2",   value: "", group: "about", labelBn: "পরিবেশ ছবি ২",      labelEn: "Environment Image 2", type: "image" },
    { key: "about_env_image_3",   value: "", group: "about", labelBn: "পরিবেশ ছবি ৩",      labelEn: "Environment Image 3", type: "image" },
    { key: "about_env_image_4",   value: "", group: "about", labelBn: "পরিবেশ ছবি ৪",      labelEn: "Environment Image 4", type: "image" },

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
    { key: "icon_care_1",   value: "👂", group: "icons_about", labelBn: "রোগী সেবা আইকন ১", labelEn: "Care Icon 1", type: "text" },
    { key: "icon_care_2",   value: "🔍", group: "icons_about", labelBn: "রোগী সেবা আইকন ২", labelEn: "Care Icon 2", type: "text" },
    { key: "icon_care_3",   value: "💬", group: "icons_about", labelBn: "রোগী সেবা আইকন ৩", labelEn: "Care Icon 3", type: "text" },
    { key: "icon_care_4",   value: "🔄", group: "icons_about", labelBn: "রোগী সেবা আইকন ৪", labelEn: "Care Icon 4", type: "text" },
    { key: "icon_equip_1",  value: "🔭", group: "icons_about", labelBn: "যন্ত্রপাতি আইকন ১", labelEn: "Equipment Icon 1", type: "text" },
    { key: "icon_equip_2",  value: "📊", group: "icons_about", labelBn: "যন্ত্রপাতি আইকন ২", labelEn: "Equipment Icon 2", type: "text" },
    { key: "icon_equip_3",  value: "💧", group: "icons_about", labelBn: "যন্ত্রপাতি আইকন ৩", labelEn: "Equipment Icon 3", type: "text" },
    { key: "icon_equip_4",  value: "⚡", group: "icons_about", labelBn: "যন্ত্রপাতি আইকন ৪", labelEn: "Equipment Icon 4", type: "text" },
    { key: "icon_equip_5",  value: "🌐", group: "icons_about", labelBn: "যন্ত্রপাতি আইকন ৫", labelEn: "Equipment Icon 5", type: "text" },
    { key: "icon_equip_6",  value: "🔬", group: "icons_about", labelBn: "যন্ত্রপাতি আইকন ৬", labelEn: "Equipment Icon 6", type: "text" },
    { key: "icon_contact_1",value: "🚨", group: "icons_about", labelBn: "যোগাযোগ আইকন ১", labelEn: "Contact Reason Icon 1", type: "text" },
    { key: "icon_contact_2",value: "📅", group: "icons_about", labelBn: "যোগাযোগ আইকন ২", labelEn: "Contact Reason Icon 2", type: "text" },
    { key: "icon_contact_3",value: "👓", group: "icons_about", labelBn: "যোগাযোগ আইকন ৩", labelEn: "Contact Reason Icon 3", type: "text" },
    { key: "icon_contact_4",value: "🧒", group: "icons_about", labelBn: "যোগাযোগ আইকন ৪", labelEn: "Contact Reason Icon 4", type: "text" },
    { key: "icon_contact_5",value: "🌙", group: "icons_about", labelBn: "যোগাযোগ আইকন ৫", labelEn: "Contact Reason Icon 5", type: "text" },
    { key: "icon_contact_6",value: "💧", group: "icons_about", labelBn: "যোগাযোগ আইকন ৬", labelEn: "Contact Reason Icon 6", type: "text" },
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
