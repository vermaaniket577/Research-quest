import './globals.css';
import React from 'react';
import { AppProvider } from '@/providers/app-provider';

export const metadata = {
  title: 'ResearchQuest - Academic Search Engine',
  description: 'Search, retrieve, and analyze academic papers across multiple databases using simple or semantic deep searches.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}