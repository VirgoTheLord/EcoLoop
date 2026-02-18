"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ─── Timeline Data ──────────────────────────────────────────────────────── */
const ENTRIES = [
  {
    year: "2019",
    headline: "The Seed",
    body: "Ecoloop was born from a simple question: what if waste was just a resource in the wrong place?",
    img: "/hero.png",
  },
  {
    year: "2021",
    headline: "First Loop",
    body: "Our pilot programme diverted 40 tonnes of material from landfill, proving the model works at scale.",
    img: "/13.png",
  },
  {
    year: "2022",
    headline: "Expansion",
    body: "Launching in three new cities, we refined our logistics network to handle diverse material streams efficiently.",
    img: "/hero.png",
  },
  {
    year: "2023",
    headline: "Global Global",
    body: "Strategic partnerships across two continents allowed us to close the loop on international supply chains.",
    img: "/13.png",
  },
  {
    year: "2024",
    headline: "Full Circle",
    body: "Today Ecoloop partners with 200+ businesses, closing the loop on packaging, textiles, and electronics.",
    img: "/hero.png",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
interface Props {
  onRegister?: (handler: (progress: number) => void) => void;
}

export default function TimelinePanel({ onRegister }: Props) {
  const panelRef   = useRef<HTMLDivElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const tipRef     = useRef<SVGCircleElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const entriesRef = useRef<HTMLDivElement[]>([]);

  // Config
  const ITEM_WIDTH = 45; // vw
  const START_PAD  = 65;  // vw - leads into first item
  const END_PAD    = 10;  // vw

  useGSAP(() => {
    const path  = pathRef.current;
    const tip   = tipRef.current;
    const label = labelRef.current;

    if (!path) return;

    onRegister?.((progress: number) => {
      const vw = window.innerWidth;
      const count = ENTRIES.length;
      
      /* 1. Dynamic Width Calculation */
      
      // Line draws from 10vw to end (User specified width is total - 25vw)
      // Logic: Start at 10vw. Width ends 25vw from right. 
      // Line Length = (Total Width - 25)
      // Note: SVG Left is 10vw. 
      // If SVG Width is (Total - 25), that is the length of the line.
      const lineLenVw   = (START_PAD + (count * ITEM_WIDTH) + END_PAD) - 26;
      const totalLen    = vw * (lineLenVw / 100); 

      // Scribble Logic
      // Center Y relative to the SVG container? 
      // The SVG is height: 100%, top: 0. So y=50% is center.
      const cy = window.innerHeight / 2;
      
      // A fun "scribble" start. Relative to (0, cy).
      // Let's definition loops:
      // M 0 cy  -> Start
      // c 30 -50 60 50 90 0 -> first wave
      // c 30 -60 -20 -60 0 0 -> loop back type thing?
      // Let's try explicit coordinates for a nice logical Loop-de-loop.
      // 1. Start 0,0
      // 2. Loop Up-Right: (50, -60)
      // 3. Loop Down-Left (crosses): (30, 40)
      // 4. Loop Up-Right again: (100, -30)
      // 5. Land straight: (150, 0)
      
      // Constructing Path D:
      // We will perform string concatenation.
      // Coordinates are "dx dy" relative if we use lowercase 'c' or 's', 
      // but absolute 'C' is easier if we calculate offsets.
      // Let's use relative 'c' logic for the scribble, starting from M 0 cy.
      
      // Loop 1: big starting coil
      // c 40 -100, 80 80, 120 0 
      // Loop 2: smaller coil
      // c 40 -60, 40 60, 80 0
      
      // "Luxury Signature" Flourish
      // We want a big, smooth, cursive-style loop that feels elegant.
      // 350px width reserved for the flourish.
      
      const d = `
        M 0 ${cy}
        C 120 ${cy - 120}, 220 ${cy + 100}, 140 ${cy + 40}
        C 60 ${cy - 20}, 180 ${cy - 150}, 280 ${cy}
        S 360 ${cy}, 400 ${cy}
        L ${totalLen} ${cy}
      `;
      
      path.setAttribute("d", d);
      
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;

      /* 2. Pin Label */
      // Scrollable distance = (count * ITEM_WIDTH) + START_PAD + END_PAD + 20 - 100 [vw]
      const scrollableWidthVw = (START_PAD + (count * ITEM_WIDTH) + END_PAD + 20) - 100;
      if (label) {
        label.style.transform = `translateX(${progress * scrollableWidthVw}vw)`;
      }

      /* 3. Line Draw */
      const lineStartP = 0.0; // Start immediately
      const lineEndP   = 1.0;
      const range      = lineEndP - lineStartP;
      
      const drawProgress = gsap.utils.clamp(0, 1, (progress - lineStartP) / range); 
      const offset = len * (1 - drawProgress);
      path.style.strokeDashoffset = `${offset}`;

      /* 4. Tip Position */
      if (tip) {
        // Use getPointAtLength for exact tracking
        const point = path.getPointAtLength(len * drawProgress);
        
        if (drawProgress <= 1) {
            tip.setAttribute("cx", `${point.x}`);
            tip.setAttribute("cy", `${point.y}`);
            // Keep tip visible at the end
            tip.style.opacity = drawProgress > 0.01 ? "1" : "0";
        }
      }

      /* 5. Entry Reveals (Focus Mode) */
      const plateau = 25; // vw 
      const fade    = 25; // vw 
      const viewportCenterVw = (progress * scrollableWidthVw) + 50;

      entriesRef.current.forEach((el, i) => {
        if (!el) return;
        
        // Item Center in Panel Coordinates (vw)
        const itemCenterVw = START_PAD + (i * ITEM_WIDTH) + (ITEM_WIDTH / 2);
        
        // Distance
        const dist = Math.abs(viewportCenterVw - itemCenterVw);
        
        // Opacity Math
        const opacity = 1 - gsap.utils.clamp(0, 1, (dist - plateau) / fade);
        
        el.style.opacity = `${opacity}`;
        
        // Subtle Parallax / Slide
        el.style.transform = `translateY(${gsap.utils.interpolate(40, 0, opacity)}px)`;
      });
    });
  }, { scope: panelRef });

  return (
    <div
      ref={panelRef}
      className="timeline-panel relative flex-shrink-0 h-screen font-sans  "
      style={{ 
          width: `${START_PAD + (ENTRIES.length * ITEM_WIDTH) + END_PAD+ 20}vw`, 
          background: "var(--base-500)" 
      }}
    >
      {/* ── Label (Pinned) ────────────────────────────────────────────── */}
      <span
        ref={labelRef}
        className="absolute top-10 left-12 text-xs tracking-[0.3em] uppercase z-20 will-change-transform"
        style={{ color: "var(--base-200)" }}
      >
        Timeline
      </span>

      {/* ── Intro Title (Static) ──────────────────────────────────────── */}
      <div 
        className="absolute top-0 left-0 h-full z-10 pl-[5vw] flex flex-col justify-center"
        style={{ width: `30vw`, padding:'3vw' }} // Fills space before SVG starts (at 30vw)
      >
        <h2 
            className="text-[8vw] font-bold text-base-100 leading-none uppercase flex flex-col items-start"
            style={{ fontFamily: "var(--font-lk, sans-serif)" }}
        >
            <span>How</span>
            <span>it all</span>
            <span>started</span>
        </h2>
      </div>

      {/* ── SVG Layer ─────────────────────────────────────────────────── */}
      <svg
        className="absolute top-0 pointer-events-none z-0"
        style={{ 
            left: `25vw`, // Start line 20vw from left edge
            width: `${(START_PAD + (ENTRIES.length * ITEM_WIDTH) + END_PAD) - 25}vw`, 
            height: "100%" 
        }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--base-200)"
          strokeWidth="1.5"
        />
        <circle
          ref={tipRef}
          r="4"
          fill="var(--base-100)"
          opacity="0"
          style={{ filter: "drop-shadow(0 0 8px rgba(239, 245, 210, 0.8))" }}
        />
      </svg>

      {/* ── Entries ───────────────────────────────────────────────────── */}
      {ENTRIES.map((entry, i) => {
        const isEven = i % 2 === 0;
        return (
          <div
            key={i}
            ref={(el) => { if (el) entriesRef.current[i] = el; }}
            className="timeline-entry absolute"
            style={{
              left:    `${START_PAD + (i * ITEM_WIDTH)}vw`,
              top:     0,
              width:   `${ITEM_WIDTH}vw`,
              height:  "100%",
              opacity: 0, 
              willChange: "opacity, transform",
            }}
          >
            {/* Vertical drop/rise line */}
            <div 
              className="absolute bg-base-200"
              style={{
                 top: isEven ? "50vh" : "auto", 
                 bottom: isEven ? "auto" : "50vh",
                 left: "10vw",
                 width: "1px",
                 height: "4vh"
              }}
            />

            {/* Image Block */}
            <div
              className="absolute"
              style={{
                bottom: isEven ? "52vh" : "auto",
                top:    isEven ? "auto" : "54vh", 
                left:   "10vw",
                width:  "25vw", 
                height: "30vh", 
                overflow: "hidden",
                borderRadius: "2px",
              }}
            >
              <img
                src={entry.img}
                alt={entry.headline}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Text Block */}
            <div
              className="absolute"
              style={{
                top:    isEven ? "54vh" : "auto",
                bottom: isEven ? "auto" : "52vh",
                left:   "10vw",
                width:  "35vw",
              }}
            >
              {!isEven ? (
                 // Odd: Text connects to line at bottom.
                 <div className="flex flex-col-reverse justify-end h-full">
                    <span
                      style={{
                        display:       "block",
                        fontSize:      "4rem",
                        fontFamily:    "var(--font-lk, sans-serif)",
                        fontWeight:    700,
                        color:         "var(--base-100)",
                        lineHeight:    1,
                        marginBottom:  "0.5rem",
                      }}
                    >
                      {entry.year}
                    </span>
                    <h3
                      style={{
                        fontFamily:    "var(--font-host-grotesk, sans-serif)",
                        fontSize:      "1.1rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color:         "var(--base-200)",
                        marginBottom:  "0.5rem", 
                      }}
                    >
                      {entry.headline}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-host-grotesk, sans-serif)",
                        fontSize:   "0.95rem",
                        lineHeight: 1.6,
                        color:      "var(--base-100)",
                        opacity:    0.8,
                        maxWidth:   "35ch",
                        marginBottom: "1rem",
                      }}
                    >
                      {entry.body}
                    </p>
                 </div>
              ) : (
                // Even: Standard order
                <>
                  <span
                    style={{
                      display:       "block",
                      fontSize:      "4rem",
                      fontFamily:    "var(--font-lk, sans-serif)",
                      fontWeight:    700,
                      color:         "var(--base-100)",
                      lineHeight:    1,
                      marginBottom:  "0.5rem",
                    }}
                  >
                    {entry.year}
                  </span>
                  <h3
                    style={{
                      fontFamily:    "var(--font-host-grotesk, sans-serif)",
                      fontSize:      "1.1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color:         "var(--base-200)",
                      marginBottom:  "1rem",
                    }}
                  >
                    {entry.headline}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-host-grotesk, sans-serif)",
                      fontSize:   "0.95rem",
                      lineHeight: 1.6,
                      color:      "var(--base-100)",
                      opacity:    0.8,
                      maxWidth:   "35ch",
                    }}
                  >
                    {entry.body}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
