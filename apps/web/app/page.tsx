import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { Footer } from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-stone-900">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}