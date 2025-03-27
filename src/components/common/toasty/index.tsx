'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastyConfig() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000
      }}
    />
  );
}
