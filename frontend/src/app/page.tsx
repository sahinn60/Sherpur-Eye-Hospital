import { PublicLayout } from "@/components/layout";
import {
  HeroSection,
  LiveSerialSection,
  ServicesSection,
  StatsSection,
  DoctorsSection,
  CareProcessSection,
  ContactCTA,
  MapSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <LiveSerialSection />
      <ServicesSection />
      <StatsSection />
      <DoctorsSection />
      <CareProcessSection />
      <ContactCTA />
      <MapSection />
    </PublicLayout>
  );
}
