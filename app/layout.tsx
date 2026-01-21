import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dale Wiggins',
  description: 'Full stack web/web3 developer | 🏐 🎾 ⚾ player | On enlightenment path',
  icons: {
    icon: '/assets/tree.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
