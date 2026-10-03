"use client";

import { useDoctors } from "@/hooks/useDoctors";
import { DoctorCard } from "./DoctorCard";
import { DoctorCardSkeleton } from "./DoctorSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export function DoctorList() {
  const { data: doctors, loading, error } = useDoctors();

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!doctors || doctors.length === 0) {
    return (
      <EmptyState
        icon="👨⚕️"
        titleBn="কোনো চিকিৎসক পাওয়া যায়নি"
        titleEn="No doctors found"
        descBn="এই মুহূর্তে চিকিৎসকদের তথ্য পাওয়া যাচ্ছে না। শীঘ্রই যুক্ত করা হবে।"
        descEn="Doctor information is not available at this time. Will be added soon."
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
