'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { useRouter } from 'next/navigation';

interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const [userId] = useState(() => `user-${Math.random().toString(36).substring(2, 9)}`);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'reconnecting'
  >('connecting');
  const [copied, setCopied] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const socketRef = useRef(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const router = useRouter();

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

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId, userId);
    }

    peersRef.current.forEach((peer) => {
      peer.connection.close();
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    router.push('/');
  };

  const endConferenceForAll = () => {
    if (socketRef.current) {
      socketRef.current.emit('end-room', roomId, userId);
      setShowEndConfirmation(false);

      peersRef.current.forEach((peer) => {
        peer.connection.close();
      });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-7xl flex flex-col gap-6 items-center py-6">
      <div className="flex flex-col gap-1 items-center justify-center">
        <h2 className="text-xl font-bold">Room ID: {roomId}</h2>
        <div className="flex items-center gap-2">{getStatusText()}</div>
        {isRoomCreator && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
            You are the organizer of the conference
          </span>
        )}
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

      <div className="flex gap-4 mb-4">
        <button
          onClick={leaveRoom}
          className="inline-flex items-center gap-3 rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base font-medium transition-all duration-200 active:scale-95 leading-none bg-orange-200 hover:bg-orange-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Покинуть комнату
        </button>

        {isRoomCreator && (
          <>
            <button
              onClick={() => setShowEndConfirmation(true)}
              className="inline-flex items-center gap-3 rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base font-medium transition-all duration-200 active:scale-95 leading-none bg-red-500 hover:bg-red-600 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Завершить конференцию
            </button>

            {showEndConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                  <h3 className="text-lg font-semibold mb-4">Завершить конференцию?</h3>
                  <p className="text-gray-600 mb-6">Все участники будут отключены. Это действие нельзя отменить.</p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowEndConfirmation(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={endConferenceForAll}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Завершить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isReconnecting && <div className="font-semibold text-accent-800">Reconnecting to server...</div>}
    </div>
  );
}
