import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/common/ToastProvider';
import { PlayerProvider } from '@/context/PlayerContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlayerBar } from '@/components/layout/PlayerBar';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

export const metadata: Metadata = {
  title: 'SoundBridge (사운드브릿지) — 당신의 음악 언어로 국악을 만나세요',
  description: '사용자가 좋아하는 음악의 감성을 AI가 분석하여 가장 닮은 전통 국악과 샘플 라이브러리를 연결해 드립니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-sb-bg text-sb-primary antialiased font-sans">
        <ToastProvider>
          <PlayerProvider>
            {/* GNB */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 pb-[72px] md:pb-[56px]">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Audio Player */}
            <PlayerBar />

            {/* Mobile Bottom Tabbar */}
            <BottomTabBar />
          </PlayerProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

