import React from 'react';
import { ChevronLeft, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginRequiredGuardProps {
  /** 헤더 제목 (예: '마이페이지') */
  title: string;
  /** 안내 설명 문구 (줄바꿈은 \n) */
  description: string;
  /** DOM id 접두사 (예: 'mypage' → mypage-login-guard, mypage-guard-login-btn …) */
  idPrefix: string;
}

/**
 * 비로그인 사용자에게 마이페이지/주문내역/장바구니 대신 보여주는 공통 로그인 안내 화면.
 */
export const LoginRequiredGuard: React.FC<LoginRequiredGuardProps> = ({ title, description, idPrefix }) => {
  const { navigateTo, goBack } = useApp();

  return (
    <div id={`${idPrefix}-login-guard`} className="flex-1 flex flex-col bg-stone-100 pb-20">
      <div className="bg-white px-4 py-3 border-b border-stone-150 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          id={`${idPrefix}-guard-back-btn`}
          onClick={goBack}
          className="p-1 -ml-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-900">{title}</h2>
        <div className="w-6" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-stone-900">로그인이 필요한 서비스입니다</h3>
        <p className="text-xs text-stone-500 mt-2 leading-relaxed whitespace-pre-line">{description}</p>
        <div className="w-full max-w-[260px] mt-6 space-y-2">
          <button
            id={`${idPrefix}-guard-login-btn`}
            onClick={() => navigateTo('login')}
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl text-sm shadow-md transition-colors"
          >
            로그인하러 가기
          </button>
          <button
            id={`${idPrefix}-guard-signup-btn`}
            onClick={() => navigateTo('signup')}
            className="w-full py-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold rounded-2xl text-sm transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};
