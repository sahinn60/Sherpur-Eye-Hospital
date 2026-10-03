// ─── EDIT THIS FILE to update site-wide content ───────────────────────────

export const HOSPITAL_INFO = {
  nameBn: "শেরপুর আধুনিক চক্ষু হাসপাতাল",
  nameEn: "Sherpur Adhunik Eye Hospital",
  taglineBn: "ও ফ্যাকো সেন্টার",
  taglineEn: "& Phaco Center",
  phone: "+880 1700-000000",
  emergency: "+880 1800-000000",
  email: "info@sherpureyehospital.com",
  addressBn: "শেরপুর সদর, শেরপুর-২১০০",
  addressEn: "Sherpur Sadar, Sherpur-2100",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.0!2d90.0!3d25.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDAwJzAwLjAiTiA5MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890",
  socialFacebook: "https://facebook.com",
  socialYoutube: "https://youtube.com",
  hoursBn: "শনি–বৃহস্পতি: সকাল ৮টা – রাত ৮টা",
  hoursEn: "Sat–Thu: 8:00 AM – 8:00 PM",
  fridayBn: "শুক্রবার: সকাল ১০টা – দুপুর ১টা",
  fridayEn: "Friday: 10:00 AM – 1:00 PM",
};

// Stats — set to null to hide a stat
export const STATS = [
  { valueBn: "১০+", valueEn: "10+", labelBn: "বছরের অভিজ্ঞতা", labelEn: "Years Experience" },
  { valueBn: "৫+", valueEn: "5+", labelBn: "বিশেষজ্ঞ চিকিৎসক", labelEn: "Specialist Doctors" },
  { valueBn: "৫০+", valueEn: "50+", labelBn: "চিকিৎসা সেবা", labelEn: "Medical Services" },
  { valueBn: "১০,০০০+", valueEn: "10,000+", labelBn: "সন্তুষ্ট রোগী", labelEn: "Happy Patients" },
];

export const SERVICES = [
  {
    icon: "👁️",
    titleBn: "ফ্যাকো ক্যাটারেক্ট সার্জারি",
    titleEn: "Phaco Cataract Surgery",
    descBn: "আধুনিক ফ্যাকোইমালসিফিকেশন পদ্ধতিতে ছানি অপারেশন।",
    descEn: "Modern phacoemulsification technique for cataract removal.",
  },
  {
    icon: "🔬",
    titleBn: "রেটিনা চিকিৎসা",
    titleEn: "Retina Treatment",
    descBn: "রেটিনার জটিল রোগের আধুনিক চিকিৎসা ও লেজার থেরাপি।",
    descEn: "Advanced treatment for retinal diseases and laser therapy.",
  },
  {
    icon: "👓",
    titleBn: "চশমার পাওয়ার পরীক্ষা",
    titleEn: "Refraction & Glasses",
    descBn: "সঠিক চশমার পাওয়ার নির্ধারণ ও প্রেসক্রিপশন।",
    descEn: "Accurate refraction testing and prescription.",
  },
  {
    icon: "💧",
    titleBn: "গ্লুকোমা চিকিৎসা",
    titleEn: "Glaucoma Treatment",
    descBn: "চোখের চাপ পরীক্ষা ও গ্লুকোমার সম্পূর্ণ চিকিৎসা।",
    descEn: "Eye pressure testing and complete glaucoma management.",
  },
  {
    icon: "🧒",
    titleBn: "শিশু চক্ষু চিকিৎসা",
    titleEn: "Pediatric Eye Care",
    descBn: "শিশুদের চোখের সমস্যার বিশেষজ্ঞ চিকিৎসা।",
    descEn: "Specialist eye care for children.",
  },
  {
    icon: "🏥",
    titleBn: "জরুরি চক্ষু সেবা",
    titleEn: "Emergency Eye Care",
    descBn: "চোখের যেকোনো জরুরি সমস্যায় দ্রুত চিকিৎসা সেবা।",
    descEn: "Rapid treatment for any emergency eye condition.",
  },
];

export const DOCTORS = [
  {
    nameBn: "ডা. [নাম]",
    nameEn: "Dr. [Name]",
    designationBn: "চক্ষু বিশেষজ্ঞ ও সার্জন",
    designationEn: "Eye Specialist & Surgeon",
    specialtyBn: "ফ্যাকো ক্যাটারেক্ট সার্জারি",
    specialtyEn: "Phaco Cataract Surgery",
    qualificationBn: "এমবিবিএস, ডিও, এমএস (চক্ষু)",
    qualificationEn: "MBBS, DO, MS (Ophthalmology)",
    image: null as string | null,
    slug: "doctor-1",
  },
  {
    nameBn: "ডা. [নাম]",
    nameEn: "Dr. [Name]",
    designationBn: "চক্ষু বিশেষজ্ঞ",
    designationEn: "Eye Specialist",
    specialtyBn: "রেটিনা ও গ্লুকোমা",
    specialtyEn: "Retina & Glaucoma",
    qualificationBn: "এমবিবিএস, ডিও",
    qualificationEn: "MBBS, DO",
    image: null as string | null,
    slug: "doctor-2",
  },
  {
    nameBn: "ডা. [নাম]",
    nameEn: "Dr. [Name]",
    designationBn: "শিশু চক্ষু বিশেষজ্ঞ",
    designationEn: "Pediatric Eye Specialist",
    specialtyBn: "শিশু চক্ষু চিকিৎসা",
    specialtyEn: "Pediatric Ophthalmology",
    qualificationBn: "এমবিবিএস, ডিও",
    qualificationEn: "MBBS, DO",
    image: null as string | null,
    slug: "doctor-3",
  },
];

