import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, Sparkles, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface DefenseCelebrationModalProps {
  order: Order;
  onClose: () => void;
}

export const DefenseCelebrationModal: React.FC<DefenseCelebrationModalProps> = ({ order, onClose }) => {
  const { clearSimulationHistory, defenseStats } = useApp();

  // 효과음은 AppContext.completeDefense(utils/sound.ts)에서 1회만 재생한다.
  // 이 모달은 다시 보기로 재오픈될 수 있으므로 사운드를 직접 만들지 않는다.
  useEffect(() => {
    let interval: number | undefined;

    try {
      // Immediate center burst
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });

      // Side fireworks canon for 2.8 seconds
      const end = Date.now() + 2800;

      interval = window.setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          interval = undefined;
          return;
        }

        confetti({
          particleCount: 25,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      }, 250);
    } catch {
      // Ignore if canvas-confetti fails
    }

    return () => {
      if (interval !== undefined) clearInterval(interval);
      try {
        confetti.reset();
      } catch {
        // ignore
      }
    };
  }, []);

  const handleGoToMyPage = () => {
    onClose();
    clearSimulationHistory('mypage');
  };

  const handleGoHome = () => {
    onClose();
    clearSimulationHistory('home');
  };

  return (
    <div 
      id="defense-celebration-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div 
        className="w-full max-w-[370px] bg-white rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden animate-scaleUp border-2 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500" />
        
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/25 rounded-full blur-2xl pointer-events-none" />

        {/* Hero Trophy / Shield Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-600 flex items-center justify-center mb-3 shadow-md">
          <ShieldCheck className="w-11 h-11 stroke-[2.5]" />
        </div>

        {/* Category badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-black text-amber-800 mb-2 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>배달 시뮬레이션 완료</span>
        </div>

        {/* Main Title requested by user: '방어 성공!' */}
        <h2 id="defense-success-title" className="text-3xl font-black text-stone-900 tracking-tight">
          방어 성공! 🎉
        </h2>

        <p className="text-xs font-semibold text-stone-600 mt-1.5 leading-relaxed">
          충동적인 배달을 차단하고<br />
          <strong className="text-amber-700 font-bold">소중한 내 돈과 건강을 0원으로 지켜냈습니다.</strong>
        </p>

        {/* Highlight Card */}
        <div className="my-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5 text-left">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>방어한 매장</span>
            <span className="font-bold text-stone-800 truncate max-w-[170px]">{order.storeName}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>아낀 배달비 + 식비</span>
            <span className="font-black text-emerald-600 text-sm">
              +{order.savedAmount.toLocaleString()}원 절약
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>실제 결제 금액</span>
            <span className="font-black text-stone-900 bg-stone-200 px-2 py-0.5 rounded text-xs">
              0원 (가상 승인)
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700">총 누적 방어 실적</span>
            <span className="font-black text-amber-700">{defenseStats.totalDefendedCount}회 성공</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            id="defense-go-mypage-btn"
            onClick={handleGoToMyPage}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-450 active:scale-[0.99] text-stone-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>마이페이지에서 방어 실적 확인</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="defense-go-home-btn"
            onClick={handleGoHome}
            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>홈으로 가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
