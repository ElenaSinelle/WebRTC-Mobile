'use client';

import { VideoPlayer } from '../ui/VideoPlayer';
import type { Participant } from '@/app/lib/types';

interface ParticipantsGridProps {
  localStream: MediaStream | null;
  participants: Map<string, Participant>;
  isMuted: boolean;
  isVideoOff: boolean;
}

export const ParticipantsGrid = ({ localStream, participants, isMuted, isVideoOff }: ParticipantsGridProps) => {
  const participantsArray = Array.from(participants.values());

  return (
    <div className="grid w-full grid-cols-1 xl:grid-cols-2 gap-4">
      <VideoPlayer stream={localStream} isLocal isMuted={isMuted} isVideoOff={isVideoOff} participantName="You" />

      {participantsArray.map((participant, index) => (
        <VideoPlayer key={participant.id} stream={participant.stream} participantName={`Participant ${index + 1}`} />
      ))}
    </div>
  );
};
