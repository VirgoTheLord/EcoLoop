"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

const aboutText =
  "Ecoloop is built on the belief that sustainability is not a sacrifice — it is a smarter way to live.";

interface Props {
  /** Called by HorizontalLayout with dwell progress 0→1 */
  onRegister?: (handler: (progress: number) => void) => void;
}

export default function AboutPanel({ onRegister }: Props) {
  const panelRef  = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLParagraphElement>(null);
  const wordsRef  = useRef<Element[]>([]);

  useGSAP(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    const split = new SplitText(textEl, {
      type: "words",
      wordsClass: "about-word",
    });

    wordsRef.current = split.words;

    // Start all words dim
    gsap.set(split.words, { color: "var(--base-300)", opacity: 0.3 });

    // Register our progress handler with the parent
    onRegister?.((progress: number) => {
      const words = wordsRef.current;
      if (!words.length) return;

      words.forEach((word, i) => {
        // Each word fades in across a small window of progress.
        // Overlap of 1.5 makes adjacent words blend — flowing wave feel.
        const start       = i / words.length;
        const end         = Math.min((i + 1.5) / words.length, 1.0);
        const wordProgress = gsap.utils.clamp(0, 1, (progress - start) / (end - start));
        const alpha        = gsap.utils.interpolate(0.3, 1, wordProgress);
        // We now move from dim olive to full beige
        // Since we can't easily tween "var(--base-100)" in a single string with alpha without calc-mix or rgba,
        // we'll toggle classes or just use inline styles if we knew the hex.
        // Actually, let's just stick to opacity for now for simplicity and correctness with vars, 
        // OR use the known hex values if we want exact control. 
        // Plan: interpolate color from base-300 to base-100? 
        // Simpler: Just fade opacity of base-100?
        // Let's use opacity on base-100 for the "active" look or interpolate colors.
        // Given the code structure, it's setting `style.color`.
        // Let's interpolate between the two hexes for now since GSAP handles colors well.
        // #8FA31E (base-300) -> #EFF5D2 (base-100)
        
        // GSAP can interpolate colors if we let it.
        // But here we are doing it manually in a loop.
        // Let's use the helper:
        const color = gsap.utils.interpolate("#8FA31E", "#EFF5D2", wordProgress);
        (word as HTMLElement).style.color = color;
      });
    });
  }, { scope: panelRef });

  return (
    <div
      ref={panelRef}
      className="relative flex-shrink-0 w-screen h-screen flex flex-col justify-center items-center px-20"
      style={{ background: "var(--base-400)" }}
    >
      <span
        className="absolute top-10 left-12 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--base-200)" }}
      >
        About
      </span>

      <p
        ref={textRef}
        className="text-center font-bold leading-tight max-w-4xl"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)",
          fontFamily: "var(--font-lk)",
        }}
      >
        {aboutText}
      </p>
    </div>
  );
}
