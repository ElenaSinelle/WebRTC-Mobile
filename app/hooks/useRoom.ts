'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useRoom = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  const copyRoomLink = useCallback(async () => {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const leaveRoom = useCallback(() => {
    router.push('/');
  }, [router]);

  const openEndConfirmation = useCallback(() => {
    setShowEndConfirmation(true);
  }, []);

  const closeEndConfirmation = useCallback(() => {
    setShowEndConfirmation(false);
  }, []);

  return {
    copied,
    copyRoomLink,
    leaveRoom,
    showEndConfirmation,
    openEndConfirmation,
    closeEndConfirmation,
  };
};
