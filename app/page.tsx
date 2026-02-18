import HorizontalLayout from "@/components/HorizontalLayout";
import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import "./home.css";

export default function Home() {
  return (
    <HorizontalLayout>
      <Hero />
      <AboutPanel />
      {/* Add new panels here — each should be w-screen h-screen flex-shrink-0 */}
    </HorizontalLayout>
  );
}