import React from 'react';
import { 
  ChevronLeft, 
  Receipt, 
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoginRequiredGuard } from '../auth/LoginRequiredGuard';

export const OrderHistoryScreen: React.FC = () => {
  const { orders, navigateTo, goBack, user } = useApp();

  // Wireframe: Only show defense-succeeded (completed) orders, no progress tab
  const defendedOrders = orders.filter(order => order.isDefenseSuccess);

  // 비로그인 인증 가드
  if (!user.isLoggedIn) {
    return (
      <LoginRequiredGuard
        idPrefix="orders"
        title="주문내역"
        description={'로그인하면 나의 방어 성공\n주문내역을 확인할 수 있어요.'}
      />
    );
  }

  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return '';
    try {
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
    } catch {}
    return dStr;
  };

  return (
    <div id="order-history-screen" className="flex-1 flex flex-col bg-stone-100 pb-20">
      {/* Top Header matching Wireframe: Back arrow + Center Title */}
      <div className="bg-white px-4 py-3 border-b border-stone-150 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button 
          id="orders-back-btn" 
          onClick={goBack} 
          className="p-1 -ml-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-900">주문내역</h2>
        <div className="w-6" />
      </div>

      {/* Orders List matching Wireframe Card Layout exactly */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        {defendedOrders.length > 0 ? (
          defendedOrders.map((order) => (
            <div
              key={order.id}
              id={`order-history-card-${order.id}`}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3"
            >
              {/* Card Top: Left Store Image + Right Store Name */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-100">
                  <img
                    src={order.storeImage}
                    alt={order.storeName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {order.storeName}
                    </h3>
                    <span className="text-[10px] text-stone-400 font-medium shrink-0">
                      {formatDisplayDate(order.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    방어 성공 • 0원 결제
                  </p>
                </div>
              </div>

              {/* Card Middle: Single Receipt Format (food_name & option_text) */}
              <div className="py-2.5 border-t border-b border-stone-100 text-xs space-y-1">
                <div className="flex justify-between items-center text-stone-800">
                  <span className="font-bold text-xs text-stone-900 truncate">
                    {order.food_name || (order.items && order.items.length > 0 ? (order.items.length > 1 ? `${order.items[0].menuItem.name} 외 ${order.items.length - 1}건` : order.items[0].menuItem.name) : '주문 메뉴')}
                  </span>
                </div>
                {order.option_text && order.option_text !== '기본' && (
                  <p className="text-[11px] text-stone-500 font-medium truncate">
                    옵션: {order.option_text}
                  </p>
                )}
              </div>

              {/* Card Bottom: '가격' label left, amount right matching Wireframe */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-stone-500 font-medium">가격</span>
                <span className="text-sm font-bold text-stone-900">
                  {order.totalOrderAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-6 my-4">
            <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-stone-700">방어 성공한 주문 내역이 없습니다.</p>
            <p className="text-xs text-stone-400 mt-1 mb-5">야식이나 배달이 당길 때 가상 주문으로 지갑을 지켜보세요!</p>
            <button
              id="empty-orders-browse-btn"
              onClick={() => navigateTo('home')}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>음식 둘러보러 가기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
