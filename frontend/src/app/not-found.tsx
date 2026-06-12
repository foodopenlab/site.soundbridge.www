import React from 'react';
import Link from 'next/link';
import { Music, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-[120px] flex flex-col items-center justify-center text-center font-sans select-none">
      {/* Icon Area */}
      <div className="relative mb-6">
        <Music className="w-12 h-12 text-sb-muted" />
        <HelpCircle className="w-6 h-6 text-sb-accent absolute -bottom-1 -right-1 bg-sb-bg rounded-full" />
      </div>

      {/* Message */}
      <h2 className="text-[20px] font-medium text-sb-primary mb-2">
        페이지를 찾을 수 없어요
      </h2>
      <p className="text-[13px] text-sb-muted max-w-[320px] leading-relaxed mb-8">
        요청하신 페이지가 이동되었거나 주소가 올바르지 않습니다. 다시 한 번 확인해 주세요.
      </p>

      {/* Action */}
      <Link
        href="/"
        className="bg-sb-primary text-sb-bg px-5 py-2.5 text-[13px] font-medium rounded-lg hover:bg-[#333333] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
