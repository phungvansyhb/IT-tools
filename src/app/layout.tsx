import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/glass.css';
import '@/styles/bento.css';
import { UserWorkspaceProvider } from '@/hooks/useUserWorkspace';
import { AppShell } from '@/components/layout/AppShell';
import { buildHomeMetadata } from '@/lib/seo';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = buildHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <UserWorkspaceProvider>
          <AppShell>{children}</AppShell>
        </UserWorkspaceProvider>
      </body>
    </html>
  );
}
