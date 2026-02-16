'use client';

import { Button } from '../ui/Button';

interface ConferenceControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isCreator: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onCopyLink: () => void;
  onLeave: () => void;
  onEndConference: () => void;
  copiedLink: boolean;
  onCopyRoomId: () => void;
  copiedId: boolean;
}

export const ConferenceControls = ({
  isMuted,
  isVideoOff,
  isCreator,
  onToggleMute,
  onToggleVideo,
  onCopyLink,
  onLeave,
  onEndConference,
  copiedLink,
  onCopyRoomId,
  copiedId,
}: ConferenceControlsProps) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto bg-background-card p-6 ">
      {/* Media controls */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onToggleMute} variant={isMuted ? 'danger' : 'primary'} size="md">
          {isMuted ? 'Enable microphone' : 'Disable microphone'}
        </Button>

        <Button onClick={onToggleVideo} variant={isVideoOff ? 'danger' : 'primary'} size="md">
          {isVideoOff ? 'Enable camera' : 'Disable camera'}
        </Button>
      </div>

      {/* Share controls */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onCopyLink} variant="secondary" size="md">
          {copiedLink ? 'Link copied!' : 'Copy room link'}
        </Button>

        <Button onClick={onCopyRoomId} variant="secondary" size="md">
          {copiedId ? 'Room Id copied!' : 'Copy room ID'}
        </Button>
      </div>

      {/* Session controls */}
      <div className="flex flex-wrap justify-center gap-3 pt-2 border-t border-border-secondary">
        <Button onClick={onLeave} variant="secondary" size="md">
          Leave room
        </Button>

        {isCreator && (
          <Button onClick={onEndConference} variant="danger" size="md">
            End conference
          </Button>
        )}
      </div>
    </div>
  );
};
