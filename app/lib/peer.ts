import Peer from 'peerjs';

class PeerService {
  private peer: Peer | null = null;
  private static instance: PeerService;

  private constructor() {}

  static getInstance(): PeerService {
    if (!PeerService.instance) {
      PeerService.instance = new PeerService();
    }
    return PeerService.instance;
  }

  initialize(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:stun.ekiga.net' },
            { urls: 'stun:stun.ideasip.com' },
            { urls: 'stun:stun.schlund.de' },
            { urls: 'stun:stun.stunprotocol.org:3478' },
            { urls: 'stun:stun.voiparound.com' },
            { urls: 'stun:stun.voipbuster.com' },
          ],
        },
      });

      this.peer.on('open', (id) => {
        console.log('PeerJS initialized with ID:', id);
        resolve(id);
      });

      this.peer.on('error', (error) => {
        console.error('PeerJS error:', error);
        reject(error);
      });
    });
  }

  getPeer(): Peer | null {
    return this.peer;
  }

  destroy() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export const peerService = PeerService.getInstance();
