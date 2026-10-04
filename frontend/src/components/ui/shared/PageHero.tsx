// Reusable page hero banner used across all public inner pages
interface PageHeroProps {
  tag: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  bgImage?: string;
}

import Link from "next/link";

export function PageHero({ tag, title, subtitle, breadcrumbs, bgImage }: PageHeroProps) {
  return (
    <section
      className="text-white py-10 sm:py-14 md:py-20 relative overflow-hidden"
      style={
        bgImage
          ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {/* Gradient background (shown when no image) */}
      {!bgImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
      )}

      {/* Dark overlay when image is set */}
      {bgImage && <div className="absolute inset-0 bg-primary-900/70" />}

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 hidden sm:block pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-primary-300 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        {breadcrumbs && (
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-primary-300 text-xs sm:text-sm mb-4">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 sm:gap-2">
                {i > 0 && <span className="text-primary-500">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <span className="inline-block bg-primary-600/60 border border-primary-400/40 text-primary-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 sm:mb-4">
          {tag}
        </span>
        <h1
          className="font-bold leading-tight max-w-3xl"
          style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-primary-200 text-sm sm:text-lg mt-3 sm:mt-4 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40L1440 40L1440 15C1200 40 960 0 720 15C480 30 240 0 0 15L0 40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
