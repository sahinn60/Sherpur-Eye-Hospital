export interface SiteSetting {
  key:      string;
  value:    string;
  group:    string;
  labelBn:  string;
  labelEn:  string;
  type:     "text" | "textarea" | "url" | "image";
}

export interface SiteSettingsMap {
  [key: string]: string;
}

export interface SiteSettingsGrouped {
  [group: string]: SiteSetting[];
}

export interface HomepageSection {
  id:        string;
  key:       string;
  labelBn:   string;
  labelEn:   string;
  isVisible: boolean;
  sortOrder: number;
}

export interface Notice {
  id:        string;
  textBn:    string;
  textEn:    string;
  link:      string | null;
  isActive:  boolean;
  sortOrder: number;
  expiresAt: string | null;
  createdAt: string;
}

// Convenience: typed keys for the settings we use in components
export interface HospitalSettings {
  hospital_name_bn: string;
  hospital_name_en: string;
  logo_url:         string;
  tagline_bn:       string;
  tagline_en:       string;
  phone:            string;
  emergency:        string;
  email:            string;
  address_bn:       string;
  address_en:       string;
  map_embed_url:    string;
  hours_bn:         string;
  hours_en:         string;
  friday_bn:        string;
  friday_en:        string;
  social_facebook:  string;
  social_youtube:   string;
  social_instagram: string;
  hero_badge_bn:    string;
  hero_badge_en:    string;
  hero_title_bn:    string;
  hero_title_en:    string;
  hero_desc_bn:     string;
  hero_desc_en:     string;
  hero_image_url:   string;
  stat1_value_bn:   string;
  stat1_value_en:   string;
  stat1_label_bn:   string;
  stat1_label_en:   string;
  stat2_value_bn:   string;
  stat2_value_en:   string;
  stat2_label_bn:   string;
  stat2_label_en:   string;
  stat3_value_bn:   string;
  stat3_value_en:   string;
  stat3_label_bn:   string;
  stat3_label_en:   string;
  stat4_value_bn:   string;
  stat4_value_en:   string;
  stat4_label_bn:   string;
  stat4_label_en:   string;
  about_title_bn:   string;
  about_title_en:   string;
  about_desc_bn:    string;
  about_desc_en:    string;
  about_mission_bn: string;
  about_mission_en: string;
  about_vision_bn:  string;
  about_vision_en:  string;
  about_main_image:  string;
  about_env_image_1: string;
  about_env_image_2: string;
  about_env_image_3: string;
  about_env_image_4: string;
  about_gallery_1:   string;
  about_gallery_2:   string;
  about_gallery_3:   string;
  about_gallery_4:   string;
  about_gallery_5:   string;
  about_gallery_6:   string;
  about_founded_bn:     string;
  about_founded_en:     string;
  about_location_bn:    string;
  about_location_en:    string;
  about_tag_bn:         string;
  about_tag_en:         string;
  about_intro_title_bn: string;
  about_intro_title_en: string;
  about_para1_bn:       string;
  about_para1_en:       string;
  about_para2_bn:       string;
  about_para2_en:       string;
  hero_about_image:       string;
  hero_appointment_image: string;
  hero_doctors_image:     string;
  hero_gallery_image:     string;
  hero_services_image:    string;
  hero_news_image:        string;
  hero_contact_image:     string;
  // Home icons
  icon_service_1: string; icon_service_2: string; icon_service_3: string;
  icon_service_4: string; icon_service_5: string; icon_service_6: string;
  icon_why_1: string; icon_why_2: string; icon_why_3: string;
  icon_why_4: string; icon_why_5: string; icon_why_6: string;
  icon_facility_1: string; icon_facility_2: string; icon_facility_3: string;
  icon_facility_4: string; icon_facility_5: string; icon_facility_6: string;
  // About icons
  icon_mission: string; icon_vision: string;
  icon_value_1: string; icon_value_2: string; icon_value_3: string;
  icon_value_4: string; icon_value_5: string; icon_value_6: string;
  icon_care_1: string; icon_care_2: string; icon_care_3: string; icon_care_4: string;
  icon_equip_1: string; icon_equip_2: string; icon_equip_3: string;
  icon_equip_4: string; icon_equip_5: string; icon_equip_6: string;
  icon_contact_1: string; icon_contact_2: string; icon_contact_3: string;
  icon_contact_4: string; icon_contact_5: string; icon_contact_6: string;
  // Nav icons
  nav_icon_home:        string;
  nav_icon_about:       string;
  nav_icon_doctors:     string;
  nav_icon_services:    string;
  nav_icon_appointment: string;
  nav_icon_gallery:     string;
  nav_icon_news:        string;
  nav_icon_contact:     string;
  [key: string]:    string;
}
