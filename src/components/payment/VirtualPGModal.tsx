import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VirtualPGModalProps {
  paymentMethod: string;
  riderRequest?: string;
  orderAmount: number;
  onSuccess: (orderId: string) => void;
  onClose: () => void;
}

export const VirtualPGModal: React.FC<VirtualPGModalProps> = ({
  paymentMethod,
  riderRequest,
  orderAmount,
  onSuccess,
  onClose,
}) => {
  const { createVirtualOrder } = useApp();
  const [status, setStatus] = useState<'authenticating' | 'success' | 'failed'>('authenticating');
  const [errorMessage, setErrorMessage] = useState('');

  // 모든 setTimeout id를 추적해 언마운트 시 일괄 해제
  const timersRef = useRef<number[]>([]);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter(t => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
  };

  const attemptPayment = () => {
    const res = createVirtualOrder(paymentMethod, false, riderRequest);
    if (res.success && res.orderId) {
      const orderId = res.orderId;
      setStatus('success');
      schedule(() => onSuccess(orderId), 700);
    } else {
      setStatus('failed');
      setErrorMessage(res.error || '가상 결제 처리 중 일시적인 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    // Simulate swift PG payment authentication latency (1 second)
    schedule(attemptPayment, 1000);

    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const handleRetry = () => {
    setStatus('authenticating');
    schedule(attemptPayment, 1000);
  };

  return (
    <div 
      id="virtual-pg-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div 
        className="w-full max-w-[360px] bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-150">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-[10px]">
              시
            </div>
            <span className="text-xs font-bold text-stone-800">0원 가상 결제 게이트웨이</span>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'success'}
            className="text-stone-400 hover:text-stone-700 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Authenticating State */}
        {status === 'authenticating' && (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin mb-4" />
            <h3 className="text-base font-bold text-stone-900">
              {paymentMethod} 0원 가상 승인 중...
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-[240px]">
              실제 결제는 발생하지 않으며, 안심하고 배달 시뮬레이션으로 진입합니다.
            </p>
            <div className="mt-4 px-3 py-1.5 bg-stone-100 rounded-lg text-[11px] font-semibold text-stone-600">
              가상 주문액: {orderAmount.toLocaleString()}원 → 결제액: 0원
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-900">가상 결제 승인 완료!</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              실제 지출 0원 · 배달 시뮬레이션 시작
            </p>
          </div>
        )}

        {/* Failed State (Requirement P1 & NFR-03: 결제 실패 및 재시도) */}
        {status === 'failed' && (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">가상 결제 실패</h3>
            <p className="text-xs text-rose-500 font-medium mt-1 leading-relaxed px-2">
              {errorMessage}
            </p>

            <div className="w-full mt-6 space-y-2">
              <button
                id="pg-retry-btn"
                onClick={handleRetry}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>결제 다시 시도하기</span>
              </button>
              <button
                id="pg-cancel-btn"
                onClick={onClose}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold rounded-xl text-xs"
              >
                장바구니로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
