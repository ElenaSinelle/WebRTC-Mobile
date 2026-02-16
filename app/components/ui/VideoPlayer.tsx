'use client';

import { useMobileDetect } from '@/app/hooks/useMobileDetect';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  stream?: MediaStream | null;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  participantName?: string;
}

export const VideoPlayer = ({
  stream,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  participantName = 'Participant',
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isIOS } = useMobileDetect();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      // for iOS: force play
      if (isIOS && !isLocal) {
        const playVideo = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((e) => {
              console.log('iOS play error (will retry):', e);
              // retry after error
              setTimeout(playVideo, 500);
            });
          }
        };
        playVideo();
      }
    }
  }, [stream, isIOS, isLocal]);

  return (
    <div className="relative aspect-video rounded-md overflow-hidden bg-background-secondary shadow-lg border border-text-primary/10">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          webkit-playsinline="true"
          muted={isLocal || isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background-primary to-background-secondary">
          <span className="text-text-secondary">No video</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 ">
        <div className="flex items-center justify-between">
          <span className="text-text-primary font-medium">{isLocal ? 'You' : participantName}</span>{' '}
          <div className="flex gap-2">
            {isLocal && isMuted && (
              <span className="bg-status-danger text-white px-2 py-1 rounded text-xs font-medium shadow-lg">MUTE</span>
            )}
            {isLocal && isVideoOff && (
              <span className="bg-status-danger text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
                VIDEO OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
