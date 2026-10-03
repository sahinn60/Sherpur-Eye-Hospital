// Reusable icon card used across multiple sections
interface IconCardProps {
  icon: string;
  title: string;
  description: string;
  variant?: "default" | "bordered" | "filled";
}

import { cn } from "@/lib/utils";

export function IconCard({ icon, title, description, variant = "default" }: IconCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all",
        variant === "default" &&
          "bg-white border border-gray-100 hover:border-primary-200 hover:shadow-md",
        variant === "bordered" &&
          "border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30",
        variant === "filled" && "bg-primary-50 hover:bg-primary-100"
      )}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
