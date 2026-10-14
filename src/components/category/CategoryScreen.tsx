import React, { useState } from 'react';
import { ChevronLeft, Search, Star, Clock, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../constants/categories';
import { CategoryType, Store } from '../../types';

export const CategoryScreen: React.FC = () => {
  const { 
    goBack, 
    selectedCategoryId, 
    setSelectedCategoryId, 
    setSelectedStore, 
    navigateTo,
    stores: allStores,
    catalogLoading,
    catalogError,
    reloadCatalog
  } = useApp();

  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'minOrder'>('rating');

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategoryId) || CATEGORIES[0];

  const stores = allStores.filter(store => {
    if (selectedCategoryId === 'all') return true;
    return store.category === selectedCategoryId;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'time') return a.deliveryTimeMin - b.deliveryTimeMin;
    if (sortBy === 'minOrder') return a.minOrderAmount - b.minOrderAmount;
    return 0;
  });

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    navigateTo('store');
  };

  return (
    <div id="category-screen" className="flex-1 flex flex-col bg-stone-50">
      {/* Top Header matching Wireframe Screen 8 */}
      <div className="bg-white px-4 py-3 border-b border-stone-100 flex items-center justify-between sticky top-0 z-20">
        <button 
          id="category-back-btn" 
          onClick={goBack} 
          className="p-1 -ml-2 text-stone-600 hover:text-stone-900 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-900">
          {currentCategory.name}
        </h2>
        <button 
          id="category-search-btn" 
          onClick={() => navigateTo('search')}
          className="p-1 -mr-1 text-stone-600 hover:text-stone-900"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Category Tab Pills matching Wireframe */}
      <div className="bg-white px-3 py-2 border-b border-stone-150 overflow-x-auto flex gap-1.5 scrollbar-none sticky top-12 z-10">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name.split('·')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Filter Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-stone-500">
        <span>총 <strong>{stores.length}</strong>개 가게</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('rating')}
            className={`font-medium ${sortBy === 'rating' ? 'text-amber-600 font-bold' : 'hover:text-stone-800'}`}
          >
            별점순
          </button>
          <span>·</span>
          <button
            onClick={() => setSortBy('time')}
            className={`font-medium ${sortBy === 'time' ? 'text-amber-600 font-bold' : 'hover:text-stone-800'}`}
          >
            빠른배달순
          </button>
          <span>·</span>
          <button
            onClick={() => setSortBy('minOrder')}
            className={`font-medium ${sortBy === 'minOrder' ? 'text-amber-600 font-bold' : 'hover:text-stone-800'}`}
          >
            최소주문금액순
          </button>
        </div>
      </div>

      {/* Store List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {catalogLoading ? (
          <div className="py-16 text-center text-xs text-stone-400">
            가게 목록을 불러오는 중입니다...
          </div>
        ) : catalogError ? (
          <div className="py-8 px-4 bg-rose-50 rounded-2xl text-center border border-rose-200">
            <p className="text-xs text-rose-600 mb-2">{catalogError}</p>
            <button
              onClick={() => reloadCatalog()}
              className="text-xs font-bold text-rose-700 underline cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        ) : stores.length > 0 ? (
          stores.map((store) => (
            <div
              key={store.id}
              id={`store-item-${store.id}`}
              onClick={() => handleSelectStore(store)}
              className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs hover:shadow-md cursor-pointer transition-all flex gap-3.5 group active:scale-[0.99]"
            >
              <img
                src={store.image}
                alt={store.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-amber-600 transition-colors">
                    {store.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                      {store.rating}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500">리뷰 {store.reviewCount.toLocaleString()}</span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                    {store.notice}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{store.deliveryTimeMin}~{store.deliveryTimeMax}분</span>
                  </div>
                  <div className="text-stone-600">
                    최소주문 {store.minOrderAmount.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-sm font-medium text-stone-600">등록된 가게가 없습니다.</p>
            <p className="text-xs text-stone-400 mt-1">다른 카테고리를 선택해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};
