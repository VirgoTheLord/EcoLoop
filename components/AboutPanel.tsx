export default function AboutPanel() {
  return (
    <div className="relative flex-shrink-0 w-screen h-screen flex flex-col justify-center px-20 gap-6"
      style={{ background: "#0a0a0a", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Panel label */}
      <span className="absolute top-10 left-12 text-xs tracking-[0.3em] uppercase"
        style={{ color: "rgba(255,255,255,0.25)" }}>
        About
      </span>

      {/* Eyebrow */}
      <p className="text-xs tracking-[0.3em] uppercase"
        style={{ color: "rgba(255,255,255,0.35)" }}>
        Who we are
      </p>

      {/* Heading */}
      <h2 className="font-bold leading-none tracking-tighter"
        style={{ fontSize: "clamp(3rem,9vw,9rem)", color: "rgba(255,255,255,0.9)" }}>
        Closing<br />the loop.
      </h2>

      {/* Divider */}
      <div className="w-16 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />

      {/* Body */}
      <p className="max-w-md text-sm leading-relaxed"
        style={{ color: "rgba(255,255,255,0.4)" }}>
        Ecoloop is a platform built around the idea that sustainability
        isn't a sacrifice — it's a smarter way to live. We connect people,
        products, and processes to reduce waste at every step.
      </p>
    </div>
  );
}
