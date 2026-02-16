export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-background-primary border-t border-border-secondary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <div className="flex gap-6">
            <span className="hover:text-text-primary transition cursor-pointer">HD video</span>
            <span className="hover:text-text-primary transition cursor-pointer">Clear voice</span>
            <span className="hover:text-text-primary transition cursor-pointer">Multi-peer</span>
          </div>

          <div className="flex gap-6">
            <span className="hover:text-text-primary transition cursor-pointer">P2P encrypted</span>
            <span className="hover:text-text-primary transition cursor-pointer">No data storage</span>
            <span className="hover:text-text-primary transition cursor-pointer">No registration</span>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-text-secondary">
          © {new Date().getFullYear()} WebRTC Conference. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
