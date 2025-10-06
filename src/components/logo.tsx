'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        width="200"
        height="78"
        viewBox="0 0 200 78"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-10"
      >
        <g>
          {/* Blue Box with Text */}
          <rect x="0" y="0" width="130" height="30" fill="#0084c7" />
          <text
            x="10"
            y="21"
            fontFamily="Georgia, serif"
            fontSize="20"
            fill="white"
            letterSpacing="1"
          >
            A|L|I|R|U
          </text>
          
          {/* Subtitle */}
          <text
            x="0"
            y="45"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fill="black"
          >
            Refacciones para Remolques
          </text>

          {/* Trailer */}
          <path
            d="M0 60 H10 L15 55 H185 L195 60 H200 V65 H190 V70 H180 L170 65 H30 L20 70 H10 V65 H0 V60 Z"
            fill="black"
            stroke="black"
            strokeWidth="1"
          />
          <circle cx="125" cy="73" r="5" stroke="black" strokeWidth="1" fill="white" />
          <circle cx="125" cy="73" r="2" fill="black" />
          <circle cx="140" cy="73" r="5" stroke="black" strokeWidth="1" fill="white" />
          <circle cx="140" cy="73" r="2" fill="black" />

        </g>
      </svg>
    </Link>
  );
}
