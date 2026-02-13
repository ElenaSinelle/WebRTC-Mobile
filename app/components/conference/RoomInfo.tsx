'use client';

interface RoomInfoProps {
  roomId: string;
  isCreator: boolean;
  participantsCount: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
}

export const RoomInfo = ({ roomId, isCreator, participantsCount, connectionStatus }: RoomInfoProps) => {
  const statusColors = {
    connecting: 'text-yellow-600',
    connected: 'text-green-600',
    disconnected: 'text-red-600',
    reconnecting: 'text-orange-600',
  };

  const statusText = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    reconnecting: 'Reconnecting...',
  };
  const totalParticipants = participantsCount + 1;

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="text-xl font-bold">
        Room: <span className="font-mono">{roomId}</span>
      </h2>

      <div className="flex items-center gap-4 text-sm">
        <span className={statusColors[connectionStatus]}>● {statusText[connectionStatus]}</span>
        <span className="text-gray-600">Participants: {totalParticipants}</span>
      </div>

      {isCreator && (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
          Conference organizer
        </span>
      )}

      {participantsCount === 0 && connectionStatus === 'connected' && (
        <div className="flex flex-col gap-2 items-center mt-4">
          <p className="text-gray-600">Waiting for participants...</p>
          <p className="text-sm text-gray-500">Share the room link to invite others</p>
        </div>
      )}
    </div>
  );
};
