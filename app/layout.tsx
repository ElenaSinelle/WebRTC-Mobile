import type { Metadata } from 'next';
import './globals.css';
import Header from './components/header/header';
import Footer from './components/footer/footer';

export const metadata: Metadata = {
  title: 'WebRTC App',
  description: 'Multi-user video chat application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh w-full flex flex-col">
        <Header />
        <main className="flex-1 w-full flex justify-center px-4 sm:px-6 md:px-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
