'use client';

import { useParams } from 'next/navigation';
import { useMediaStream } from '@/app/hooks/useMediaStream';
import { useTrysteroRoom } from '@/app/hooks/useTrysteroRoom';
import { useRoom } from '@/app/hooks/useRoom';
import { ParticipantsGrid } from '@/app/components/conference/ParticipantsGrid';
import { ConferenceControls } from '@/app/components/conference/ConferenceControls';
import { RoomInfo } from '@/app/components/conference/RoomInfo';
import { Button } from '@/app/components/ui/Button';
import { TgHintLoader } from '@/app/components/ui/telegram/TgHintLoader';

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;

  const {
    stream: localStream,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    error: mediaError,
    retryAccess,
  } = useMediaStream();

  const { participants, connectionStatus, leaveRoom } = useTrysteroRoom(roomId, localStream);

  const {
    copied,
    copyRoomLink,
    copyRoomId,
    navigateLeave,
    showEndConfirmation,
    openEndConfirmation,
    closeEndConfirmation,
  } = useRoom(roomId);

  const handleLeave = () => {
    leaveRoom();
    navigateLeave();
  };

  if (mediaError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger px-4 py-3 rounded-md">
          <p className="font-bold">Camera/microphone access error</p>
          <p>{mediaError}</p>
          <Button
            variant="primary"
            onClick={async () => {
              const success = await retryAccess?.();
              if (!success) {
                window.location.reload();
              }
            }}
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      <TgHintLoader />
      <div className="bg-background-card rounded-md shadow-lg border border-border-secondary p-6">
        <RoomInfo participantsCount={participants.size} connectionStatus={connectionStatus} />
      </div>

      <div className="bg-background-card rounded-md shadow-lg border border-border-secondary p-6">
        <ParticipantsGrid
          localStream={localStream}
          participants={participants}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
        />
      </div>
      <div className="bg-background-card rounded-md shadow-lg border border-border-secondary">
        <ConferenceControls
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onCopyLink={copyRoomLink}
          onLeave={openEndConfirmation}
          copiedLink={copied === 'link'}
          onCopyRoomId={copyRoomId}
          copiedId={copied === 'id'}
        />
      </div>

      {showEndConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background-card rounded-md shadow-xl max-w-sm w-full border border-border-secondary">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-2">End conference?</h3>
              <p className="text-text-secondary mb-6">
                {participants.size === 0
                  ? 'You are the only participant. The room will be closed.'
                  : 'Are you sure you want to leave the conference?'}
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={closeEndConfirmation}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleLeave}>
                  Leave room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
