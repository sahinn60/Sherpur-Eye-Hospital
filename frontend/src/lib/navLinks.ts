export interface NavLink {
  href: string;
  bn: string;
  en: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", bn: "হোম", en: "Home" },
  { href: "/about", bn: "আমাদের সম্পর্কে", en: "About" },
  { href: "/doctors", bn: "ডাক্তার", en: "Doctors" },
  { href: "/services", bn: "সেবাসমূহ", en: "Services" },
  { href: "/appointment", bn: "অ্যাপয়েন্টমেন্ট", en: "Appointment" },
  { href: "/gallery", bn: "গ্যালারি", en: "Gallery" },
  { href: "/news", bn: "সংবাদ", en: "News" },
  { href: "/contact", bn: "যোগাযোগ", en: "Contact" },
];
