'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({
  darkmodeLogoUrl,
  logoUrl,
  siteName
}: {
  darkmodeLogoUrl: string;
  logoUrl: string;
  siteName: string;
}) {
  const { theme } = useTheme();

  return (
    <Link href="/login">
      {/* eslint-disable-next-line no-nested-ternary */}
      {theme === 'dark' ? (
        <Image
          alt="logo"
          width={150}
          height={150}
          quality={70}
          priority
          sizes="(max-width: 768px) 50vw, (max-width: 2100px) 15vw"
          src={darkmodeLogoUrl || '/logo.png'}
        />
      ) : (
        logoUrl ? (
          <Image
            alt="logo"
            width={150}
            height={150}
            quality={70}
            priority
            sizes="(max-width: 768px) 50vw, (max-width: 2100px) 15vw"
            src={logoUrl || '/logo.png'}
          />
        ) : siteName
      )}
    </Link>
  );
}
