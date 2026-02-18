'use client';

import Script from 'next/script';

// interface TgHintLoaderProps {
//   onComplete: () => void;
// }

// export const TgHintLoader = ({ onComplete }: TgHintLoaderProps) => {
export const TgHintLoader = () => {
  return (
    <Script
      src="https://cdn.jsdelivr.net/gh/dontbug/tg-hint/dist/tg-hint.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log(' tg-hint loaded');

        // onComplete();
      }}
      onError={(error) => {
        console.error('❌ Failed to load tg-hint:', error);
        // onComplete();
      }}
    />
  );
};
