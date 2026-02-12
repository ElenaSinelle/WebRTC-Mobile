'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';

interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [userId] = useState(() => `user-${Math.random().toString(36).substring(2, 9)}`);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'reconnecting'
  >('connecting');
  const [copied, setCopied] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const copyRoomLink = async () => {
    const link = window.location.href;
    console.log(link);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full max-w-7xl flex flex-col gap-6 items-center py-6">
      <div className="flex flex-col gap-1 items-center justify-center">
        <h2 className="text-xl font-bold">Room ID: {roomId}</h2>
        <div className="flex items-center gap-2">{getStatusText()}</div>
      </div>

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="relative aspect-video rounded-l overflow-hidden shadow-xl border-1">
          <video ref={localVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold flex items-center gap-2">You</span>
              <div className="flex gap-2">
                {isMuted && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">🔇 MUTE</span>
                )}
                {isVideoOff && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">📹 OFF</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {peers.map((peer, index) => (
          <div key={peer.userId} className="relative aspect-video rounded-l overflow-hidden shadow-xl border-1">
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              ref={(videoElement) => {
                if (videoElement && peer.stream) {
                  videoElement.srcObject = peer.stream;
                }
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-white font-semibold flex items-center gap-2">Participant {index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {peers.length === 0 && (
        <div className="flex flex-col gap-2 items-center justify-center">
          <h3 className="text-xl font-semibold">Waiting for participants...</h3>
          {/* TODO:  Button component */}
          <button
            onClick={copyRoomLink}
            className="
            inline-flex items-center justify-center
            rounded-lg
            bg-yellow-100
            text-sm sm:text-base
            px-4 sm:px-6
            py-2
            font-medium
            transition
            duration-200
            ease-out
          enabled:hover:bg-yellow-200
            enabled:active:scale-95
            disabled:opacity-50
            disabled:cursor-auto"
          >
            Copy room link
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {/* TODO:  Button component */}
        <button
          onClick={toggleMute}
          className={`
            inline-flex items-center gap-3
            rounded-lg
            px-4 sm:px-6
            py-2
            text-sm sm:text-base
            font-medium
            transition-all duration-200
            active:scale-95
            leading-none
            ${isMuted ? 'bg-red-200 hover:bg-red-300' : ' bg-yellow-100 hover:bg-yellow-200'}
          `}
        >
          {isMuted ? (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  clipRule="evenodd"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
              Micro on
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Micro Off
            </>
          )}
        </button>

        {/* TODO:  Button component */}
        <button
          onClick={toggleVideo}
          className={`
            inline-flex items-center gap-3
            rounded-lg
            px-4 sm:px-6
            py-2
            text-sm sm:text-base
            font-medium
            transition-all duration-200
            active:scale-95
            leading-none
            ${isVideoOff ? 'bg-red-200 hover:bg-red-300' : ' bg-yellow-100 hover:bg-yellow-200'}
          `}
        >
          {isVideoOff ? (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
              Camera on
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Camera off
            </>
          )}
        </button>
      </div>

      {isReconnecting && <div className="font-semibold text-accent-800">Reconnecting to server...</div>}
    </div>
  );
}
