'use client';

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

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-xl border border-gray-200">
      {stream ? (
        <video ref={videoRef} autoPlay playsInline muted={isLocal || isMuted} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <span className="text-gray-400">No video</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">{isLocal ? 'You' : participantName}</span>
          <div className="flex gap-2">
            {isLocal && isMuted && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">MUTE</span>
            )}
            {isLocal && isVideoOff && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">VIDEO OFF</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
