'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
        <div className="w-auto h-8 flex items-center">
            <svg viewBox="0 0 180 32" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 28L12.3333 4H19.3333L27.6667 28H20.6667L18.5 22H13.1667L11 28H4Z" className="fill-foreground" />
                <path d="M14.8333 18L15.8333 15.3333C16.1667 14.4444 16.4444 13.5 16.6667 12.5H16.8333C17.0556 13.5 17.3333 14.4444 17.6667 15.3333L18.6667 18H14.8333Z" className="fill-foreground" />
                <path d="M31.6667 28V4H38.6667V28H31.6667Z" className="fill-foreground" />
                <path d="M42.6667 28V4H49.6667V28H42.6667Z" className="fill-foreground" />
                <path d="M53.6667 4H60.6667L65.6667 16.3333L70.6667 4H77.6667V28H70.6667V11.3333L66.1667 22.1667H65.1667L60.6667 11.3333V28H53.6667V4Z" className="fill-foreground" />
                <path d="M81.6667 28V4H96.6667V10H88.6667V13H95.6667V19H88.6667V22H97.6667V28H81.6667Z" className="fill-foreground" />
                <path d="M117.167 19.3333C115.5 20.4444 113.611 21 111.5 21C108.722 21 106.5 20.1111 104.833 18.3333C103.167 16.5556 102.333 14.2222 102.333 11.3333C102.333 8.44444 103.167 6.11111 104.833 4.33333C106.5 2.55556 108.722 1.66667 111.5 1.66667C114.278 1.66667 116.5 2.55556 118.167 4.33333C119.833 6.11111 120.667 8.44444 120.667 11.3333C120.667 11.7778 120.611 12.2222 120.5 12.6667H109.333C109.556 14.6667 110.278 16 111.5 16C112.722 16 113.722 15.5556 114.5 14.6667L117.167 19.3333Z" className="fill-primary" />
                <path d="M125 4.00001C135.5 -2.49999 157.5 13 150 28" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M150 28C159.5 20.5 174 24.5 178.5 28" stroke="hsl(var(--foreground))" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </div>
    </Link>
  );
}