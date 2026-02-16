'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-8 items-center justify-center py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-text-primary">Start a call</h2>
        <p className="text-text-secondary text-sm">Create a new room or join existing one</p>
      </div>

      <div className="w-full bg-background-card rounded-md p-8 shadow-lg border border-border-secondary">
        <div className="flex flex-col gap-6">
          <Button onClick={createRoom} variant="primary" size="lg" fullWidth>
            <span className="text-lg">✨</span>
            Create new room
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-secondary"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-background-card text-text-secondary">or join with ID</span>
            </div>
          </div>

          <form onSubmit={joinRoom} className="flex flex-col gap-4">
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID (e.g. x38yxakx)"
              autoComplete="off"
              className="w-full px-4 py-3 bg-background-input border border-border-secondary rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-text-primary focus:border-transparent transition"
            />

            <Button type="submit" variant="outline" size="lg" fullWidth disabled={!roomId.trim()}>
              Join room
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
