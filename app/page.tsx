'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      {/*  TODO: Card component with button Create room  */}
      <div className="w-full max-w-xl flex gap-2 items-center justify-center">
        <div className="text-sm font-400">Create new conference:</div>
        {/* TODO:  Button component */}
        <button
          onClick={createRoom}
          className="
            inline-flex items-center justify-center
            rounded-lg
            bg-yellow-100
            text-sm sm:text-base
            px-4 sm:px-6
            py-2
            font-medium
            transition
            duration-200
            ease-out
          enabled:hover:bg-yellow-200
            enabled:active:scale-95
            disabled:opacity-50
            disabled:cursor-auto"
        >
          Create new room
        </button>
      </div>

      {/* TODO: Join Room Form */}
      <form onSubmit={joinRoom} className="w-full max-w-xl flex gap-2 items-center justify-center">
        <label htmlFor="roomId" className="text-sm font-400">
          Enter a conference with RoomID
        </label>

        <input
          id="roomId"
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          autoComplete="off"
          className="rounded-l bg-yellow-50 px-3 py-2 text-sm font-400 h-10 outline-yellow-200"
        />

        <button
          type="submit"
          className="
            inline-flex items-center justify-center
            rounded-lg
            bg-yellow-100
            text-sm sm:text-base
            px-4 sm:px-6
            py-2
            font-medium
            transition
            duration-200
            ease-out
          enabled:hover:bg-yellow-200
            enabled:active:scale-95
            disabled:opacity-50
            disabled:cursor-auto
         "
          disabled={!roomId.trim()}
        >
          Join
        </button>
      </form>
    </div>
  );
}
