import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNav } from './components/layout/BottomNav';
import { SplashScreen } from './components/splash/SplashScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignupScreen } from './components/auth/SignupScreen';
import { AddressScreen } from './components/address/AddressScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { SearchScreen } from './components/search/SearchScreen';
import { CategoryScreen } from './components/category/CategoryScreen';
import { StoreScreen } from './components/store/StoreScreen';
import { CartScreen } from './components/cart/CartScreen';
import { DeliveryScreen } from './components/delivery/DeliveryScreen';
import { OrderHistoryScreen } from './components/orders/OrderHistoryScreen';
import { MyPageScreen } from './components/mypage/MyPageScreen';
import { CartConflictModal } from './components/cart/CartConflictModal';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <>
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'signup' && <SignupScreen />}
      {currentScreen === 'address_search' && <AddressScreen />}
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'search' && <SearchScreen />}
      {currentScreen === 'category' && <CategoryScreen />}
      {currentScreen === 'store' && <StoreScreen />}
      {currentScreen === 'cart' && <CartScreen />}
      {currentScreen === 'delivery' && <DeliveryScreen />}
      {currentScreen === 'orders' && <OrderHistoryScreen />}
      {currentScreen === 'mypage' && <MyPageScreen />}

      <CartConflictModal />
      <BottomNav />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MobileContainer>
        <ScreenRouter />
      </MobileContainer>
    </AppProvider>
  );
}
