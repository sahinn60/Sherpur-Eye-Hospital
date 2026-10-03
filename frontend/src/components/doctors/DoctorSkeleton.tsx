// Skeleton card for doctor listing
export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gray-200 h-56" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-8 bg-gray-200 rounded-lg mt-4" />
      </div>
    </div>
  );
}

// Skeleton for doctor profile page
export function DoctorProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-200 rounded-2xl h-80" />
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-24 bg-gray-200 rounded mt-4" />
          <div className="h-10 bg-gray-200 rounded-xl w-48 mt-4" />
        </div>
      </div>
    </div>
  );
}
