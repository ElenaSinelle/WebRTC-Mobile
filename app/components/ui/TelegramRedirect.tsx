'use client';

// import { useMobileDetect } from '@/app/hooks/useMobileDetect';
import { Button } from './Button';
import { useTelegramDetection } from '@/app/hooks/useTelegramDetection';
import { useEffect } from 'react';

export const TelegramRedirect = () => {
  // const { isAndroid, isIOS } = useMobileDetect();
  const { isTelegramWebView, isTelegramIOS, isTelegramAndroid, isTelegramDesktop } = useTelegramDetection();

  const getInstructions = () => {
    if (isTelegramAndroid) {
      return {
        title: 'Open in Chrome',
        instruction: 'Video calls require Chrome browser',
        buttonText: 'Open in Chrome',
        icon: '📱',
        browserName: 'Chrome',
      };
    }

    if (isTelegramIOS) {
      return {
        title: 'Open in Safari',
        instruction: 'Video calls require Safari browser',
        buttonText: 'Open in Safari',
        icon: '🍎',
        browserName: 'Safari',
      };
    }

    if (isTelegramDesktop) {
      return {
        title: 'Use Mobile Device',
        instruction: 'Video calls work best on mobile devices',
        buttonText: 'Copy Link',
        icon: '💻',
        browserName: 'browser',
      };
    }

    return {
      title: 'Open in Browser',
      instruction: 'Copy the link and open in your browser',
      buttonText: 'Copy Link',
      icon: '🌐',
      browserName: 'browser',
    };
  };

  const handleOpenInBrowser = () => {
    const url = window.location.href;

    if (isTelegramAndroid) {
      window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (isTelegramIOS) {
      const safariUrl = url.replace(/^https?:\/\//, '');
      window.location.href = safariUrl;
    }

    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('✓ Link copied! Please open in your browser');
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('✓ Link copied! Please open in your browser');
    });
  };

  useEffect(() => {
    if (isTelegramWebView) {
      console.log('Telegram WebView detected - forcing redirect');

      const timer = setTimeout(() => {
        const shouldRedirect = window.confirm('Video calls do not work inside Telegram. Open in your browser?');

        if (shouldRedirect) {
          handleOpenInBrowser();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isTelegramWebView]);

  if (!isTelegramWebView) return null;

  const instructions = getInstructions();

  return (
    <div className="fixed inset-0 bg-background-primary z-50 flex items-center justify-center p-4">
      <div className="bg-background-card rounded-md shadow-xl max-w-md w-full border border-border-secondary p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
          <span className="text-5xl">{instructions.icon}</span>
        </div>

        <h2 className="text-2xl font-semibold text-text-primary mb-3">{instructions.title}</h2>

        <p className="text-text-secondary mb-6">{instructions.instruction}</p>

        <div className="space-y-3">
          <Button onClick={handleOpenInBrowser} variant="primary" size="lg" fullWidth>
            {instructions.buttonText}
          </Button>

          <Button onClick={handleCopyLink} variant="secondary" size="md" fullWidth>
            Copy Link
          </Button>
        </div>

        <p className="text-xs text-text-secondary mt-6">After opening, allow camera & microphone access</p>
      </div>
    </div>
  );
};
