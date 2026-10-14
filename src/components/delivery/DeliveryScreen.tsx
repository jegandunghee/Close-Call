import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FastForward,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Order } from '../../types';
import { DefenseCelebrationModal } from './DefenseCelebrationModal';

export const DeliveryScreen: React.FC = () => {
  const { 
    currentOrder, 
    orders, 
    activeSimulationOrderId, 
    updateOrderStatus, 
    completeDefense,
    goBack,
    navigateTo,
    clearSimulationHistory
  } = useApp();

  // Find the target order
  const order: Order | undefined = currentOrder || orders.find(o => o.id === activeSimulationOrderId) || orders[0];

  const [showCelebration, setShowCelebration] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Stepper stages according to PRD FR-05 Acceptance Criteria:
  // 주문 접수 → 조리 중 → 배달 시작 → 배달 중 → 배달 완료
  const stages: { key: OrderStatus; label: string; desc: string; progress: number }[] = [
    { 
      key: 'order_received', 
      label: '주문 확인', 
      desc: '가게에서 가상 주문을 접수하였습니다.',
      progress: 10 
    },
    { 
      key: 'cooking', 
      label: '메뉴 준비중', 
      desc: '맛있고 푸짐하게 조리하고 있습니다.',
      progress: 35 
    },
    { 
      key: 'delivery_started', 
      label: '배달 시작', 
      desc: '라이더님이 매장에서 음식을 픽업했습니다.',
      progress: 60 
    },
    { 
      key: 'delivering', 
      label: '배달중', 
      desc: '라이더님이 안전하게 고객님께 이동 중입니다.',
      progress: 85 
    },
    { 
      key: 'delivered', 
      label: '배달 완료', 
      desc: '배달 완료! 실제 소비 0원으로 방어 성공!',
      progress: 100 
    },
  ];

  const currentStatus: OrderStatus = order?.status ?? 'order_received';
  const currentStageIndex = stages.findIndex(s => s.key === currentStatus);
  const activeStage = stages[currentStageIndex >= 0 ? currentStageIndex : 0];

  // Rider position on map: 0 (at store) to 100 (at home)
  const riderMapProgress = activeStage.progress;

  const advanceTo = (next: OrderStatus) => {
    if (!order) return;

    if (next === 'delivered') {
      // 방어 완료는 반드시 completeDefense 단일 진입점을 통과 (중복 호출은 내부 가드가 무시)
      if (completeDefense(order.id)) {
        setShowCelebration(true);
      }
    } else {
      updateOrderStatus(order.id, next);
    }
  };

  // Auto progression timer: 30 seconds total (7.5s per transition at 1x)
  useEffect(() => {
    if (!order || currentStatus === 'delivered') return;

    const nextOf: Partial<Record<OrderStatus, OrderStatus>> = {
      order_received: 'cooking',
      cooking: 'delivery_started',
      delivery_started: 'delivering',
      delivering: 'delivered',
    };
    const next = nextOf[currentStatus];
    if (!next) return;

    // 7500ms per stage = 30 seconds total across 4 steps
    const baseDelay = 7500 / speedMultiplier;
    const timer = setTimeout(() => advanceTo(next), baseDelay);

    return () => clearTimeout(timer);
  }, [currentStatus, speedMultiplier, order?.id]);

  const handleFastForward = () => {
    advanceTo('delivered');
  };

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-stone-500">진행 중인 배달 주문이 없습니다.</p>
        <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold">
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <div id="delivery-simulation-screen" className="flex-1 flex flex-col bg-stone-50">
      {/* Top Header matching Wireframe Screen 12 */}
      <div className="bg-white px-4 py-3 border-b border-stone-100 flex items-center justify-between sticky top-0 z-20">
        <button onClick={goBack} className="p-1 -ml-2 text-stone-600 hover:text-stone-900 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-900">배달 현황</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSpeedMultiplier(prev => prev === 1 ? 3 : prev === 3 ? 6 : 1)}
            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-[10px] font-bold text-stone-700 flex items-center gap-0.5"
            title="시뮬레이션 속도 조절"
          >
            <FastForward className="w-3 h-3 text-amber-600" />
            <span>{speedMultiplier}x</span>
          </button>
        </div>
      </div>

      {/* Wireframe Screen 12: Interactive Simulated 3D / Isometric Map */}
      <div className="relative h-64 bg-slate-100 border-b border-stone-200 overflow-hidden shrink-0 select-none">
        {/* Map Grid and Roadway Canvas */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="city-blocks" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#F8FAFC" />
              <rect x="5" y="5" width="50" height="50" rx="4" fill="#E2E8F0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#city-blocks)" />
          
          {/* S-curve delivery route path */}
          <path
            d="M 50 50 Q 180 80 160 140 T 320 200"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 50 50 Q 180 80 160 140 T 320 200"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="6"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Store Pin (Origin: top left) */}
        <div className="absolute top-6 left-6 z-10 flex flex-col items-center">
          <div className="px-2.5 py-1 bg-stone-900 text-white text-[10px] font-bold rounded-full shadow-md max-w-[130px] truncate mb-1">
            {order.storeName}
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-900 border-2 border-white shadow-lg flex items-center justify-center text-sm">
            🏪
          </div>
        </div>

        {/* Animated Rider Moving along the route */}
        <div 
          className="absolute z-20 flex flex-col items-center transition-all duration-700 ease-out"
          style={{
            top: `${25 + (riderMapProgress / 100) * 55}%`,
            left: `${15 + (riderMapProgress / 100) * 65}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-lg animate-pulse">
            🛵
          </div>
          <span className="px-2 py-0.5 bg-stone-800 text-white text-[9px] font-bold rounded-full shadow-sm mt-1 whitespace-nowrap">
            라이더 이동중
          </span>
        </div>

        {/* Destination Home Pin (Bottom right) */}
        <div className="absolute bottom-5 right-6 z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-sm">
            🏠
          </div>
          <div className="px-2.5 py-1 bg-stone-900 text-white text-[10px] font-bold rounded-full shadow-md mt-1">
            우리집
          </div>
        </div>

        {/* Speed / Fast forward button */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
          {currentStatus !== 'delivered' && (
            <button
              id="delivery-instant-finish-btn"
              onClick={handleFastForward}
              className="px-2.5 py-1.5 bg-stone-900/80 hover:bg-stone-900 text-white text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-xs flex items-center gap-1"
            >
              <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>즉시 배달 완료</span>
            </button>
          )}
        </div>
      </div>

      {/* ETA and Store Information matching Wireframe 12 */}
      <div className="bg-white p-4 border-b border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              {order.storeName}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              주문 번호 #{order.id.slice(-6)}
            </p>
          </div>

          <div className="text-right">
            {currentStatus === 'delivered' ? (
              <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                배달 완료 (방어 성공)
              </span>
            ) : (
              <div>
                <span className="text-lg font-black text-amber-600">
                  {currentStatus === 'delivering' ? '5분' : currentStatus === 'delivery_started' ? '12분' : '19분'}
                </span>
                <span className="text-xs text-stone-500 ml-1">후 도착 예정</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Stage Vertical Timeline matching Wireframe 12 */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h4 className="text-xs font-bold text-stone-700 mb-3">배달 진행 단계</h4>

        <div className="space-y-4 relative pl-6">
          {/* Vertical Track Line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-stone-200" />

          {stages.map((stage, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div key={stage.key} className="relative flex items-start gap-3">
                {/* Stage dot / icon */}
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center -ml-6 z-10 transition-colors ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrent 
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100' 
                        : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className={`text-xs font-bold ${
                      isCurrent ? 'text-amber-700' : isCompleted ? 'text-stone-900' : 'text-stone-400'
                    }`}>
                      {stage.label}
                    </h5>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 animate-pulse">
                        진행 중
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
        {currentStatus === 'delivered' ? (
          <div className="flex gap-2">
            <button
              id="delivery-open-celebration-btn"
              onClick={() => setShowCelebration(true)}
              className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-450 active:scale-[0.99] text-stone-950 font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>🎉 방어 성공! 화면 다시 보기</span>
            </button>
            <button
              id="delivery-go-home-btn"
              onClick={() => clearSimulationHistory('home')}
              className="px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
            >
              홈으로
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              id="delivery-fast-complete-btn"
              onClick={handleFastForward}
              className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              <span>배달 완료로 건너뛰고 방어 성공 보기</span>
            </button>
          </div>
        )}
      </div>

      {/* Defense Celebration Modal */}
      {showCelebration && (
        <DefenseCelebrationModal
          order={order}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};
