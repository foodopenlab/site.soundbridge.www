import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-sb-surface border-t border-sb-border py-8 px-4 font-sans text-center md:text-left">
      <div className="max-w-[1080px] mx-auto flex flex-col gap-5">
        {/* Row 1 - Logo & Tagline */}
        <div className="flex flex-col md:flex-row md:items-baseline gap-2">
          <span className="text-[14px] font-medium text-sb-primary">SoundBridge</span>
          <span className="text-[12px] text-sb-muted">국악 감성 번역 + 샘플 라이브러리</span>
        </div>

        {/* Row 2 - Legal Links & Contact */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-[12px] text-sb-muted font-normal">
          <Link href="/terms" className="hover:text-sb-primary transition-colors">
            이용약관
          </Link>
          <span className="text-sb-border">|</span>
          <Link href="/privacy" className="hover:text-sb-primary transition-colors font-medium">
            개인정보처리방침
          </Link>
          <span className="text-sb-border">|</span>
          <a href="mailto:support@soundbridge.site" className="hover:text-sb-primary transition-colors">
            문의하기
          </a>
        </div>

        {/* Row 3 - Copyright & Attribution */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2 text-[11px] text-sb-muted border-t border-sb-border/50 pt-4 mt-1">
          <span>
            © {new Date().getFullYear()} SoundBridge. 국립국악원 공공누리 1유형 음원 활용.
          </span>
          <span className="font-mono text-[10px] md:text-[11px]">
            Made with Gemini API · pgvector
          </span>
        </div>
      </div>
    </footer>
  );
};
