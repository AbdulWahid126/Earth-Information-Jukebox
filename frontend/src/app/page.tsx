import HeroSection from '@/components/home/HeroSection';
import ExperiencePreview from '@/components/home/ExperiencePreview';
import FeaturedExperiences from '@/components/home/FeaturedExperiences';
import HowItWorks from '@/components/home/HowItWorks';
import AccessibilitySection from '@/components/home/AccessibilitySection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExperiencePreview />
      <FeaturedExperiences />
      <HowItWorks />
      <AccessibilitySection />
    </>
  );
}
