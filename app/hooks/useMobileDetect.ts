'use client';

import { useEffect, useState } from 'react';

export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [browser, setBrowser] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobile =
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        userAgent,
      );
    const ios = /iP(hone|od|ad)/.test(userAgent);
    const android = /Android/.test(userAgent);

    setIsMobile(mobile);
    setIsIOS(ios);
    setIsAndroid(android);

    // detect browser
    if (userAgent.includes('Chrome')) setBrowser('chrome');
    else if (userAgent.includes('Firefox')) setBrowser('firefox');
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) setBrowser('safari');
    else if (userAgent.includes('Edg')) setBrowser('edge');
    else if (userAgent.includes('Miui')) setBrowser('miui');
  }, []);

  return { isMobile, isIOS, isAndroid, browser };
};
