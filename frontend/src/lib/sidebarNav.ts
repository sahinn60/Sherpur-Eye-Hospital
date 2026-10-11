import { UserRole } from "@/types";

export interface NavItem {
  href:       string;
  label:      string;
  icon:       string;
  permKey?:   string;      // permission key — SUPER_ADMIN bypasses, others need it assigned
  alsoAllow?: UserRole[];  // roles that always see this item regardless of permission
  children?:  NavItem[];
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const SIDEBAR_NAV: NavGroup[] = [
  {
    group: "প্রধান",
    items: [
      { href: "/dashboard", label: "ড্যাশবোর্ড", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "কর্মী ব্যবস্থাপনা",
    items: [
      { href: "/dashboard/doctors",    label: "চিকিৎসক",   icon: "Stethoscope",   permKey: "nav.doctors" },
      { href: "/dashboard/employees",  label: "কর্মচারী",  icon: "Users",         permKey: "nav.employees" },
      { href: "/dashboard/attendance", label: "উপস্থিতি",  icon: "CalendarCheck", permKey: "nav.attendance" },
      { href: "/dashboard/leave",      label: "ছুটি",       icon: "CalendarOff",   permKey: "nav.leave" },
    ],
  },
  {
    group: "রোগী সেবা",
    items: [
      { href: "/dashboard/clinic",                      label: "ক্লিনিক",           icon: "Stethoscope",  permKey: "nav.clinic",            alsoAllow: ["DOCTOR"] },
      { href: "/dashboard/patients",                    label: "রোগী",              icon: "UserRound",    permKey: "nav.patients" },
      { href: "/dashboard/appointments",                label: "অ্যাপয়েন্টমেন্ট",  icon: "CalendarDays", permKey: "nav.appointments" },
      { href: "/dashboard/prescriptions",               label: "প্রেসক্রিপশন",      icon: "FileText",     permKey: "nav.prescriptions",     alsoAllow: ["DOCTOR"] },
      { href: "/dashboard/prescriptions/templates",     label: "Rx টেমপ্লেট",      icon: "BookTemplate", permKey: "nav.rx_templates",      alsoAllow: ["DOCTOR"] },
    ],
  },
  {
    group: "অর্থ ব্যবস্থাপনা",
    items: [
      { href: "/dashboard/billing",  label: "বিলিং", icon: "Receipt",      permKey: "nav.billing" },
      { href: "/dashboard/income",   label: "আয়",    icon: "TrendingUp",   permKey: "nav.income" },
      { href: "/dashboard/expenses", label: "ব্যয়",  icon: "TrendingDown", permKey: "nav.expenses" },
    ],
  },
  {
    group: "অপারেশন",
    items: [
      { href: "/dashboard/inventory", label: "ইনভেন্টরি",   icon: "Package",   permKey: "nav.inventory" },
      { href: "/dashboard/surgery",   label: "সার্জারি/OT",  icon: "Scissors",  permKey: "nav.surgery",  alsoAllow: ["DOCTOR"] },
      { href: "/dashboard/reports",   label: "রিপোর্ট",     icon: "BarChart2", permKey: "nav.reports" },
    ],
  },
  {
    group: "কন্টেন্ট",
    items: [
      { href: "/dashboard/cms",     label: "ওয়েবসাইট CMS", icon: "Globe",     permKey: "nav.cms" },
      { href: "/dashboard/news",    label: "সংবাদ",         icon: "Newspaper", permKey: "nav.news" },
      { href: "/dashboard/gallery", label: "গ্যালারি",      icon: "Image",     permKey: "nav.gallery" },
    ],
  },
  {
    group: "সিস্টেম",
    items: [
      { href: "/dashboard/users",                 label: "ব্যবহারকারী", icon: "ShieldCheck",   permKey: "nav.users" },
      { href: "/dashboard/audit",                 label: "অডিট লগ",     icon: "ClipboardList", permKey: "nav.audit" },
      { href: "/dashboard/settings",              label: "সেটিংস",      icon: "Settings",      permKey: "nav.settings" },
      { href: "/dashboard/settings/prescription", label: "Rx সেটিংস",   icon: "FileText",      permKey: "nav.rx_settings" },
    ],
  },
];

// Flat list of all permKeys with labels — used in permission modal
export const ALL_NAV_PERMISSIONS = SIDEBAR_NAV.flatMap((g) =>
  g.items
    .filter((i) => i.permKey)
    .map((i) => ({ key: i.permKey!, label: i.label, group: g.group }))
);
