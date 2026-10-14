import React from 'react';
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  Star, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Flame,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../constants/categories';
import { CategoryType, Store } from '../../types';

export const HomeScreen: React.FC = () => {
  const { 
    user, 
    navigateTo, 
    setSelectedCategoryId, 
    setSelectedStore,
    defenseStats,
    stores,
    catalogLoading,
    catalogError,
    reloadCatalog,
    deliveryAddress,
    openAddressSearch
  } = useApp();

  const handleCategoryClick = (catId: CategoryType) => {
    setSelectedCategoryId(catId);
    navigateTo('category');
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
    navigateTo('store');
  };

  // Featured stores
  const featuredStores = stores.slice(0, 5);

  return (
    <div id="home-screen" className="flex-1 flex flex-col bg-stone-50 pb-6">
      {/* Top Address Header matching Wireframe */}
      <div className="bg-white px-4 pt-2 pb-3 border-b border-stone-100 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <button
            id="home-address-btn"
            onClick={() => openAddressSearch('temporary')}
            className="flex items-center gap-1.5 text-stone-900 hover:text-amber-600 transition-colors group cursor-pointer max-w-[300px]"
          >
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-sm font-bold truncate">
              {(deliveryAddress || user.address).split(' ').slice(1, 4).join(' ') || '내 위치 설정'}
            </span>
            <span className="text-xs text-stone-400 font-normal">▼</span>
          </button>
        </div>

        {/* Search Bar Input Shortcut */}
        <div 
          id="home-search-trigger"
          onClick={() => navigateTo('search')}
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-150 rounded-xl text-stone-400 text-xs cursor-pointer border border-transparent hover:border-stone-300 transition-all"
        >
          <Search className="w-4 h-4 text-stone-400" />
          <span className="truncate">야식 생각날 땐? 숯불치킨, 엽떡, 김치찜...</span>
        </div>
      </div>

      {/* Hero Banner: Defense Motivation */}
      <div className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-stone-900 to-stone-850 text-white rounded-2xl shadow-md relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>0원 가상 결제 시스템</span>
          </div>
          <p className="text-sm font-bold text-stone-100 leading-snug">
            배달 충동 올 땐 마음껏 고르고,<br />
            <span className="text-amber-400">결제는 0원으로 완벽 방어!</span>
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            이번 달 총 <strong className="text-white font-bold">{defenseStats.thisMonthSavedAmount.toLocaleString()}원</strong> 지켜냈어요
          </p>
        </div>
        <div className="text-4xl select-none mr-1">🛵</div>
      </div>

      {/* Categories Grid matching Wireframe */}
      <div className="bg-white mx-4 mt-3 p-4 rounded-2xl border border-stone-150 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            음식 카테고리
          </h2>
          <button 
            onClick={() => handleCategoryClick('all')} 
            className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center"
          >
            <span>전체보기</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center p-1.5 rounded-xl hover:bg-stone-50 active:scale-95 transition-all group"
            >
              <div className="w-11 h-11 rounded-2xl bg-stone-100 group-hover:bg-amber-100/70 border border-stone-200/60 flex items-center justify-center text-xl mb-1.5 transition-colors shadow-2xs">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-stone-700 group-hover:text-amber-900 tracking-tight">
                {cat.name.split('·')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Wireframe Recommended Stores section: "인기 주문 & 야식 추천" */}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h2 className="text-sm font-bold text-stone-900">
              가장 방어 욕구 높은 인기 매장
            </h2>
          </div>
          <span className="text-[11px] text-stone-400">실시간 랭킹</span>
        </div>

        {catalogLoading ? (
          <div className="py-8 text-center text-xs text-stone-400">
            매장 정보를 불러오는 중입니다...
          </div>
        ) : catalogError ? (
          <div className="py-6 px-4 bg-rose-50 rounded-xl text-center">
            <p className="text-xs text-rose-600 mb-2">{catalogError}</p>
            <button
              onClick={() => reloadCatalog()}
              className="text-xs font-bold text-rose-700 underline cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        ) : featuredStores.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            등록된 매장이 없습니다. (DB 시드를 확인해주세요)
          </div>
        ) : (
          <div className="space-y-3">
            {featuredStores.map((store) => (
              <div
                key={store.id}
                id={`store-card-${store.id}`}
              onClick={() => handleStoreClick(store)}
              className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex gap-3 group active:scale-[0.99]"
            >
              <img
                src={store.image}
                alt={store.name}
                className="w-22 h-22 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-amber-600 transition-colors">
                      {store.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-600">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                      <span>{store.rating}</span>
                    </div>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500">리뷰 {store.reviewCount.toLocaleString()}</span>
                  </div>

                  <p className="text-[11px] text-stone-400 truncate mt-1">
                    {store.notice}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{store.deliveryTimeMin}~{store.deliveryTimeMax}분</span>
                  </div>
                  <div className="font-semibold text-stone-800">
                    배달팁 <span className="text-emerald-600">0원 (가상)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};
