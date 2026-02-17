'use client';

import { useMemo } from 'react';

export const useTelegramDetection = () => {
  const telegramInfo = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        isTelegram: false,
        isTelegramWebView: false,
        telegramVersion: null,
        webViewType: null,
        hasWebApp: false,
      };
    }

    const userAgent = navigator.userAgent;

    // typesafe ckeck for TelegramWebviewProxy and TelegramWebApp
    const hasTelegramProxy = typeof window.TelegramWebviewProxy !== 'undefined' && window.TelegramWebviewProxy !== null;
    const hasTelegramWebApp = typeof window.Telegram?.WebApp !== 'undefined';

    // check if the app is open in Telegram
    const isTelegram =
      userAgent.includes('Telegram') || userAgent.includes('TelegramBot') || hasTelegramProxy || hasTelegramWebApp;

    // check WebView type
    let webViewType = null;
    if (isTelegram) {
      if (hasTelegramProxy) {
        webViewType = 'webview-proxy';
      } else if (hasTelegramWebApp) {
        webViewType = 'webapp';
      } else if (userAgent.includes('Android')) {
        webViewType = 'android-webview';
      } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        webViewType = 'ios-wkwebview';
      } else if (userAgent.includes('Mac OS')) {
        webViewType = 'desktop';
      } else {
        webViewType = 'unknown';
      }
    }

    // check Telegram version
    const versionMatch = userAgent.match(/Telegram\/([\d.]+)/);
    const telegramVersion = versionMatch ? versionMatch[1] : null;

    // deb log
    if (
      // process.env.NODE_ENV === 'development' &&
      isTelegram
    ) {
      console.log('Telegram detected:', {
        webViewType,
        telegramVersion,
        hasProxy: hasTelegramProxy,
        hasWebApp: hasTelegramWebApp,
        userAgent,
      });
    }

    return {
      isTelegram,
      isTelegramWebView: isTelegram && webViewType !== 'desktop',
      telegramVersion,
      webViewType,
      hasWebApp: hasTelegramWebApp,
    };
  }, []);

  return telegramInfo;
};
