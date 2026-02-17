'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Room } from 'trystero';
import { createTrysteroRoom } from '../lib/trystero-config';
import type { Participant } from '../lib/types';
import { useMobileDetect } from './useMobileDetect';
import { useTelegramDetection } from './useTelegramDetection';

export const useTrysteroRoom = (roomId: string, localStream: MediaStream | null) => {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  // refs
  const roomRef = useRef<Room | null>(null);
  const streamsRef = useRef<Map<string, MediaStream>>(new Map());
  const peerStreamsSent = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const { isAndroid, isIOS } = useMobileDetect();
  const { isTelegramWebView } = useTelegramDetection();

  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      callback();
    }, delay);
    timeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  useEffect(() => {
    if (!localStream) {
      return;
    }

    let mounted = true;
    let reconnectTimeout: NodeJS.Timeout;

    setConnectionStatus('connecting');

    const initRoom = async () => {
      try {
        // create room and connect to it
        const room = createTrysteroRoom(roomId);
        roomRef.current = room;

        // get id from trystero
        const { selfId } = await import('trystero');

        if (!mounted) return;

        setMyPeerId(selfId);

        // send stream function
        const sendStreamToPeer = (targetPeerId?: string) => {
          try {
            if (targetPeerId) {
              room.addStream(localStream, targetPeerId);
              peerStreamsSent.current.add(targetPeerId);
              console.log(`Stream sent to peer: ${targetPeerId}`);
            } else {
              room.addStream(localStream);
              console.log('Stream broadcast to all peers');
            }
          } catch (error) {
            console.error('Error sending stream:', error);
          }
        };

        // initialization depending on platform
        if (isTelegramWebView) {
          console.log('Telegram WebView detected ');

          // Timeout for initialization in Telegram
          safeSetTimeout(() => {
            if (roomRef.current && localStream && mounted) {
              sendStreamToPeer();
            }
          }, 1000);
        } else if (isAndroid) {
          // Timeout for initialization on Android
          safeSetTimeout(() => {
            if (roomRef.current && localStream && mounted) {
              sendStreamToPeer();
            }
          }, 300);
        } else if (isIOS) {
          // initialization and timeout for ios
          // enable audio-tracks
          localStream.getAudioTracks().forEach((track) => {
            track.enabled = true;
          });

          // timeout for adding video for iOS
          safeSetTimeout(() => {
            if (roomRef.current && localStream && mounted) {
              sendStreamToPeer();

              //  invoke audio session for iOS
              const AudioContextClass =
                window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

              if (AudioContextClass) {
                const audioContext = new AudioContextClass();
                if (audioContext.state === 'suspended') {
                  audioContext.resume().then(() => {
                    console.log('AudioContext resumed for iOS');
                  });
                }
              }
            }
          }, 100);
        } else {
          // add stream for desktop immediately
          sendStreamToPeer();
        }

        // listen to new participants
        room.onPeerJoin((peerId: string) => {
          console.log('Peer joined:', peerId);

          const delay = isTelegramWebView ? 1000 : isIOS ? 200 : 0;

          // send stream to a new participant
          if (delay > 0) {
            safeSetTimeout(() => {
              if (roomRef.current && localStream && !peerStreamsSent.current.has(peerId) && mounted) {
                sendStreamToPeer(peerId);
              }
            }, delay);
          } else {
            if (roomRef.current && localStream && !peerStreamsSent.current.has(peerId) && mounted) {
              sendStreamToPeer(peerId);
            }
          }
        });

        // listen video-streams from other participants
        room.onPeerStream((stream: MediaStream, peerId: string) => {
          console.log('Received stream from:', peerId);

          if (!mounted) return;

          // activate audio for iOS
          if (isIOS || isTelegramWebView) {
            stream.getAudioTracks().forEach((track) => {
              track.enabled = true;
            });
          }

          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.set(peerId, {
              id: peerId,
              stream: stream,
              isAudioEnabled: true,
              isVideoEnabled: true,
            });
            return newMap;
          });

          streamsRef.current.set(peerId, stream);
        });

        // listen participants leave
        room.onPeerLeave((peerId: string) => {
          console.log('Peer left:', peerId);

          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.delete(peerId);
            return newMap;
          });

          streamsRef.current.delete(peerId);
          peerStreamsSent.current.delete(peerId);
        });

        setConnectionStatus('connected');
        setRetryCount(0);
        console.log('Room initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Trystero room:', error);

        // auto reconnect on error
        if (retryCount < 3 && mounted) {
          console.log(`Retrying connection (${retryCount + 1}/3)...`);
          setRetryCount((prev) => prev + 1);

          reconnectTimeout = safeSetTimeout(
            () => {
              if (mounted) {
                initRoom();
              }
            },
            2000 * (retryCount + 1),
          ); // Exponential backoff
        } else {
          setConnectionStatus('disconnected');
        }
      }
    };

    initRoom();

    // Cleanup on unmount
    return () => {
      mounted = false;

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        timeoutsRef.current.delete(reconnectTimeout);
      }

      timeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutsRef.current.clear();

      const currentRoom = roomRef.current;
      const currentStreams = streamsRef.current;
      const currentPeerStreams = peerStreamsSent.current;

      if (currentRoom) {
        console.log('Leaving room...');
        currentRoom.leave();
      }

      currentStreams.clear();
      currentPeerStreams.clear();

      setParticipants(new Map());
    };
  }, [roomId, localStream, isAndroid, isIOS, isTelegramWebView, retryCount, safeSetTimeout]);

  const leaveRoom = useCallback(() => {
    console.log('Leaving room...');
    const currentRoom = roomRef.current;
    const currentPeerStreams = peerStreamsSent.current;

    if (currentRoom) {
      currentRoom.leave();
      roomRef.current = null;
    }

    setParticipants(new Map());
    setConnectionStatus('disconnected');
    currentPeerStreams.clear();
  }, []);

  // first participant becomes creator
  const isCreator = participants.size === 0 && connectionStatus === 'connected';

  return {
    myPeerId,
    participants,
    isCreator,
    connectionStatus,
    leaveRoom,
    endConference: leaveRoom,
  };
};
