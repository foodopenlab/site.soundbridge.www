'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { GhostButton } from '@/components/common/GhostButton';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled app-level error:', error);
  }, [error]);

  return (
    <div className="max-w-[720px] mx-auto px-6 py-[120px] flex flex-col items-center justify-center text-center font-sans select-none">
      {/* Icon Area */}
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-sb-error mb-6">
        <AlertTriangle className="w-6 h-6" />
      </div>

      {/* Message */}
      <h2 className="text-[20px] font-medium text-sb-primary mb-2">
        일시적인 오류가 발생했어요
      </h2>
      <p className="text-[13px] text-sb-muted max-w-[340px] leading-relaxed mb-8">
        서버와의 연결이 부드럽지 않거나 시스템 에러가 감지되었습니다. 일시적인 현상일 수 있으니 새로고침을 시도해 보세요.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <GhostButton onClick={() => reset()} className="px-5 py-2.5 text-[13px] font-medium">
          새로고침
        </GhostButton>
        <Link href="/">
          <PrimaryButton className="px-5 py-2.5 text-[13px] font-medium">
            홈으로 이동
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
