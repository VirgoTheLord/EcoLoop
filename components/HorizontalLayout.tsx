"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  /**
   * Multiplier for how long the dwell (pause) lasts at the AboutPanel.
   * Higher = more scroll distance before moving on. Default: 3
   */
  aboutDwell?: number;
  /**
   * Callback fired on every scrub update with the dwell progress (0→1).
   * AboutPanel uses this to drive its word-fill animation.
   */
  onDwellProgress?: (progress: number) => void;
}

export default function HorizontalLayout({
  children,
  aboutDwell = 3,
  onDwellProgress,
}: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    requestAnimationFrame(() => {
      const vw       = window.innerWidth;
      const dist     = track.scrollWidth - vw;

      // Where the AboutPanel (2nd child) starts
      const aboutEl   = track.children[1] as HTMLElement | undefined;
      const aboutLeft = aboutEl ? aboutEl.offsetLeft : dist;

      // Extra scroll distance for the dwell
      const dwellDist = aboutDwell * vw;

      // ── Master timeline ──────────────────────────────────────────────
      // Segment 1: move Hero → About
      // Segment 2: dwell (track frozen, timeline progresses)
      // Segment 3: move About → end
      const tl = gsap.timeline({
        onUpdate() {
          if (!onDwellProgress) return;
          const totalDur  = tl.duration();
          const seg1Dur   = aboutLeft;
          const seg2Dur   = dwellDist;
          const elapsed   = tl.time();
          // Clamp progress to the dwell segment only
          const dwellProgress = gsap.utils.clamp(
            0, 1,
            (elapsed - seg1Dur) / seg2Dur
          );
          onDwellProgress(dwellProgress);
        },
      });

      // Segment 1
      tl.to(track, { x: -aboutLeft, ease: "none", duration: aboutLeft });
      // Segment 2 — dwell, no movement
      tl.to({}, { duration: dwellDist }, ">");
      // Segment 3
      const remaining = dist - aboutLeft;
      if (remaining > 0) {
        tl.to(track, { x: -dist, ease: "none", duration: remaining }, ">");
      }

      ScrollTrigger.create({
        id: "horizontal",
        animation: tl,
        trigger: wrap,
        start: "top top",
        end: () => `+=${dist + dwellDist}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} className="overflow-hidden w-screen h-screen">
      <div ref={trackRef} className="flex h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
