export interface ScheduleSlot {
  dayBn:  string;
  dayEn:  string;
  timeBn: string;
  timeEn: string;
}

// Public-facing doctor (no sensitive fields)
export interface Doctor {
  id:              string;
  nameBn:          string;
  nameEn:          string;
  photo:           string | null;
  designationBn:   string;
  designationEn:   string;
  qualificationBn: string;
  qualificationEn: string;
  specialtyBn:     string;
  specialtyEn:     string;
  specializations: string[];
  experienceBn:    string;
  experienceEn:    string;
  biographyBn:     string | null;
  biographyEn:     string | null;
  consultationFee: number;
  availableDays:   string[];
  chamberSchedule: string | null;
  schedule:        ScheduleSlot[];
  sortOrder:       number;
  isActive:        boolean;
}

// Admin-facing doctor (includes sensitive + user account)
export interface DoctorAdmin extends Doctor {
  phone:       string | null;
  email:       string | null;
  gender:      "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string | null;
  joiningDate: string;
  createdAt:   string;
  updatedAt:   string;
  user: {
    id:          string;
    email:       string;
    role:        string;
    isActive:    boolean;
    lastLoginAt: string | null;
  } | null;
}

export interface DoctorListResponse {
  items:      DoctorAdmin[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface DoctorFilters {
  search?:   string;
  isActive?: string;
  page?:     number;
  limit?:    number;
}
