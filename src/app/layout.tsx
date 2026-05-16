import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/context/AuthProvider';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });

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
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: #F5EDE9; border-radius: 3px; }
          ::-webkit-scrollbar-thumb { background: rgba(212,103,79,0.4); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(212,103,79,0.7); }
          * { scrollbar-width: thin; scrollbar-color: rgba(212,103,79,0.4) #F5EDE9; }
        `}</style>
      </head>
      <body className={spaceMono.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
