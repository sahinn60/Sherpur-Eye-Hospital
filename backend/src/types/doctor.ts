export interface ScheduleSlot {
  dayBn: string;
  dayEn: string;
  timeBn: string;
  timeEn: string;
}

export interface DoctorPublic {
  id: string;
  nameBn: string;
  nameEn: string;
  designationBn: string;
  designationEn: string;
  qualificationBn: string;
  qualificationEn: string;
  specialtyBn: string;
  specialtyEn: string;
  experienceBn: string;
  experienceEn: string;
  biographyBn: string | null;
  biographyEn: string | null;
  photo: string | null;
  schedule: ScheduleSlot[];
}
