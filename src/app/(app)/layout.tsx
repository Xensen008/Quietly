import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quietly',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={inter.className}>
      <Navbar/>
      {children}
    </div>
  );
}
