import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how-it-works";
import { TemplatePreview } from "@/components/template-preview";
import { Community } from "@/components/community";
import { Footer } from "@/components/footer";
import { CliShowcase } from "@/components/showcase/showcase";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <HowItWorks />
        <CliShowcase />
        <TemplatePreview />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
