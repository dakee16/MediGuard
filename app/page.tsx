import { MarketingNav } from "../components/nav/marketing-nav";
import { Hero } from "../components/home/hero";
import { Features } from "../components/home/features";
import { HowItWorks } from "../components/home/how-it-works";
import { Testimonials } from "../components/home/testimonials";
import { Footer, FooterCTA } from "../components/home/footer";

export default function HomePage() {
  return (
    <main className="relative bg-ink-50">
      <MarketingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FooterCTA />
      <Footer />
    </main>
  );
}
