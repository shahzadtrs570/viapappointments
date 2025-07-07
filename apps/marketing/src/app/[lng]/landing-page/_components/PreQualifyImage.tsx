'use client';

import Image from 'next/image';

export function PreQualifyImage() {
  return (
    <div className="w-full">
      <Image
        src="/images/landing/pre-qualify.avif"
        alt="Pre-qualify"
        width={1920}
        height={1080}
        className="w-full h-auto"
        priority
      />
    </div>
  );
} 