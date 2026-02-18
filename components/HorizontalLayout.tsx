"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  /**
   * Extra scroll distance (in vw multiples) for the About dwell. Default: 4
   */
  aboutDwell?: number;
  /**
   * Extra scroll distance (in vw multiples) for the Timeline dwell. Default: 2
   * This gives the user time to read the last timeline entry before the scroll ends.
   */
  timelineDwell?: number;
  /** Fired with About dwell progress 0→1 */
  onDwellProgress?: (progress: number) => void;
  /** Fired with Timeline scroll progress 0→1 */
  onTimelineProgress?: (progress: number) => void;
}

export default function HorizontalLayout({
  children,
  aboutDwell    = 4,
  timelineDwell = 0,
  onDwellProgress,
  onTimelineProgress,
}: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    requestAnimationFrame(() => {
      const vw   = window.innerWidth;
      // Total pixels needed to scroll the track to its end
      const dist = track.scrollWidth - vw;

      // Panel offsets
      const aboutEl      = track.children[1] as HTMLElement | undefined;
      const aboutLeft    = aboutEl ? aboutEl.offsetLeft : vw;

      const timelineEl    = track.children[2] as HTMLElement | undefined;
      const timelineLeft  = timelineEl ? timelineEl.offsetLeft : vw * 2;
      const timelineWidth = timelineEl ? timelineEl.scrollWidth : vw * 3;

      const productsEl    = track.children[3] as HTMLElement | undefined;
      const productsWidth = productsEl ? productsEl.scrollWidth : 0;

      // Extra dwell distances
      const dwellAbout    = aboutDwell    * vw;
      const dwellTimeline = timelineDwell * vw;

      // ── Segment durations ──────────────────────────────────────────────
      // Seg 1: Hero → About (track moves aboutLeft px)
      const seg1 = aboutLeft;
      // Seg 2: About dwell (track frozen)
      const seg2 = dwellAbout;
      // Seg 3: About → Timeline start (track moves timelineLeft - aboutLeft px)
      const seg3 = timelineLeft - aboutLeft;
      // Seg 4: Timeline scroll (track moves timelineWidth - vw px = 2vw)
      const seg4 = timelineWidth - vw;
      // Seg 5: Timeline dwell at end (track frozen)
      const seg5 = dwellTimeline;
      // Seg 6: Scroll to Products (track moves productsWidth px)
      // Note: If productsWidth is 100vw, we scroll 100vw to bring it fully into view.
      const seg6 = productsWidth;

      // ── Master GSAP timeline ───────────────────────────────────────────
      const tl = gsap.timeline({
        onUpdate() {
          const t = tl.time();

          // About dwell progress (0→1 during seg2)
          if (onDwellProgress) {
            onDwellProgress(gsap.utils.clamp(0, 1, (t - seg1) / seg2));
          }

          // Timeline scroll progress (0→1 during seg4)
          // Note: seg4 duration depends on timelineWidth.
          if (onTimelineProgress) {
            const tlStart = seg1 + seg2 + seg3;
            onTimelineProgress(gsap.utils.clamp(0, 1, (t - tlStart) / seg4));
          }
        },
      });

      // Seg 1 — scroll Hero → About
      tl.to(track, { x: -aboutLeft, ease: "none", duration: seg1 });
      // Seg 2 — dwell at About
      tl.to({}, { duration: seg2 }, ">");
      // Seg 3 — scroll About → Timeline
      tl.to(track, { x: -timelineLeft, ease: "none", duration: seg3 }, ">");
      // Seg 4 — scroll through Timeline
      tl.to(track, { x: -(timelineLeft + seg4), ease: "none", duration: seg4 }, ">");
      // Seg 5 — dwell at end of Timeline
      tl.to({}, { duration: seg5 }, ">");
      
      // Seg 6 — scroll to Products (if exists)
      if (seg6 > 0) {
        // Target: Current Pos - seg6
        // Current Pos = -(timelineLeft + seg4)
        // Target = -(timelineLeft + seg4 + seg6)
        tl.to(track, { 
          x: -(timelineLeft + seg4 + seg6), 
          ease: "none", 
          duration: seg6 
        }, ">");
      }

      ScrollTrigger.create({
        id: "horizontal",
        animation: tl,
        trigger: wrap,
        start: "top top",
        end: () => `+=${dist + dwellAbout + dwellTimeline + seg6}`, // Add seg6 distance
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
