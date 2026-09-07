import type { Metadata } from 'next';
import { ApplicationProvider } from '@/components/application-provider';
import { ClerkAuthBridge, ClerkRootProvider } from '@/components/clerk-auth-bridge';
import { LanguageProvider } from '@/lib/i18n';
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
        <ClerkRootProvider><ClerkAuthBridge><LanguageProvider><ApplicationProvider>{children}</ApplicationProvider></LanguageProvider></ClerkAuthBridge></ClerkRootProvider>
      </body>
    </html>
  );
}
