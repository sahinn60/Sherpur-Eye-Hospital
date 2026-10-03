// Reusable section header used across all public pages
interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ tag, title, subtitle, align = "center" }: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div className={`mb-12 ${isCenter ? "text-center max-w-2xl mx-auto" : ""}`}>
      <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 mt-3 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
