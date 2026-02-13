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
    <div className="w-full max-w-xl flex flex-col gap-6 items-center justify-center py-10">
      <div className="w-full max-w-xl flex gap-2 items-center justify-center">
        <div className="text-sm font-400">Create new conference:</div>
        <Button onClick={createRoom}>Create new room</Button>
      </div>

      <form onSubmit={joinRoom} className="w-full max-w-xl flex gap-2 items-center justify-center">
        <label htmlFor="roomId" className="text-sm font-400">
          Enter a conference with RoomID
        </label>
        {/*  TODO: input component  */}
        <input
          id="roomId"
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          autoComplete="off"
          className="rounded-l bg-yellow-50 px-3 py-2 text-sm font-400 h-10 outline-yellow-200"
        />

        <Button type="submit" disabled={!roomId.trim()}>
          Join
        </Button>
      </form>
    </div>
  );
}
