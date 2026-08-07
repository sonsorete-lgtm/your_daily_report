interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * "Your Daily Report" logo mark.
 * A document/checklist glyph with a signature accent stroke — conveys
 * a daily filed report. Uses the brand amber→teal ramp.
 */
export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-teal-500 shadow-lg shadow-orange-500/25 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-900"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
        <path d="M9 9h2" />
      </svg>
    </div>
  );
}

export function LogoWordmark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={size} />
      <span className="font-semibold tracking-tight text-sm">Your Daily Report</span>
    </div>
  );
}
