import { prisma } from "../config/database";

export interface SettingsInput {
  officeStartTime?:      string;
  officeEndTime?:        string;
  gracePeriodMinutes?:   number;
  lateThresholdMinutes?: number;
  earlyCheckoutMinutes?: number;
  workingDays?:          string[];
  weekends?:             string[];
}

export async function getSettings() {
  return prisma.attendanceSettings.upsert({
    where:  { id: "default" },
    update: {},
    create: { id: "default" },
  });
}

export async function updateSettings(input: SettingsInput) {
  return prisma.attendanceSettings.upsert({
    where:  { id: "default" },
    update: { ...input },
    create: { id: "default", ...input },
  });
}
