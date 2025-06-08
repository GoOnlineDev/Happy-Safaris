"use client";

import { ClerkProvider} from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import ConvexClientProvider from './ConvexClientProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="happy-safaris-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
} 