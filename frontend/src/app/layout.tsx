import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Earth Information Jukebox',
    template: '%s — Earth Information Jukebox',
  },
  description:
    'Transform NASA Earth observation visualizations into immersive musical soundscapes using computer vision and real-time audio synthesis.',
  keywords: [
    'NASA',
    'Earth observation',
    'data sonification',
    'computer vision',
    'OpenCV',
    'Tone.js',
    'Space Apps Challenge',
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-space-black text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-nasa-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-space-black"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex flex-1 flex-col pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
