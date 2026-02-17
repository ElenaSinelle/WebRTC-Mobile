'use client';

import { useParams } from 'next/navigation';
import { useMediaStream } from '@/app/hooks/useMediaStream';
import { useTrysteroRoom } from '@/app/hooks/useTrysteroRoom';
import { useRoom } from '@/app/hooks/useRoom';
import { ParticipantsGrid } from '@/app/components/conference/ParticipantsGrid';
import { ConferenceControls } from '@/app/components/conference/ConferenceControls';
import { RoomInfo } from '@/app/components/conference/RoomInfo';
import { Button } from '@/app/components/ui/Button';
import { useTelegramDetection } from '@/app/hooks/useTelegramDetection';
import { TelegramRedirect } from '@/app/components/ui/TelegramRedirect';

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const { isTelegram } = useTelegramDetection();

  const { stream: localStream, isMuted, isVideoOff, toggleMute, toggleVideo, error: mediaError } = useMediaStream();

  const {
    participants,
    isCreator,
    connectionStatus,
    endConference,
    leaveRoom: leavePeerRoom,
  } = useTrysteroRoom(roomId, localStream);

  const {
    copied,
    copyRoomLink,
    copyRoomId,
    leaveRoom: navigateLeave,
    showEndConfirmation,
    openEndConfirmation,
    closeEndConfirmation,
  } = useRoom(roomId);

  const handleLeave = () => {
    leavePeerRoom();
    navigateLeave();
  };

  const handleEndConference = () => {
    endConference();
    closeEndConfirmation();
    navigateLeave();
  };

  if (isTelegram) {
    return <TelegramRedirect />;
  }

  if (mediaError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger px-4 py-3 rounded-md">
          <p className="font-bold">Camera/microphone access error</p>
          <p>{mediaError}</p>
          <Button variant="primary" onClick={() => window.location.reload()} className="mt-4">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      <div className="bg-background-card rounded-md shadow-lg border border-border-secondary p-6">
        <RoomInfo isCreator={isCreator} participantsCount={participants.size} connectionStatus={connectionStatus} />
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
          isCreator={isCreator}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onCopyLink={copyRoomLink}
          onLeave={handleLeave}
          onEndConference={openEndConfirmation}
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
                All participants will be disconnected. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={closeEndConfirmation}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleEndConference}>
                  End conference
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
