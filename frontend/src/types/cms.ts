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
  [key: string]:    string;
}
