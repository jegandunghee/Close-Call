import React from 'react';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartConflictModal: React.FC = () => {
  const { 
    cartConflict, 
    resolveCartConflictReplace, 
    resolveCartConflictKeep 
  } = useApp();

  if (!cartConflict) return null;

  const currentStoreName = cartConflict.currentStoreName;
  const newStoreName = cartConflict.store.name;

  return (
    <div 
      id="cart-conflict-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={resolveCartConflictKeep}
    >
      <div 
        id="cart-conflict-modal-card"
        className="w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Icon */}
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-6 h-6" />
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h3 className="text-base font-extrabold text-stone-900 leading-snug">
            장바구니에는 같은 가게의<br />메뉴만 담을 수 있어요
          </h3>
          
          <div className="bg-stone-50 rounded-2xl p-3 text-xs text-stone-600 space-y-1.5 border border-stone-150">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">기존 담긴 가게</span>
              <span className="font-bold text-stone-700 truncate max-w-[150px]">{currentStoreName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-600 font-semibold">새로 담을 가게</span>
              <span className="font-bold text-amber-600 truncate max-w-[150px]">{newStoreName}</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed pt-1">
            새로운 가게의 메뉴를 담으려면 기존 장바구니에 있던 메뉴를 모두 삭제해야 합니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            id="cart-conflict-replace-btn"
            type="button"
            onClick={resolveCartConflictReplace}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-450 active:scale-[0.99] text-stone-950 font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center cursor-pointer"
          >
            새로 담기
          </button>
          <button
            id="cart-conflict-keep-btn"
            type="button"
            onClick={resolveCartConflictKeep}
            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            장바구니 유지하기
          </button>
        </div>
      </div>
    </div>
  );
};
