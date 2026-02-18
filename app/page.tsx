"use client";

import { useCallback, useRef } from "react";
import HorizontalLayout from "@/components/HorizontalLayout";
import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import "./home.css";

export default function Home() {
  // Holds the AboutPanel's progress handler once it registers
  const dwellHandlerRef = useRef<((p: number) => void) | null>(null);

  // AboutPanel calls this to register its handler
  const handleRegister = useCallback((handler: (p: number) => void) => {
    dwellHandlerRef.current = handler;
  }, []);

  // HorizontalLayout calls this on every scrub tick with dwell progress 0→1
  const handleDwellProgress = useCallback((progress: number) => {
    dwellHandlerRef.current?.(progress);
  }, []);

  return (
    <HorizontalLayout aboutDwell={4} onDwellProgress={handleDwellProgress}>
      <Hero />
      <AboutPanel onRegister={handleRegister} />
    </HorizontalLayout>
  );
}