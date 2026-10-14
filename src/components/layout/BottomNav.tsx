import React from 'react';
import { Home, Search, ShoppingBag, Receipt, User } from 'lucide-react';
import { useApp, ScreenType } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, cart } = useApp();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { screen: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { screen: 'home', label: '홈', icon: Home },
    { screen: 'search', label: '검색', icon: Search },
    { screen: 'cart', label: '장바구니', icon: ShoppingBag },
    { screen: 'orders', label: '주문내역', icon: Receipt },
    { screen: 'mypage', label: '마이페이지', icon: User },
  ];

  // Don't render on full-screen flows like splash, auth, cart, delivery simulation, or store screen
  if (
    currentScreen === 'splash' || 
    currentScreen === 'login' || 
    currentScreen === 'signup' || 
    currentScreen === 'address_search' ||
    currentScreen === 'cart' ||
    currentScreen === 'delivery' ||
    currentScreen === 'store'
  ) {
    return null;
  }

  return (
    <nav 
      id="bottom-navigation-bar" 
      className="sticky bottom-0 left-0 right-0 bg-white border-t border-stone-200/80 px-2 py-1.5 flex justify-around items-center z-40 shrink-0 shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.screen;
        const isCart = item.screen === 'cart';

        return (
          <button
            key={item.screen}
            id={`nav-btn-${item.screen}`}
            onClick={() => navigateTo(item.screen)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-amber-600 font-semibold scale-105' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              
              {/* Cart badge */}
              {isCart && totalItems > 0 && (
                <span 
                  id="cart-badge-count"
                  className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
