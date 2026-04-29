import React from "react";

type LogoProps = {
  variant?: "horizontal" | "stacked" | "mark";
  reverse?: boolean;
  className?: string;
  width?: number;
};

export function Logo({
  variant = "horizontal",
  reverse = false,
  className = "",
  width,
}: LogoProps) {
  const stroke = reverse ? "#FFFFFF" : "#0D1B2A";
  const accent = reverse ? "#A8B4C0" : "#5C6B7A";
  const text = reverse ? "#FFFFFF" : "#0D1B2A";
  const subtext = reverse ? "#A8B4C0" : "#5C6B7A";

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 96 96"
        width={width ?? 48}
        height={width ?? 48}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="48" cy="48" r="40" fill="none" stroke={stroke} strokeWidth="3.5" />
        <rect x="45" y="3" width="6" height="9" fill={stroke} rx="0.5" />
        <rect x="45" y="84" width="6" height="9" fill={stroke} rx="0.5" />
        <rect x="3" y="45" width="9" height="6" fill={stroke} rx="0.5" />
        <rect x="84" y="45" width="9" height="6" fill={stroke} rx="0.5" />
        <circle cx="20" cy="20" r="2.5" fill={stroke} />
        <circle cx="76" cy="20" r="2.5" fill={stroke} />
        <circle cx="20" cy="76" r="2.5" fill={stroke} />
        <circle cx="76" cy="76" r="2.5" fill={stroke} />
        <polygon points="48,12 52,48 48,46 44,48" fill={stroke} />
        <polygon points="48,84 44,48 48,50 52,48" fill={accent} />
        <polygon points="84,48 48,52 50,48 48,44" fill={accent} />
        <polygon points="12,48 48,44 46,48 48,52" fill={accent} />
        <circle cx="48" cy="48" r="3.5" fill="#1B6CFF" />
        <circle cx="48" cy="48" r="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (variant === "stacked") {
    return (
      <svg
        viewBox="0 0 320 240"
        width={width ?? 240}
        height={width ? width * 0.75 : 180}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(112, 16)">
          <circle cx="48" cy="48" r="40" fill="none" stroke={stroke} strokeWidth="3.5" />
          <rect x="45" y="3" width="6" height="9" fill={stroke} rx="0.5" />
          <rect x="45" y="84" width="6" height="9" fill={stroke} rx="0.5" />
          <rect x="3" y="45" width="9" height="6" fill={stroke} rx="0.5" />
          <rect x="84" y="45" width="9" height="6" fill={stroke} rx="0.5" />
          <circle cx="20" cy="20" r="2.5" fill={stroke} />
          <circle cx="76" cy="20" r="2.5" fill={stroke} />
          <circle cx="20" cy="76" r="2.5" fill={stroke} />
          <circle cx="76" cy="76" r="2.5" fill={stroke} />
          <polygon points="48,12 52,48 48,46 44,48" fill={stroke} />
          <polygon points="48,84 44,48 48,50 52,48" fill={accent} />
          <polygon points="84,48 48,52 50,48 48,44" fill={accent} />
          <polygon points="12,48 48,44 46,48 48,52" fill={accent} />
          <circle cx="48" cy="48" r="3.5" fill="#1B6CFF" />
          <circle cx="48" cy="48" r="1.5" fill="#FFFFFF" />
        </g>
        <text
          x="160"
          y="160"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="34"
          fontWeight="700"
          fill={text}
          letterSpacing="-1"
        >
          ENGINEROOM
        </text>
        <line x1="50" y1="178" x2="270" y2="178" stroke="#1B6CFF" strokeWidth="1.5" />
        <text
          x="160"
          y="200"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="11"
          fontWeight="500"
          fill={subtext}
          textLength="220"
          lengthAdjust="spacingAndGlyphs"
        >
          MARINE ENGINEERING NETWORK
        </text>
      </svg>
    );
  }

  // horizontal (default)
  return (
    <svg
      viewBox="0 0 380 120"
      width={width ?? 240}
      height={width ? (width / 380) * 120 : 76}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(12, 12)">
        <circle cx="48" cy="48" r="40" fill="none" stroke={stroke} strokeWidth="3.5" />
        <rect x="45" y="3" width="6" height="9" fill={stroke} rx="0.5" />
        <rect x="45" y="84" width="6" height="9" fill={stroke} rx="0.5" />
        <rect x="3" y="45" width="9" height="6" fill={stroke} rx="0.5" />
        <rect x="84" y="45" width="9" height="6" fill={stroke} rx="0.5" />
        <circle cx="20" cy="20" r="2.5" fill={stroke} />
        <circle cx="76" cy="20" r="2.5" fill={stroke} />
        <circle cx="20" cy="76" r="2.5" fill={stroke} />
        <circle cx="76" cy="76" r="2.5" fill={stroke} />
        <polygon points="48,12 52,48 48,46 44,48" fill={stroke} />
        <polygon points="48,84 44,48 48,50 52,48" fill={accent} />
        <polygon points="84,48 48,52 50,48 48,44" fill={accent} />
        <polygon points="12,48 48,44 46,48 48,52" fill={accent} />
        <circle cx="48" cy="48" r="3.5" fill="#1B6CFF" />
        <circle cx="48" cy="48" r="1.5" fill="#FFFFFF" />
      </g>
      <text
        x="135"
        y="62"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="34"
        fontWeight="700"
        fill={text}
        letterSpacing="-1"
      >
        ENGINEROOM
      </text>
      <line x1="135" y1="72" x2="355" y2="72" stroke="#1B6CFF" strokeWidth="1.5" />
      <text
        x="135"
        y="90"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11"
        fontWeight="500"
        fill={subtext}
        textLength="220"
        lengthAdjust="spacingAndGlyphs"
      >
        MARINE ENGINEERING NETWORK
      </text>
    </svg>
  );
}
