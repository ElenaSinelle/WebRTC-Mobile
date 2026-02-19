'use client';

import { useEffect } from 'react';

export const DebugConsole = () => {
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const isDev = process.env.NODE_ENV === 'development';
    const hasEruda = window.localStorage.getItem('eruda-enabled') === 'true';

    if ((isDev && isMobile) || hasEruda) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      script.async = true;

      script.onload = () => {
        // @ts-expect-error-test
        if (window.eruda) {
          // @ts-expect-error-test
          window.eruda.init();
          console.log('📱 Eruda console ready');
        }
      };

      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/eruda"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, []);

  return null;
};
