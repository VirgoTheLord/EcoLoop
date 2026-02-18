"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText, CustomEase } from "gsap/all";
import { useGSAP } from "@gsap/react";
import "./home.css";

// Register plugins
gsap.registerPlugin(SplitText, CustomEase);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Create custom ease
      CustomEase.create("hop", "0.9,0,0.1,1");

      // Helper function to create SplitText for a single element
      const splitText = (selector: string, type: string, className: string) => {
        const el = containerRef.current?.querySelector(selector);
        if (!el) return null;
        
        return new SplitText(el, {
          type: type as any,
          [type === "chars" ? "charsClass" : type === "words" ? "wordsClass" : "linesClass"]: className,
          mask: type as any
        });
      };

      // Helper function to create SplitText for multiple elements
      const splitTextAll = (selector: string, type: string, className: string) => {
        const els = containerRef.current?.querySelectorAll(selector);
        if (!els || els.length === 0) return null;
        
        return new SplitText(Array.from(els), {
          type: type as any,
          [type === "chars" ? "charsClass" : type === "words" ? "wordsClass" : "linesClass"]: className,
          mask: type as any
        });
      };

      // Create splits
      const headerSplit = splitText(".header h1", "chars", "char");
      const navLogoSplit = splitText(".nav-logo a", "words", "word");
      const navSplit = splitTextAll(".nav-links a", "words", "word");
      const footerSplit = splitTextAll(".hero-footer p", "words", "word");

      // Set initial hidden state for word-split elements
      if (navLogoSplit) gsap.set(navLogoSplit.words, { y: "100%" });
      if (navSplit) gsap.set(navSplit.words, { y: "100%" });
      if (footerSplit) gsap.set(footerSplit.words, { y: "100%" });
      if (headerSplit) gsap.set(headerSplit.chars, { x: "100%" });

      // Counter elements
      const counterProgress = containerRef.current?.querySelector(".preloader-counter h1");
      const counterContainer = containerRef.current?.querySelector(".preloader-counter");
      const counter = { value: 0 };

      // Main timeline
      const tl = gsap.timeline();

      // Counter animation
      tl.to(counter, {
        value: 100,
        duration: 3,
        ease: "power3.out",
        onUpdate: () => {
          if (counterProgress) {
            counterProgress.textContent = Math.round(counter.value).toString();
          }
        },
        onComplete: () => {
          if (counterProgress) {
            const counterSplit = splitText(".preloader-counter h1", "chars", "digit");
            if (counterSplit) {
              gsap.to(counterSplit.chars, {
                x: "-100%",
                duration: 0.75,
                ease: "power3.out",
                stagger: 0.1,
                delay: 1,
                onComplete: () => {
                  counterContainer?.remove();
                }
              });
            }
          }
        }
      });

      // Counter scale animation
      if (counterContainer) {
        tl.to(counterContainer, {
          scale: 1,
          duration: 3,
          ease: "power3.out"
        }, "<");
      }

      // Progress bar animation
      tl.to(".progress-bar", {
        scaleX: 1,
        duration: 3,
        ease: "power3.out"
      }, "<");

      // Hero background reveal - first stage (to center)
      tl.to(".hero-bg", {
        clipPath: "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)",
        duration: 1.5,
        ease: "hop"
      }, 4.5);

      tl.to(".hero-bg img", {
        scale: 1.5,
        duration: 1.5,
        ease: "hop"
      }, "<");

      // Hero background reveal - second stage (to full)
      tl.to(".hero-bg", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 2,
        ease: "hop"
      }, 6);

      tl.to(".hero-bg img", {
        scale: 1,
        duration: 2,
        ease: "hop"
      }, 6);

      // Progress inner bar
      tl.to(".progress", {
        scaleX: 1,
        duration: 2,
        ease: "hop"
      }, 6);

      // Header text reveal
      if (headerSplit) {
        tl.to(headerSplit.chars, {
          x: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075
        }, 7);
      }

      // Nav logo reveal
      if (navLogoSplit) {
        tl.to(navLogoSplit.words, {
          y: "0%",
          duration: 1,
          ease: "power4.out",
        }, 7.5);
      }

      // Nav links reveal
      if (navSplit) {
        tl.to(navSplit.words, {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075
        }, 7.5);
      }

      // Footer text reveal
      if (footerSplit) {
        tl.to(footerSplit.words, {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075
        }, 7.5);
      }

      // Cleanup
      return () => {
        headerSplit?.revert();
        navLogoSplit?.revert();
        navSplit?.revert();
        footerSplit?.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {/* Preloader Counter */}
      <div className="preloader-counter fixed top-1/2 left-8 -translate-y-1/2 scale-[0.25] origin-left-bottom will-change-transform z-[2]">
        <h1 className="text-[clamp(2.5rem,25vw,25rem)]">0</h1>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full p-8 flex justify-between items-start z-[1]">
        <div className="nav-logo">
          <a href="#">Ecoloop</a>
        </div>
        <div className="nav-links flex gap-8 max-[1000px]:flex-col max-[1000px]:items-end max-[1000px]:gap-2">
          <a href="#">Home</a>
          <a href="#">Progress</a>
          <a href="#">Implementation</a>
          <a href="#">Work</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero relative w-full h-[100svh] overflow-hidden">
        {/* Hero Background */}
        <div className="hero-bg absolute top-0 left-0 w-full h-full will-change-[clip-path] z-[-1] [clip-path:polygon(50%_50%,50%_50%,50%_50%,50%_50%)]">
          <img 
            src="/13.png" 
            alt="Hero" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2] will-change-transform"
          />
        </div>

        {/* Header */}
        <div className="header absolute bottom-16 w-full px-8">
          <h1 className="main text-[clamp(4rem,18vw,14rem)] max-[1000px]:text-[4rem]">
            Ecoloop
          </h1>
        </div>

        {/* Hero Footer */}
        <div className="hero-footer absolute bottom-8 w-full px-8 flex justify-between items-start">
          <p>Permanence</p>
          <p>Craftsmanship</p>
          <p>Excellence</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar absolute left-8 bottom-24 w-[calc(100%-4rem)] h-[1.5px] bg-base-200 origin-left scale-x-0 will-change-transform overflow-hidden">
          <div className="progress absolute w-full h-full bg-base-100 origin-left scale-x-0 will-change-transform"></div>
        </div>
      </section>
    </div>
  );
}