export interface NavLink {
  href:    string;
  bn:      string;
  en:      string;
  iconKey: string; // key in HospitalSettings for the nav icon image
}

export const NAV_LINKS: NavLink[] = [
  { href: "/",           bn: "হোম",               en: "Home",        iconKey: "nav_icon_home" },
  { href: "/about",      bn: "আমাদের সম্পর্কে",  en: "About",       iconKey: "nav_icon_about" },
  { href: "/doctors",    bn: "ডাক্তার",            en: "Doctors",     iconKey: "nav_icon_doctors" },
  { href: "/services",   bn: "সেবাসমূহ",           en: "Services",    iconKey: "nav_icon_services" },
  { href: "/appointment",bn: "অ্যাপয়েন্টমেন্ট",  en: "Appointment", iconKey: "nav_icon_appointment" },
  { href: "/gallery",    bn: "গ্যালারি",            en: "Gallery",     iconKey: "nav_icon_gallery" },
  { href: "/news",       bn: "সংবাদ",              en: "News",        iconKey: "nav_icon_news" },
  { href: "/contact",    bn: "যোগাযোগ",            en: "Contact",     iconKey: "nav_icon_contact" },
];
