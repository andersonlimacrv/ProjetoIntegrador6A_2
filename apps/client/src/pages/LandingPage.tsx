import { motion } from "framer-motion";
import { Navbar } from "@/components/pages/landing/Navbar";
import { HeroSection } from "@/components/pages/landing/HeroSection";
import { FeaturesSection } from "@/components/pages/landing/FeaturesSection";
import { MetricsSection } from "@/components/pages/landing/MetricsSection";
import { DashboardPreview } from "@/components/pages/landing/DashboardPreview";
import { CTASection } from "@/components/pages/landing/CTASection";
import { Footer } from "@/components/pages/landing/Footer";

export function LandingPage() {
  return (
    <div className="bg-[#1C1C1C]">
      <div className="min-h-screen bg-gradient-to-br from-slate-900/10 via-purple-900/30 to-slate-900 overflow-x-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-5" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Navbar />
          <HeroSection />
          <FeaturesSection />
          <MetricsSection />
          <DashboardPreview />
          <CTASection />
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;
