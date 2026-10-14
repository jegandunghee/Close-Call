import React, { useState } from 'react';
import { ChevronLeft, Star, Clock, ShoppingBag, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { MenuModal } from './MenuModal';

export const StoreScreen: React.FC = () => {
  const { 
    selectedStore, 
    goBack, 
    cart, 
    cartTotalAmount, 
    navigateTo,
    selectedMenuItem,
    setSelectedMenuItem,
    menusByStore,
    catalogLoading
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('전체');

  if (!selectedStore) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-stone-500">가게 정보를 찾을 수 없습니다.</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer">
          돌아가기
        </button>
      </div>
    );
  }

  const storeMenus = menusByStore[selectedStore.id] || [];
  
  // Menu category tabs
  const categories = ['전체', ...Array.from(new Set(storeMenus.map(m => m.category)))];

  const filteredMenus = activeTab === '전체' 
    ? storeMenus 
    : storeMenus.filter(m => m.category === activeTab);

  const cartItemsFromThisStore = cart.filter(item => item.storeId === selectedStore.id);
  const totalItemsCount = cartItemsFromThisStore.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="store-screen" className={`flex-1 flex flex-col bg-stone-50 relative ${cart.length > 0 ? 'pb-24' : 'pb-6'}`}>
      {/* Top Visual Banner matching Wireframe Screen 9 - expanded height to cover halfway down store info card */}
      <div className="relative h-60 shrink-0 bg-stone-200">
        <img
          src={selectedStore.image}
          alt={selectedStore.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/20" />

        {/* Top Floating Back Control */}
        <div className="absolute top-3 left-3 z-10">
          <button
            id="store-back-btn"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/60 transition-colors cursor-pointer"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Store Info Card overlapping banner halfway down (height of card ~160px, -mt-20 overlaps ~halfway) */}
      <div className="bg-white/95 backdrop-blur-sm mx-4 -mt-20 p-4 rounded-2xl border border-stone-200/90 shadow-md relative z-10 space-y-3.5">
        {/* Store Title & Review Stats */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-snug">
            {selectedStore.name}
          </h1>
          <div className="flex items-center gap-2 text-xs mt-1.5 text-stone-600">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              {selectedStore.rating}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500 font-medium">최근 리뷰 {selectedStore.reviewCount.toLocaleString()}개</span>
          </div>
        </div>

        {/* Delivery Info Grid: Separated clearly with a divider and comfortable spacing */}
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-stone-150 pt-3 border-t border-stone-100">
          <div>
            <p className="text-[11px] text-stone-400">배달시간</p>
            <p className="text-xs font-bold text-stone-800 mt-1">
              {selectedStore.deliveryTimeMin}~{selectedStore.deliveryTimeMax}분
            </p>
          </div>
          <div>
            <p className="text-[11px] text-stone-400">배달팁</p>
            <p className="text-xs font-bold text-emerald-600 mt-1">
              0원 (가상)
            </p>
          </div>
          <div>
            <p className="text-[11px] text-stone-400">최소주문</p>
            <p className="text-xs font-bold text-stone-800 mt-1">
              {selectedStore.minOrderAmount.toLocaleString()}원
            </p>
          </div>
        </div>

        {selectedStore.notice && (
          <div className="mt-2.5 flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl text-xs text-stone-600">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">{selectedStore.notice}</p>
          </div>
        )}
      </div>

      {/* Category Tabs matching Wireframe */}
      <div className="bg-white mt-3 px-3 py-2 border-y border-stone-150 sticky top-0 z-20 flex gap-2 overflow-x-auto scrollbar-none shadow-2xs">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`store-tab-${cat}`}
            onClick={() => setActiveTab(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === cat
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Item Cards matching Wireframe Screen 9 */}
      <div className="p-3 space-y-2.5">
        {catalogLoading ? (
          <div className="py-12 text-center text-xs text-stone-400">
            메뉴 목록을 불러오는 중입니다...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
            등록된 메뉴가 없습니다.
          </div>
        ) : (
          filteredMenus.map((menu) => (
            <div
              key={menu.id}
              id={`menu-card-${menu.id}`}
            onClick={() => setSelectedMenuItem(menu)}
            className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs hover:shadow-sm cursor-pointer transition-all flex justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center gap-1.5">
                  {menu.isPopular && (
                    <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded border border-rose-200/60">
                      인기
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors truncate">
                    {menu.name}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {menu.description}
                </p>
              </div>

              <div className="text-sm font-bold text-stone-900 mt-2">
                {menu.price.toLocaleString()}원
              </div>
            </div>

            <div className="relative w-22 h-22 rounded-xl overflow-hidden shrink-0 bg-stone-100">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>

      {/* Floating Cart Bar - Refined Glassmorphism Style with translucent frosted glass and generous margins */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-6 z-40 pointer-events-auto">
          <button
            id="store-floating-cart-btn"
            onClick={() => navigateTo('cart')}
            className="w-full py-3.5 px-5 bg-stone-900/40 hover:bg-stone-900/50 active:scale-[0.98] backdrop-blur-xl border border-white/30 text-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex items-center justify-between transition-all cursor-pointer ring-1 ring-white/10"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500/95 text-stone-950 text-xs font-black flex items-center justify-center shadow-sm">
                {totalItemsCount || cart.length}
              </span>
              <span className="text-sm font-bold tracking-tight text-white drop-shadow-xs">장바구니 보기</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-amber-300 drop-shadow-xs">
                {cartTotalAmount.toLocaleString()}원
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Menu Detail Modal */}
      {selectedMenuItem && (
        <MenuModal
          menu={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
        />
      )}
    </div>
  );
};
