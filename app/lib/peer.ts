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
      this.peer = new Peer();

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
