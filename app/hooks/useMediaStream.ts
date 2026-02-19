'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const initStream = useCallback(async (): Promise<boolean> => {
    // stop stream if it existed
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = mediaStream;

      return true;
    } catch (err) {
      console.error('Failed to get media stream:', err);
      return false;
    }
  }, []);

  // initialize stream
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const success = await initStream();

      if (!mounted) return;

      if (success) {
        setStream(streamRef.current);
        setError('');
        setIsMuted(false);
        setIsVideoOff(false);
      } else {
        setStream(null);
        setError('Could not access camera/microphone');
      }
    };

    initialize();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [initStream]);

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!audioTracks[0]?.enabled);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!videoTracks[0]?.enabled);
    }
  };

  const retryAccess = useCallback(async (): Promise<boolean> => {
    const success = await initStream();
    if (success) {
      setStream(streamRef.current);
      setError('');
      setIsMuted(false);
      setIsVideoOff(false);
    } else {
      setStream(null);
      setError('Could not access camera/microphone');
    }
    return success;
  }, [initStream]);

  return {
    stream,
    error,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    retryAccess,
  };
};
