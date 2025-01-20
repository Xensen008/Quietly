import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/context/AuthProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quietly - Share secrets Quietly',
  description: 'Share and receive anonymous feedback with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          ::-webkit-scrollbar {
            width: 5px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.4);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(168, 85, 247, 0.6);
          }
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 85, 247, 0.4) rgba(0, 0, 0, 0.3);
          }
          html {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 85, 247, 0.4) rgba(0, 0, 0, 0.3);
          }
          body {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 85, 247, 0.4) rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
