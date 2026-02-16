'use client';

interface RoomInfoProps {
  isCreator: boolean;
  participantsCount: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export const RoomInfo = ({ isCreator, participantsCount, connectionStatus }: RoomInfoProps) => {
  const statusColors = {
    connecting: 'text-warning',
    connected: 'text-success',
    disconnected: 'text-status-danger',
  };

  const statusText = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
  };

  const totalParticipants = participantsCount + 1;

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <div className="flex items-center gap-4 text-sm">
        <span className={`${statusColors[connectionStatus]} font-medium`}>{statusText[connectionStatus]}</span>
        <span className="text-text-secondary">
          Participants: <span className="font-semibold text-text-primary">{totalParticipants}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {isCreator && (
          <span className="bg-background-secondary text-text-primary px-4 py-1.5 rounded-full text-xs font-medium border border-border-secondary shadow-sm">
            You are the host
          </span>
        )}

        {!isCreator && connectionStatus === 'connected' && (
          <span className="bg-background-input text-text-primary px-4 py-1.5 rounded-full text-xs font-medium border border-border-secondary shadow-sm">
            You joined as participant
          </span>
        )}
      </div>

      {participantsCount === 0 && connectionStatus === 'connected' && isCreator && (
        <div className="mt-2 text-center">
          <p className="text-text-secondary text-sm flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Waiting for participants to join...
          </p>
        </div>
      )}
    </div>
  );
};
