'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Room } from 'trystero';
import { createTrysteroRoom } from '../lib/trystero-config';
import type { Participant } from '../lib/types';
import { useMobileDetect } from './useMobileDetect';

export const useTrysteroRoom = (roomId: string, localStream: MediaStream | null) => {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [myPeerId, setMyPeerId] = useState<string>('');

  const roomRef = useRef<Room | null>(null);
  const streamsRef = useRef<Map<string, MediaStream>>(new Map());
  const { browser, isAndroid } = useMobileDetect();

  useEffect(() => {
    if (!localStream) {
      // console.log('Waiting for local stream...');
      return;
    }

    let mounted = true;
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
        console.log('Connected to Trystero room with ID:', selfId);
        console.log('browser: ', browser);

        if (isAndroid) {
          // Timeout for initialisation on Android
          setTimeout(() => {
            if (roomRef.current && localStream) {
              roomRef.current.addStream(localStream);
              console.log('Local stream added to room (Android delay)');
            }
          }, 300);
        } else {
          room.addStream(localStream);
        }

        // send stream to all participants
        room.addStream(localStream);
        // console.log('Local stream added to room');

        if (roomRef.current) {
          // invoking ICE-gathering
          setTimeout(() => {
            console.log('Forcing ICE candidate gathering...');
          }, 500);
        }

        // listen to new participants
        room.onPeerJoin((peerId: string) => {
          // console.log('Peer joined:', peerId);

          // send stream to a new participant
          room.addStream(localStream, peerId);
        });

        // listen video-streams from other participants
        room.onPeerStream((stream: MediaStream, peerId: string) => {
          // console.log('Received stream from:', peerId);

          if (!mounted) return;

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
          // console.log('Peer left:', peerId);

          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.delete(peerId);
            return newMap;
          });

          streamsRef.current.delete(peerId);
        });

        setConnectionStatus('connected');
        // console.log('Trystero room initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Trystero room:', error);
        setConnectionStatus('disconnected');
      }
    };

    initRoom();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (roomRef.current) {
        // console.log('Leaving room...');
        roomRef.current.leave();
      }
    };
  }, [roomId, localStream]);

  const leaveRoom = useCallback(() => {
    // console.log('Leaving room...');
    if (roomRef.current) {
      roomRef.current.leave();
    }
    setParticipants(new Map());
    setConnectionStatus('disconnected');
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
