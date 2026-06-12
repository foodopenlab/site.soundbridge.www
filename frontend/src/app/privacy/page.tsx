import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 font-sans select-none">
      {/* Header */}
      <div className="border-b border-sb-border pb-4 mb-8">
        <h1 className="text-[24px] font-medium text-sb-primary mb-2">개인정보처리방침</h1>
        <div className="flex justify-between items-center text-[12px] text-sb-muted">
          <span>최종 업데이트: 2026년 6월 10일</span>
          <span className="font-medium">KO</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 text-[#3A3835] text-[14px] leading-[1.9]">
        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">1. 수집하는 개인정보</h2>
          <p>
            SoundBridge는 원활한 회원가입, 맞춤형 AI 번역 이력 관리 및 샘플 다운로드 로그 관리를 위해 필요한 최소한의 개인정보를 수집하고 있습니다.
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>
              <strong>Google 소셜 로그인 가입 시:</strong> 이용자 식별 식별자(ID), 프로필 이름, 이메일 주소, 프로필 이미지 URL
            </li>
            <li>
              <strong>이메일 회원가입 시:</strong> 이름, 이메일 주소, 비밀번호(해시 처리된 암호화 데이터)
            </li>
            <li>
              <strong>자동 생성 정보:</strong> 서비스 이용 과정에서 자동으로 수집될 수 있는 검색 쿼리 기록, 저장한 국악 트랙 정보, 음원 다운로드 이력, 접속 IP 주소, 브라우저 정보 및 방문 일시
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">2. 수집 목적 및 이용</h2>
          <p>수집된 개인정보는 다음의 구체적 목적으로만 이용되며, 목적이 변경될 경우 반드시 사전 동의 절차를 진행합니다.</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>회원 식별, 본인 인증 및 계정 로그인 기능 지원</li>
            <li>좋아하는 국악 곡 저장(하트 기능) 및 다운로드 내역 재다운로드 등 맞춤 기능 제공</li>
            <li>AI 기반 음악 분석 서비스 제공 및 사용자 경험 분석을 통한 서비스 고도화</li>
            <li>보안 위협 대응 및 비정상적 다중 계정 가입 시도 방지</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">3. 보유 및 파기</h2>
          <p>
            원칙적으로 회원 탈퇴 시 수집된 모든 개인정보 및 서비스 사용 이력은 즉각 파기 및 기술적으로 완전 복구 불가능하게 삭제 처리됩니다. 법령상 별도로 보존할 의무가 부과된 경우에는 해당 보관 규정(최대 5년)에 따라 물리적으로 격리 보관합니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">4. 제3자 제공 및 외부 위탁</h2>
          <p>
            SoundBridge는 법적 의무 사항이 발생하거나 이용자가 사전에 명시적으로 동의한 경우를 제외하고는 수집한 개인정보를 제3자에게 임의로 제공하거나 공유하지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">5. 외부 서비스 연동 고지</h2>
          <p>더 안정적인 서비스 제공을 위해 아래와 같은 글로벌 검증 인프라 및 클라우드를 활용하고 있습니다.</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li><strong>Google Cloud (Gemini API / OAuth):</strong> AI 감성 번역 및 소셜 계정 가입 처리</li>
            <li><strong>Neon DB / Supabase:</strong> 클라우드 기반 데이터베이스 및 암호화 이력 보존</li>
            <li><strong>Vercel Inc:</strong> 글로벌 정적 페이지 및 클라우드 컴퓨팅 서버 웹 호스팅</li>
            <li><strong>Resend / SendGrid:</strong> 회원 인증용 이메일 자동 발송 서비스</li>
          </ul>
          <p className="mt-2 text-[12px] text-sb-muted font-normal">
            * 각 연동 서비스는 전 세계 표준 데이터 프라이버시(GDPR / CCPA) 기준을 충족하는 인프라를 사용하며 한국 개인정보보호법에 준해 데이터를 보호합니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">6. 이용자의 권리</h2>
          <p>
            이용자는 언제든 본인의 정보를 조회, 수정할 수 있으며 회원 탈퇴(계정 완전 삭제)를 통해 개인정보 처리를 철회할 권리가 있습니다. 마이페이지 설정 및 개인정보보호 담당 메일을 통해 즉시 권리 행사가 가능합니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">7. 쿠키 및 세션</h2>
          <p>
            사용자 로그인 세션 유지 및 사이트 방문 분석 등을 위해 쿠키 기술을 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 수집을 전면 거부할 수 있으나, 이 경우 자동 로그인 등의 맞춤 서비스에 일부 제한이 발생할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-[18px] font-medium text-sb-primary mt-4 mb-2">8. 문의 안내</h2>
          <p>
            개인정보 관리, 권리 요청 및 약관 처리 과정에 대한 의견이나 불만 사항이 있을 경우 아래 전용 이메일로 연락하시면 3영업일 이내에 신속히 대응해 드리겠습니다.
          </p>
          <p className="mt-2 font-mono text-[12px] text-sb-accent">
            개인정보보호 전용 문의처: <a href="mailto:privacy@soundbridge.site" className="hover:underline">privacy@soundbridge.site</a>
          </p>
        </div>
      </div>
    </div>
  );
}
