import { PublicLayout } from "@/components/layout";
import {
  HeroSection,
  IntroSection,
  ServicesSection,
  PhacoBanner,
  WhyChooseSection,
  DoctorsSection,
  FacilitiesSection,
  CareProcessSection,
  StatsSection,
  TestimonialsSection,
  ArticlesSection,
  GallerySection,
  ContactCTA,
  MapSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <PhacoBanner />
      <WhyChooseSection />
      <StatsSection />
      <DoctorsSection />
      <FacilitiesSection />
      <CareProcessSection />
      <TestimonialsSection />
      <ArticlesSection />
      <GallerySection />
      <ContactCTA />
      <MapSection />
    </PublicLayout>
  );
}
