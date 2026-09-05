import type { Metadata } from 'next';
import { PrototypeStore } from '@/components/prototype-store';
import './globals.css';

export const metadata: Metadata = {
  title: 'KisanMitra · Agricultural trade workspace',
  description: 'A clear operating workspace for agricultural trade participants.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PrototypeStore>{children}</PrototypeStore>
      </body>
    </html>
  );
}
