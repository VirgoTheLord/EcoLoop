"use client";

import { useCallback, useRef } from "react";
import HorizontalLayout from "@/components/HorizontalLayout";
import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import TimelinePanel from "@/components/TimelinePanel";
import ProductsPanel from "@/components/ProductsPanel";
import "./home.css";

export default function Home() {
  // About panel progress handler
  const dwellHandlerRef = useRef<((p: number) => void) | null>(null);
  const handleRegisterAbout = useCallback((handler: (p: number) => void) => {
    dwellHandlerRef.current = handler;
  }, []);
  const handleDwellProgress = useCallback((progress: number) => {
    dwellHandlerRef.current?.(progress);
  }, []);

  // Timeline panel progress handler
  const timelineHandlerRef = useRef<((p: number) => void) | null>(null);
  const handleRegisterTimeline = useCallback((handler: (p: number) => void) => {
    timelineHandlerRef.current = handler;
  }, []);
  const handleTimelineProgress = useCallback((progress: number) => {
    timelineHandlerRef.current?.(progress);
  }, []);

  return (
    <HorizontalLayout
      aboutDwell={4}
      timelineDwell={0}
      onDwellProgress={handleDwellProgress}
      onTimelineProgress={handleTimelineProgress}
    >
      <Hero />
      <AboutPanel onRegister={handleRegisterAbout} />
      <TimelinePanel onRegister={handleRegisterTimeline} />
      <ProductsPanel />
    </HorizontalLayout>
  );
}