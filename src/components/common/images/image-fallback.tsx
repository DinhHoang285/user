'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@lib/file';

interface IProps {
  options: any;
  alt: string;
  src: string;
  fallbackSrc?: any;
  onClick?: Function;
}

export default function ImageWithFallback({
  src,
  alt,
  options,
  onClick = () => { },
  fallbackSrc = '/no-image.jpg'
}: IProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const opts = {
    width: 500,
    height: 500,
    sizes: '(max-width: 768px) 100vw, (max-width: 2100px) 20vw',
    loading: 'lazy',
    ...options
  };
  if (options.fill) {
    delete opts.width;
    delete opts.height;
  }
  if (options.priority) {
    opts.loading = 'eager';
    opts.real = 'preload';
    opts.fetchPriority = 'high';
  }

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      alt={alt || 'img'}
      src={imgSrc}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(options?.width, options?.height))}`}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      onClick={() => onClick && onClick()}
      {...opts}
    />
  );
}
