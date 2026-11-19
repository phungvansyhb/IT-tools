import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export function BrandLogo({ size = 32, className }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#09090b" stroke="#27272a" strokeWidth="2" />
      <path
        d="M17 21L29 32L17 43"
        stroke="#f4f4f5"
        strokeWidth="5.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="33" y="40" width="15" height="5" rx="2" fill="#10b981" />
    </svg>
  );
}
