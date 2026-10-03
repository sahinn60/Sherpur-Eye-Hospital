interface DoctorPhotoProps {
  photo: string | null;
  name: string;
  className?: string;
}

export function DoctorPhoto({ photo, name, className = "" }: DoctorPhotoProps) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`w-full h-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 ${className}`}>
      <div className="w-20 h-20 rounded-full bg-primary-200 flex items-center justify-center mb-2">
        <span className="text-4xl">👨⚕️</span>
      </div>
      <p className="text-primary-400 text-xs">{name}</p>
    </div>
  );
}
