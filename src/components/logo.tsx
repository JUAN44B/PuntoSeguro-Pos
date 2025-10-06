'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image 
        src="/aliru-logo.svg"
        alt="ALIRU Logo"
        width={150}
        height={50}
        className='dark:invert'
      />
    </Link>
  );
}
