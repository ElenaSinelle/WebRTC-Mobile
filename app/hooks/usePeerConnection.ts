'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { peerService } from '../lib/peer';
import type { Participant } from '../lib/types';

export const usePeerConnection = (roomId: string, localStream: MediaStream | null) => {
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'reconnecting'
  >('connecting');

  const peerRef = useRef<Peer | null>(null);
  const callsRef = useRef<Map<string, MediaConnection>>(new Map());

  const isCreator = useMemo(() => {
    if (!myPeerId || !roomId) return false;

    const roomParticipants = localStorage.getItem(`room_${roomId}`);
    const existingParticipants = roomParticipants ? JSON.parse(roomParticipants) : [];

    return existingParticipants.length === 0;
  }, [myPeerId, roomId]);

  useEffect(() => {
    let mounted = true;

    const initPeer = async () => {
      try {
        setConnectionStatus('connecting');
        const peerId = await peerService.initialize();

        if (!mounted) return;

        setMyPeerId(peerId);
        setConnectionStatus('connected');

        peerRef.current = peerService.getPeer();

        peerRef.current?.on('call', (call: MediaConnection) => {
          if (!localStream) return;

          call.answer(localStream);

          call.on('stream', (remoteStream: MediaStream) => {
            setParticipants((prev) => {
              const newMap = new Map(prev);
              newMap.set(call.peer, {
                id: call.peer,
                stream: remoteStream,
                isAudioEnabled: true,
                isVideoEnabled: true,
              });
              return newMap;
            });
          });

          call.on('close', () => {
            setParticipants((prev) => {
              const newMap = new Map(prev);
              newMap.delete(call.peer);
              return newMap;
            });
            callsRef.current.delete(call.peer);
          });

          callsRef.current.set(call.peer, call);
        });
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    initPeer();

    return () => {
      mounted = false;
    };
  }, [localStream]);

  const callParticipant = useCallback(
    (peerId: string) => {
      if (!peerRef.current || !localStream) return;
      if (callsRef.current.has(peerId)) return;

      const call = peerRef.current.call(peerId, localStream);

      call.on('stream', (remoteStream: MediaStream) => {
        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.set(peerId, {
            id: peerId,
            stream: remoteStream,
            isAudioEnabled: true,
            isVideoEnabled: true,
          });
          return newMap;
        });
      });

      call.on('close', () => {
        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.delete(peerId);
          return newMap;
        });
        callsRef.current.delete(peerId);
      });

      callsRef.current.set(peerId, call);
    },
    [localStream],
  );

  useEffect(() => {
    if (myPeerId && roomId) {
      const roomParticipants = localStorage.getItem(`room_${roomId}`);
      const existingParticipants = roomParticipants ? JSON.parse(roomParticipants) : [];

      // call existing participants
      if (existingParticipants.length > 0) {
        existingParticipants.forEach((participantId: string) => {
          if (participantId !== myPeerId) {
            callParticipant(participantId);
          }
        });
      }

      // add organizer (yourself)
      const updatedParticipants = [...existingParticipants, myPeerId];
      localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedParticipants));

      return () => {
        const currentParticipants = localStorage.getItem(`room_${roomId}`);
        if (currentParticipants) {
          const list = JSON.parse(currentParticipants);
          const filtered = list.filter((id: string) => id !== myPeerId);

          if (filtered.length === 0) {
            localStorage.removeItem(`room_${roomId}`);
          } else {
            localStorage.setItem(`room_${roomId}`, JSON.stringify(filtered));
          }
        }
      };
    }
  }, [myPeerId, roomId, callParticipant]);

  const endConference = useCallback(() => {
    if (!isCreator) return;

    callsRef.current.forEach((call) => {
      call.close();
    });
    callsRef.current.clear();

    localStorage.removeItem(`room_${roomId}`);
    setParticipants(new Map());
  }, [isCreator, roomId]);

  const leaveRoom = useCallback(() => {
    callsRef.current.forEach((call) => {
      call.close();
    });
    callsRef.current.clear();
    setParticipants(new Map());
  }, []);

  return {
    myPeerId,
    participants,
    isCreator,
    connectionStatus,
    callParticipant,
    endConference,
    leaveRoom,
  };
};
