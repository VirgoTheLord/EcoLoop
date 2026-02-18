"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ProductsPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Optional: Animate products in?
    // For now, simple reveal.
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0 h-screen flex items-center justify-center overflow-hidden"
      style={{ width: "100vw", background: "var(--base-100)" }}
    >

      
      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="z-10 text-center">
        <h2 
          className="text-6xl md:text-8xl font-bold tracking-tighter uppercase text-base-500 mb-6"
          style={{ fontFamily: "var(--font-rostex, sans-serif)" }}
        >
          Our<br/> Products
        </h2>
        <p className="text-base-300 text-xl max-w-2xl mx-auto px-6 font-primary">
          Closing the loop with sustainable solutions for every sector.
        </p>
      </div>
    </div>
  );
}
