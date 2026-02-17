'use client';

import { useEffect, useState } from 'react';
import { isTMA } from '@tma.js/sdk'; // ✅ Единственный правильный импорт
import { Button } from './Button';

interface TelegramMiniAppDetectorProps {
  onDetectionComplete: () => void;
}

export const TelegramMiniAppDetector = ({ onDetectionComplete }: TelegramMiniAppDetectorProps) => {
  const [status, setStatus] = useState<'checking' | 'telegram' | 'browser'>('checking');

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const detectTelegram = async () => {
      try {
        // SDK init
        const isTelegram = await isTMA('complete', { timeout: 100 });

        // if Telegram Mini App detected, isTelegram will be true

        if (mounted) {
          if (isTelegram) {
            setStatus('telegram');
            console.log('Telegram Mini App detected');
          } else {
            // timeout for check
            timeoutId = setTimeout(() => {
              if (mounted) {
                setStatus('browser');
                console.log('Not in Telegram Mini App');
              }
            }, 100);
          }
          onDetectionComplete();
        }
      } catch (error) {
        console.error('Detection error:', error);
        if (mounted) {
          setStatus('browser');
          onDetectionComplete();
        }
      }
    };

    detectTelegram();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [onDetectionComplete]);

  const handleOpenInBrowser = () => {
    // use standard Web API to open a link
    window.open(window.location.href, '_blank');
  };

  const handleShareLink = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  if (status === 'checking') {
    return (
      <div className="fixed inset-0 bg-background-primary z-50 flex items-center justify-center">
        <div className="text-text-secondary">Checking environment...</div>
      </div>
    );
  }

  if (status === 'browser') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background-primary z-50 flex items-center justify-center p-4">
      <div className="bg-background-card rounded-md shadow-xl max-w-md w-full border border-border-secondary p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
          <span className="text-4xl">📱</span>
        </div>

        <h2 className="text-2xl font-semibold text-text-primary mb-3">Telegram Mini App Detected</h2>

        <p className="text-text-secondary mb-4">
          Video calls do not work inside Telegram Mini Apps due to platform limitations.
        </p>

        <div className="bg-warning/5 border border-warning/20 rounded-md p-4 mb-6 text-left">
          <p className="text-sm font-medium mb-2">Why this happens:</p>
          <ul className="text-xs space-y-1 list-disc pl-4 text-text-secondary">
            <li>Telegram Mini Apps use WebView technology</li>
            <li>WebView blocks or restricts WebRTC connections</li>
            <li>Full browser required for video calls</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={handleOpenInBrowser} variant="primary" size="lg" fullWidth>
            Open in Browser
          </Button>

          <Button onClick={handleShareLink} variant="secondary" size="md" fullWidth>
            Share Link
          </Button>
        </div>

        <p className="text-xs text-text-secondary mt-6">After opening in browser, grant camera & microphone access</p>
      </div>
    </div>
  );
};
