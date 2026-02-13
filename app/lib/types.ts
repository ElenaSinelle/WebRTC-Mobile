export interface Participant {
  id: string;
  stream?: MediaStream;
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
}

export interface RoomState {
  roomId: string;
  isCreator: boolean;
  participants: Map<string, Participant>;
  localStream: MediaStream | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
}

export interface MediaControls {
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
}