export const FACILITIES = [
  { icon: "🏨", titleBn: "আধুনিক অপারেশন থিয়েটার", titleEn: "Modern Operation Theatre" },
  { icon: "🔭", titleBn: "উন্নত ডায়াগনস্টিক যন্ত্রপাতি", titleEn: "Advanced Diagnostic Equipment" },
  { icon: "🛏️", titleBn: "আরামদায়ক ইনডোর সুবিধা", titleEn: "Comfortable Indoor Facility" },
  { icon: "🚑", titleBn: "জরুরি সেবা ২৪/৭", titleEn: "24/7 Emergency Service" },
  { icon: "💊", titleBn: "ইন-হাউস ফার্মেসি", titleEn: "In-house Pharmacy" },
  { icon: "🅿️", titleBn: "পার্কিং সুবিধা", titleEn: "Parking Facility" },
];

export const CARE_STEPS = [
  {
    step: "০১",
    titleBn: "অ্যাপয়েন্টমেন্ট নিন",
    titleEn: "Book Appointment",
    descBn: "ফোনে বা অনলাইনে সহজেই অ্যাপয়েন্টমেন্ট নিন।",
    descEn: "Easily book an appointment by phone or online.",
  },
  {
    step: "০২",
    titleBn: "রেজিস্ট্রেশন করুন",
    titleEn: "Registration",
    descBn: "হাসপাতালে এসে দ্রুত রেজিস্ট্রেশন সম্পন্ন করুন।",
    descEn: "Complete quick registration upon arrival.",
  },
  {
    step: "০৩",
    titleBn: "বিশেষজ্ঞ পরামর্শ",
    titleEn: "Specialist Consultation",
    descBn: "অভিজ্ঞ চক্ষু বিশেষজ্ঞের সাথে পরামর্শ করুন।",
    descEn: "Consult with an experienced eye specialist.",
  },
  {
    step: "০৪",
    titleBn: "চিকিৎসা ও ফলোআপ",
    titleEn: "Treatment & Follow-up",
    descBn: "সর্বোত্তম চিকিৎসা ও নিয়মিত ফলোআপ নিশ্চিত করুন।",
    descEn: "Receive optimal treatment and regular follow-up.",
  },
];

export const TESTIMONIALS = [
  {
    nameBn: "[রোগীর নাম]",
    nameEn: "[Patient Name]",
    locationBn: "শেরপুর",
    locationEn: "Sherpur",
    textBn:
      "এখানে চিকিৎসা নিয়ে আমি সম্পূর্ণ সুস্থ হয়েছি। ডাক্তার ও নার্সরা অত্যন্ত যত্নশীল।",
    textEn:
      "I recovered completely after treatment here. The doctors and nurses are extremely caring.",
    rating: 5,
  },
  {
    nameBn: "[রোগীর নাম]",
    nameEn: "[Patient Name]",
    locationBn: "নালিতাবাড়ী",
    locationEn: "Nalitabari",
    textBn:
      "ফ্যাকো অপারেশনের পর আমার দৃষ্টিশক্তি অনেক ভালো হয়েছে। সেবার মান অত্যন্ত উন্নত।",
    textEn:
      "My vision improved greatly after the phaco surgery. The quality of care is excellent.",
    rating: 5,
  },
  {
    nameBn: "[রোগীর নাম]",
    nameEn: "[Patient Name]",
    locationBn: "ঝিনাইগাতী",
    locationEn: "Jhenaigati",
    textBn: "আধুনিক যন্ত্রপাতি ও দক্ষ চিকিৎসক দল। শেরপুরে এত ভালো চক্ষু হাসপাতাল আগে ছিল না।",
    textEn:
      "Modern equipment and skilled medical team. Sherpur never had such a good eye hospital before.",
    rating: 5,
  },
];

export const ARTICLES = [
  {
    titleBn: "ছানি পড়লে কী করবেন?",
    titleEn: "What to Do When You Have Cataracts?",
    excerptBn: "ছানি চোখের একটি সাধারণ সমস্যা। সঠিক সময়ে চিকিৎসা নিলে সম্পূর্ণ সুস্থ হওয়া সম্ভব।",
    excerptEn:
      "Cataracts are a common eye problem. With timely treatment, complete recovery is possible.",
    date: "২০২৬",
    slug: "cataract-guide",
    category: { bn: "ছানি", en: "Cataract" },
  },
  {
    titleBn: "শিশুর চোখের যত্ন কীভাবে নেবেন",
    titleEn: "How to Take Care of Your Child's Eyes",
    excerptBn: "শিশুদের চোখের সমস্যা প্রাথমিক পর্যায়ে ধরা পড়লে সহজেই চিকিৎসা করা যায়।",
    excerptEn: "Children's eye problems are easily treatable when detected early.",
    date: "২০২৬",
    slug: "child-eye-care",
    category: { bn: "শিশু স্বাস্থ্য", en: "Child Health" },
  },
  {
    titleBn: "গ্লুকোমা: নীরব দৃষ্টিনাশক রোগ",
    titleEn: "Glaucoma: The Silent Vision Thief",
    excerptBn: "গ্লুকোমা প্রায়ই কোনো লক্ষণ ছাড়াই দৃষ্টিশক্তি নষ্ট করে দেয়। নিয়মিত পরীক্ষা জরুরি।",
    excerptEn:
      "Glaucoma often destroys vision without any symptoms. Regular check-ups are essential.",
    date: "২০২৬",
    slug: "glaucoma-awareness",
    category: { bn: "গ্লুকোমা", en: "Glaucoma" },
  },
];
