"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
}

/**
 * HorizontalLayout
 * ─────────────────
 * Wraps any number of child panels in a horizontal scroll driven by
 * GSAP ScrollTrigger. Each child should be w-screen h-screen flex-shrink-0.
 *
 * Usage in page.tsx:
 *   <HorizontalLayout>
 *     <Hero />
 *     <SomeOtherPanel />
 *     <AnotherPanel />
 *   </HorizontalLayout>
 */
export default function HorizontalLayout({ children }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // Total horizontal distance to travel
    const dist = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: -dist,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: () => `+=${dist}`,
        pin: true,          // pins wrap in viewport
        scrub: 1,           // scroll drives animation, 1s smoothing
        anticipatePin: 1,
        invalidateOnRefresh: true, // recalculates on window resize
      },
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, { scope: wrapRef });

  return (
    /* Outer wrapper — this is what ScrollTrigger pins */
    <div ref={wrapRef} className="overflow-hidden w-screen h-screen">

      {/* Track — children sit side by side here */}
      <div ref={trackRef} className="flex h-full will-change-transform">
        {children}
      </div>

    </div>
  );
}
