interface InvictusLogoProps {
  size?: number;
  variant?: "light" | "dark";
  className?: string;
}

export function InvictusLogo({
  size = 200,
  variant = "light",
  className = "",
}: InvictusLogoProps) {
  const primaryColor = variant === "light" ? "#000000" : "#FFFFFF";
  const accentColor = variant === "light" ? "#1a1a1a" : "#e5e5e5";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer hexagonal frame - symbolizing strength and structure */}
      <path
        d="M100 10 L170 50 L170 150 L100 190 L30 150 L30 50 Z"
        stroke={primaryColor}
        strokeWidth="3"
        fill="none"
      />

      {/* Inner circuit-inspired angular frame */}
      <path
        d="M100 30 L150 57.5 L150 142.5 L100 170 L50 142.5 L50 57.5 Z"
        stroke={accentColor}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Central "I" monogram with angular tech elements */}
      <g>
        {/* Main vertical bar of "I" */}
        <rect x="90" y="60" width="20" height="80" fill={primaryColor} />

        {/* Top serif with circuit detail */}
        <path
          d="M75 60 L125 60 L125 70 L110 70 L110 65 L90 65 L90 70 L75 70 Z"
          fill={primaryColor}
        />

        {/* Bottom serif with circuit detail */}
        <path
          d="M75 140 L125 140 L125 130 L110 130 L110 135 L90 135 L90 130 L75 130 Z"
          fill={primaryColor}
        />

        {/* Circuit nodes - symbolizing tech/connectivity */}
        <circle cx="75" cy="65" r="3" fill={primaryColor} />
        <circle cx="125" cy="65" r="3" fill={primaryColor} />
        <circle cx="75" cy="135" r="3" fill={primaryColor} />
        <circle cx="125" cy="135" r="3" fill={primaryColor} />
      </g>

      {/* Angular accent lines - suggesting victory/upward movement */}
      <g opacity="0.6">
        <line
          x1="60"
          y1="100"
          x2="75"
          y2="85"
          stroke={accentColor}
          strokeWidth="2"
        />
        <line
          x1="140"
          y1="100"
          x2="125"
          y2="85"
          stroke={accentColor}
          strokeWidth="2"
        />

        {/* Small circuit traces */}
        <line
          x1="50"
          y1="80"
          x2="60"
          y2="80"
          stroke={accentColor}
          strokeWidth="1"
        />
        <line
          x1="140"
          y1="80"
          x2="150"
          y2="80"
          stroke={accentColor}
          strokeWidth="1"
        />
        <line
          x1="50"
          y1="120"
          x2="60"
          y2="120"
          stroke={accentColor}
          strokeWidth="1"
        />
        <line
          x1="140"
          y1="120"
          x2="150"
          y2="120"
          stroke={accentColor}
          strokeWidth="1"
        />
      </g>

      {/* Corner tech accents - minimal geometric details */}
      <g>
        <path
          d="M30 50 L35 50 L35 55"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M170 50 L165 50 L165 55"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M30 150 L35 150 L35 145"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M170 150 L165 150 L165 145"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  );
}

// Simplified favicon version - higher contrast, bolder shapes
export function InvictusLogoFavicon({
  size = 32,
  variant = "light",
}: InvictusLogoProps) {
  const primaryColor = variant === "light" ? "#000000" : "#FFFFFF";
  const bgColor = variant === "light" ? "#FFFFFF" : "#000000";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" fill={bgColor} />

      {/* Simplified hexagon outline */}
      <path
        d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
        stroke={primaryColor}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Bold "I" */}
      <g>
        {/* Main vertical */}
        <rect x="14" y="10" width="4" height="12" fill={primaryColor} />

        {/* Top bar */}
        <rect x="11" y="10" width="10" height="2" fill={primaryColor} />

        {/* Bottom bar */}
        <rect x="11" y="20" width="10" height="2" fill={primaryColor} />

        {/* Tech accents */}
        <circle cx="11" cy="11" r="1" fill={primaryColor} />
        <circle cx="21" cy="11" r="1" fill={primaryColor} />
        <circle cx="11" cy="21" r="1" fill={primaryColor} />
        <circle cx="21" cy="21" r="1" fill={primaryColor} />
      </g>
    </svg>
  );
}
