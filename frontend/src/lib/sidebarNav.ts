import { UserRole } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: UserRole[];        // if set, only these roles see it
  permission?: string;       // if set, user needs this permission (admins bypass)
  children?: NavItem[];
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
      { href: "/dashboard/doctors",    label: "চিকিৎসক",    icon: "Stethoscope",  permission: "doctors.view" },
      { href: "/dashboard/employees",  label: "কর্মচারী",   icon: "Users",        roles: ["SUPER_ADMIN","ADMIN","HR"] },
      { href: "/dashboard/attendance", label: "উপস্থিতি",   icon: "CalendarCheck", roles: ["SUPER_ADMIN","ADMIN","HR"] },
      { href: "/dashboard/leave",      label: "ছুটি",        icon: "CalendarOff" },
    ],
  },
  {
    group: "রোগী সেবা",
    items: [
      { href: "/dashboard/clinic",       label: "ক্লিনিক",           icon: "Stethoscope",  roles: ["DOCTOR","SUPER_ADMIN","ADMIN"] },
      { href: "/dashboard/patients",     label: "রোগী",             icon: "UserRound",    roles: ["SUPER_ADMIN","ADMIN","HR","DOCTOR","RECEPTION"] },
      { href: "/dashboard/appointments", label: "অ্যাপয়েন্টমেন্ট", icon: "CalendarDays", permission: "appointments.view" },
      { href: "/dashboard/prescriptions",          label: "প্রেসক্রিপশন",   icon: "FileText",     roles: ["SUPER_ADMIN","ADMIN","DOCTOR","RECEPTION"] },
      { href: "/dashboard/prescriptions/templates",  label: "Rx টেমপ্লেট",   icon: "BookTemplate", roles: ["SUPER_ADMIN","ADMIN","DOCTOR"] },
    ],
  },
  {
    group: "অর্থ ব্যবস্থাপনা",
    items: [
      { href: "/dashboard/billing",   label: "বিলিং",   icon: "Receipt",      roles: ["SUPER_ADMIN","ADMIN","ACCOUNTANT","RECEPTION"] },
      { href: "/dashboard/income",    label: "আয়",      icon: "TrendingUp",   roles: ["SUPER_ADMIN","ADMIN","ACCOUNTANT"] },
      { href: "/dashboard/expenses",  label: "ব্যয়",    icon: "TrendingDown", roles: ["SUPER_ADMIN","ADMIN","ACCOUNTANT"] },
    ],
  },
  {
    group: "অপারেশন",
    items: [
      { href: "/dashboard/inventory", label: "ইনভেন্টরি",  icon: "Package",    roles: ["SUPER_ADMIN","ADMIN","ACCOUNTANT","DOCTOR","RECEPTION"] },
      { href: "/dashboard/surgery",   label: "সার্জারি/OT", icon: "Scissors",   roles: ["SUPER_ADMIN","ADMIN","DOCTOR"] },
      { href: "/dashboard/reports",   label: "রিপোর্ট",    icon: "BarChart2",  roles: ["SUPER_ADMIN","ADMIN","ACCOUNTANT"] },
    ],
  },
  {
    group: "কন্টেন্ট",
    items: [
      { href: "/dashboard/cms",     label: "ওয়েবসাইট CMS", icon: "Globe",     roles: ["SUPER_ADMIN","ADMIN"] },
      { href: "/dashboard/news",    label: "সংবাদ",        icon: "Newspaper", permission: "news.manage" },
      { href: "/dashboard/gallery", label: "গ্যালারি",     icon: "Image",     permission: "gallery.manage" },
    ],
  },
  {
    group: "সিস্টেম",
    items: [
      { href: "/dashboard/users",                   label: "ব্যবহারকারী",          icon: "ShieldCheck",   roles: ["SUPER_ADMIN","ADMIN"] },
      { href: "/dashboard/audit",                   label: "অডিট লগ",              icon: "ClipboardList", roles: ["SUPER_ADMIN","ADMIN"] },
      { href: "/dashboard/settings",                label: "সেটিংস",              icon: "Settings",      roles: ["SUPER_ADMIN","ADMIN"] },
      { href: "/dashboard/settings/prescription",   label: "Rx সেটিংস",           icon: "FileText",      roles: ["SUPER_ADMIN","ADMIN"] },
    ],
  },
];
