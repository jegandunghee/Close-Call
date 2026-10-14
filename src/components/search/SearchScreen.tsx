import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search as SearchIcon, X, Star, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Store } from '../../types';

export const SearchScreen: React.FC = () => {
  const { 
    goBack, 
    searchKeyword, 
    setSearchKeyword, 
    recentSearches, 
    addRecentSearch, 
    removeRecentSearch, 
    clearRecentSearches,
    setSelectedStore,
    navigateTo,
    stores,
    menusByStore,
    catalogLoading
  } = useApp();

  const [inputVal, setInputVal] = useState(searchKeyword);

  const handleSearch = (kw: string) => {
    if (!kw.trim()) return;
    setInputVal(kw);
    setSearchKeyword(kw);
    addRecentSearch(kw);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputVal);
  };

  const filteredStores = useMemo(() => {
    const q = inputVal.trim().toLowerCase();
    if (!q) return [];
    return stores.filter(store => {
      const matchName = store.name.toLowerCase().includes(q);
      const matchTag = store.tags.some(t => t.toLowerCase().includes(q));
      // Check menu items
      const menus = menusByStore[store.id] || [];
      const matchMenu = menus.some(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
      return matchName || matchTag || matchMenu;
    });
  }, [inputVal, stores, menusByStore]);

  const handleSelectStore = (store: Store) => {
    addRecentSearch(inputVal);
    setSelectedStore(store);
    navigateTo('store');
  };

  const POPULAR_SEARCH_KEYWORDS = [
    '숯불치킨', '김치찜', '엽떡', '짜장면', '피자', '돈카츠', '족발', '치즈볼'
  ];

  return (
    <div id="search-screen" className="flex-1 flex flex-col bg-white">
      {/* Search Header matching Wireframe Screen 7 */}
      <div className="p-3 border-b border-stone-150 flex items-center gap-2 sticky top-0 bg-white z-20">
        <button 
          id="search-back-btn" 
          onClick={goBack} 
          className="p-1 -ml-1 text-stone-600 hover:text-stone-900 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="flex-1 relative">
          <input
            id="search-main-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="가게명 또는 메뉴를 검색하세요"
            className="w-full pl-9 pr-8 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            autoFocus
          />
          <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {inputVal && (
            <button
              type="button"
              onClick={() => { setInputVal(''); setSearchKeyword(''); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Wireframe Section: 최근 검색어 with chips & 전체 삭제 */}
        {recentSearches.length > 0 && !inputVal && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-stone-700">최근 검색어</h3>
              <button
                id="search-clear-recent-btn"
                onClick={clearRecentSearches}
                className="text-[11px] text-stone-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>전체 삭제</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 rounded-full text-xs text-stone-700 transition-colors"
                >
                  <span 
                    onClick={() => handleSearch(kw)}
                    className="cursor-pointer font-medium"
                  >
                    {kw}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(kw);
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Popular Keywords if no input */}
        {!inputVal && (
          <div>
            <h3 className="text-xs font-bold text-stone-700 mb-3">인기 급상승 야식 키워드</h3>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_SEARCH_KEYWORDS.map((kw, idx) => (
                <button
                  key={kw}
                  onClick={() => handleSearch(kw)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors border border-stone-100"
                >
                  <span className={`text-xs font-bold w-4 ${idx < 3 ? 'text-amber-500' : 'text-stone-400'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-stone-800">{kw}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {inputVal && (
          <div>
            <p className="text-xs text-stone-500 mb-3">
              '<span className="font-bold text-stone-900">{inputVal}</span>' 검색 결과 ({filteredStores.length}건)
            </p>

            {filteredStores.length > 0 ? (
              <div className="space-y-3">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    id={`search-result-store-${store.id}`}
                    onClick={() => handleSelectStore(store)}
                    className="bg-stone-50 hover:bg-stone-100/80 p-3 rounded-xl border border-stone-200/60 cursor-pointer flex gap-3 transition-colors"
                  >
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {store.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          {store.rating}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="flex items-center gap-0.5 text-stone-500">
                          <Clock className="w-3 h-3" />
                          {store.deliveryTimeMin}~{store.deliveryTimeMax}분
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-1">
                        {store.tags.join(' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-sm font-semibold text-stone-600">검색 결과가 없습니다</p>
                <p className="text-xs text-stone-400 mt-1">다른 검색어로 다시 시도해 보세요</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
