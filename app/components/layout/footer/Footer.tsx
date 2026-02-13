export default function Footer() {
  return (
    <footer className="w-full mt-auto px-4 pb-4">
      <div className="max-w-xl mx-auto flex flex-col gap-3 items-center">
        <div className="w-full h-px bg-indigo-400/60" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
          <div>HD video</div>
          <div>Clear voice</div>
          <div>Several participants</div>
        </div>

        <div className="w-full flex flex-col gap-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <span className="text-center sm:text-left">Safe P2P connection</span>

            <span className="text-center sm:text-right">No data saved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
