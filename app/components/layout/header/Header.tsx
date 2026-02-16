'use client';

import { DebugConsole } from '../../debugConsole';

export default function Header() {
  return (
    <>
      <DebugConsole />
      <header className="w-full py-6 bg-background-primary backdrop-blur-sm border-b border-border-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide text-text-primary">
            WebRTC
            <span className="font-semibold text-text-primary ml-2">Conference</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-light">secure peer-to-peer video calls</p>
        </div>
      </header>
    </>
  );
}
