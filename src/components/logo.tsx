import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="ALIRU Logo"
        width={120}
        height={40}
        className="object-contain"
      />
    </Link>
  );
}
