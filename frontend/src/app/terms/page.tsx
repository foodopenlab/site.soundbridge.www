import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 font-sans select-none">
      {/* Header */}
      <div className="border-b border-sb-border pb-4 mb-8">
        <h1 className="text-[24px] font-medium text-sb-primary mb-2">이용약관</h1>
        <div className="flex justify-between items-center text-[12px] text-sb-muted">
          <span>최종 업데이트: 2026년 6월 10일</span>
          <span className="font-medium">KO</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 text-[#3A3835] text-[14px] leading-[1.9]">
        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">1. 서비스 소개 및 목적</h2>
          <p>
            본 약관은 <strong>SoundBridge (사운드브릿지)</strong>가 제공하는 웹 서비스 및 관련 기능의 이용 조건과 절차를 규정합니다. SoundBridge는 국립국악원 공공누리 제1유형 및 제2유형 라이선스 음원을 기반으로 사용자가 좋아하는 대중음악 언어를 AI 감성 분석 기술(Gemini API 등)을 통해 국악과 매칭하고 창작용 오디오 샘플을 라이브러리 형태로 제공하는 혁신적 서비스입니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">2. 계정 및 회원가입</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>서비스 이용자는 만 14세 이상이어야 하며, 약관에 동의함으로써 가입이 승인됩니다.</li>
            <li>가입은 Google OAuth를 통한 소셜 로그인 및 이메일 계정 등록 방식을 제공합니다.</li>
            <li>이용자는 본인의 개인정보를 보호할 의무가 있으며, 계정 도용 및 불법적 이용에 따른 책임은 이용자 본인에게 있습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">3. 서비스 이용 규칙</h2>
          <p>
            이용자는 서비스가 제공하는 검색, 큐레이션 및 음원 샘플 다운로드 서비스를 자유롭게 이용할 수 있습니다. 다만, 서비스의 정상적인 운영을 방해하는 해킹, 대량 자동화 스크립트 실행, API 무단 크롤링 행위는 엄격히 금지됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">4. 콘텐츠 및 저작권</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>SoundBridge에서 제공하는 오디오 샘플 및 음원은 국립국악원이 창작하고 배포한 공공누리 음원을 바탕으로 합니다.</li>
            <li>
              <strong>상업 가능(KOGL 제1유형)</strong> 표기 음원은 개인적·상업적 용도의 2차적 저작물 제작에 제한 없이 무료로 활용할 수 있습니다. 단, 원본 음원을 수정 없이 그대로 재판매하는 행위는 제한됩니다.
            </li>
            <li>
              <strong>출처 표시(KOGL 제2유형)</strong> 표기 음원은 비상업적 용도 및 저작물 이용 시 반드시 원출처(국립국악원) 및 공공누리 라이선스 표시 의무가 적용됩니다.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">5. 서비스 변경 및 중단</h2>
          <p>
            서비스는 향후 기술 개발, 정부 공공 데이터 정책의 변화 및 운영비 등의 이유로 서비스 기능의 일부 또는 전부를 수정하거나 일시 중단할 수 있습니다. 이러한 경우 사전 공지사항을 통해 고지함을 원칙으로 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">6. 면책 조항</h2>
          <p>
            SoundBridge의 AI 기반 음악 감성 번역 및 연결 추천 결과는 참고용일 뿐이며, 주관적 감상에 기반하므로 물리적 일치도나 음악적 정확성을 보장하지 않습니다. 또한 외부 네트워크 마비, 공공 API 서버 장애로 인한 손실에 대해 플랫폼은 책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">7. 준거법 및 관할</h2>
          <p>
            본 약관의 해석 및 서비스 이용과 관련된 분쟁에 대해서는 대한민국 법률을 준거법으로 적용하며, 발생하는 소송에 대한 관할 법원은 서울중앙지방법원을 제1심 법원으로 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
