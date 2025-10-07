'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center group w-full max-w-[150px]">
        <div className="w-full h-auto flex items-center justify-center">
            <svg viewBox="0 0 350 150" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="10" width="300" height="50" className="fill-primary" rx="5"/>
                
                <text x="175" y="45" fontFamily="Georgia, serif" fontSize="32" className="fill-primary-foreground" textAnchor="middle" letterSpacing="4">
                    A | L | I | R | U
                </text>
                
                <text x="175" y="85" fontFamily="Arial, sans-serif" fontSize="20" className="fill-foreground" textAnchor="middle">
                    Refacciones para Remolques
                </text>

                <g className="fill-foreground">
                    {/* Base del remolque */}
                    <path d="M10,110 L340,110 L340,115 L10,115 Z" />
                    <path d="M10,110 L15,100 L40,100 L35,110 Z" />
                    <path d="M340,110 L335,100 L310,100 L315,110 Z" />

                    {/* Lados */}
                    <rect x="10" y="110" width="3" height="15" />
                    <rect x="337" y="110" width="3" height="15" />

                    {/* Ruedas */}
                    <circle cx="190" cy="125" r="12" stroke="hsl(var(--foreground))" strokeWidth="2" fill="hsl(var(--background))" />
                    <circle cx="190" cy="125" r="4" />
                    <circle cx="225" cy="125" r="12" stroke="hsl(var(--foreground))" strokeWidth="2" fill="hsl(var(--background))" />
                    <circle cx="225" cy="125" r="4" />
                    
                    {/* Guardafangos */}
                    <path d="M175,110 C175,100 240,100 240,110 Z" />

                    {/* Soportes laterales */}
                    <rect x="50" y="100" width="4" height="10" />
                    <rect x="80" y="100" width="4" height="10" />
                    <rect x="110" y="100" width="4" height="10" />
                    <rect x="140" y="100" width="4" height="10" />
                    <rect x="250" y="100" width="4" height="10" />
                    <rect x="280" y="100" width="4" height="10" />
                </g>
            </svg>
        </div>
    </Link>
  );
}
