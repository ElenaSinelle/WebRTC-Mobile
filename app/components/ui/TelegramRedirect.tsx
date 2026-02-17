'use client';

import { useMobileDetect } from '@/app/hooks/useMobileDetect';
import { Button } from './Button';

export const TelegramRedirect = () => {
  const { isAndroid, isIOS } = useMobileDetect();

  const getInstructions = () => {
    if (isAndroid) {
      return {
        title: 'Open in Chrome',
        instruction: 'Tap the button below to open in Chrome browser',
        buttonText: 'Open in Chrome',
        icon: '📱',
        browserName: 'Chrome',
      };
    }

    if (isIOS) {
      return {
        title: 'Open in Safari',
        instruction: 'Tap the button below to open in Safari browser',
        buttonText: 'Open in Safari',
        icon: '🍎',
        browserName: 'Safari',
      };
    }

    return {
      title: 'Open in Browser',
      instruction: 'Copy the link and open in your browser',
      buttonText: 'Copy Link',
      icon: '💻',
      browserName: 'browser',
    };
  };

  const handleOpenInBrowser = () => {
    const url = window.location.href;

    if (isAndroid) {
      window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (isIOS) {
      window.location.href = url.replace(/^https?:\/\//, '');
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
