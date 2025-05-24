import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lora, Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#1a2421',
};

export const metadata: Metadata = {
  title: 'Happy African Safaris',
  description: 'Experience the magic of African safaris',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        playfair.variable,
        lora.variable
      )}>
        <Providers>

          <main >
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}