'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        width="150"
        height="50"
        viewBox="0 0 250 83.33"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-10"
      >
        <rect width="250" height="83.33" className="fill-primary" rx="10"></rect>
        <text
          x="10"
          y="30"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fontWeight="bold"
          className="fill-white"
        >
          ALIRU
        </text>
        <text
          x="10"
          y="50"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          className="fill-white"
        >
          Refacciones para Remolques
        </text>
        <g transform="translate(150, 10)">
          <path
            d="M5 20 H50 L60 30 H95 V50 H5 V20 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="25" cy="55" r="5" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="75" cy="55" r="5" stroke="white" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </Link>
  );
}
