import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div 
      id="splash-screen"
      className="flex-1 flex flex-col justify-between items-center bg-stone-900 text-stone-100 p-8 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top micro brand - 텍스트 및 아이콘 크기 +2px 확대 */}
      <div className="pt-6 flex items-center gap-2 text-stone-300 tracking-wider">
        <ShieldCheck className="w-[18px] h-[18px] text-amber-400 shrink-0" />
        <span className="text-[14px] font-semibold">CLOSE CALL · 배달 충동 방어 솔루션</span>
      </div>

      {/* Main Logo & Visual Icon matching Wireframe Screen 1 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center my-auto"
      >
        {/* 상단 텍스트 "시킬뻔 ;" 및 아래 /logo.png 이미지 */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-3xl font-extrabold text-white tracking-tight mb-3.5 drop-shadow-sm">
            시킬뻔<span className="text-amber-400 ml-0.5">;</span>
          </span>
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-stone-800/90 border border-stone-700 shadow-2xl flex items-center justify-center p-3.5 relative group overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-amber-400/10 animate-ping opacity-20 pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="시킬뻔 로고" 
              className="w-full h-full object-contain relative z-10"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-stone-100 mb-3 tracking-tight leading-snug">
          배달앱 켜기 전에,<br />
          <span className="text-amber-400">마음껏 담고 0원에 방어하세요</span>
        </h1>
        <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
          메뉴 탐색과 결제, 배달의 설렘은 그대로.<br />
          실제 결제만 0원으로 쏙 빼서 통장을 지켜드립니다.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="w-full pb-6 space-y-3 z-10">
        <button
          id="splash-start-btn"
          onClick={() => navigateTo('home')}
          className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-450 active:scale-[0.98] text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all text-base"
        >
          <span>시작하기</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex justify-center items-center gap-4 text-xs text-stone-400 pt-1">
          <button 
            id="splash-login-btn"
            onClick={() => navigateTo('login')}
            className="hover:text-stone-200 transition-colors underline underline-offset-4"
          >
            로그인하기
          </button>
          <span>·</span>
          <button 
            id="splash-signup-btn"
            onClick={() => navigateTo('signup')}
            className="hover:text-stone-200 transition-colors underline underline-offset-4"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};
