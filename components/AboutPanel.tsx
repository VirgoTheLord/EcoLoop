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

    // Start all words dim (Beige)
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
        
        // We now move from dim Beige to full Dark Olive
        // #EFF5D2 (base-100) -> #556B2F (base-400)
        
        const color = gsap.utils.interpolate("#8FA31E", "#556B2F", wordProgress);
        const opacity = gsap.utils.interpolate(0.3, 1, wordProgress);
        
        (word as HTMLElement).style.color = color;
        (word as HTMLElement).style.opacity = `${opacity}`;
      });
    });
  }, { scope: panelRef });

  return (
    <div
      ref={panelRef}
      className="relative flex-shrink-0 w-screen h-screen flex flex-col justify-center items-center px-20"
      style={{ background: "var(--base-100)" }}
    >
      <span
        className="absolute top-10 left-12 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--base-500)" }}
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
