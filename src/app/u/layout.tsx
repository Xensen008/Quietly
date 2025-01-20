import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Send Anonymous Message - Quietly',
  description: 'Send anonymous messages on Quietly.',
};

export default function AnonymousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      {children}
      <Toaster />
    </div>
  );
} 