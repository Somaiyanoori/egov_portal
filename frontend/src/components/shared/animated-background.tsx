export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-black" />

      {/* Animated blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-500/30 blur-3xl animate-pulse" />
      <div
        className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
