import React from "react";

export function MasonicEmblem({ className = "w-16 h-16", color = "#B9975B" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Compasses Top Hinge */}
      <circle cx="50" cy="18" r="5" stroke={color} strokeWidth="2.5" />
      <circle cx="50" cy="18" r="2" fill={color} />

      {/* Compasses Arms */}
      <line x1="47" y1="21" x2="20" y2="82" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="53" y1="21" x2="80" y2="82" stroke={color} strokeWidth="3" strokeLinecap="round" />

      {/* The Square */}
      <path
        d="M 22 46 L 50 74 L 78 46"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 14 38 L 50 74 L 86 38"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Ruler ticks on Square */}
      <line x1="28" y1="52" x2="33" y2="47" stroke={color} strokeWidth="1.5" />
      <line x1="36" y1="60" x2="41" y2="55" stroke={color} strokeWidth="1.5" />
      <line x1="44" y1="68" x2="49" y2="63" stroke={color} strokeWidth="1.5" />
      <line x1="72" y1="52" x2="67" y2="47" stroke={color} strokeWidth="1.5" />
      <line x1="64" y1="60" x2="59" y2="55" stroke={color} strokeWidth="1.5" />
      <line x1="56" y1="68" x2="51" y2="63" stroke={color} strokeWidth="1.5" />

      {/* Central "G" */}
      <text
        x="50"
        y="58"
        fontFamily="'Cinzel Decorative', 'Cinzel', 'Times New Roman', serif"
        fontSize="22"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
      >
        G
      </text>
    </svg>
  );
}

export default MasonicEmblem;
