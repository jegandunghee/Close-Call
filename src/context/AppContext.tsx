import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  CartItem, 
  MenuItem, 
  Order, 
  OrderStatus, 
  SelectedOption, 
  Store, 
  UserProfile, 
  CategoryType,
  DefenseStats,
  PendingCartConflict
} from '../types';
import { fetchStores, fetchMenus } from '../services/storeService';
import { 
  signUp as authSignUp, 
  signIn as authSignIn, 
  signOut as authSignOut, 
  getInitialSession, 
  subscribeToAuthChanges, 
  updateUserProfile 
} from '../services/authService';
import { createCloseCallOrder, fetchCloseCallOrders } from '../services/orderService';
import { sound } from '../utils/sound';

export type ScreenType = 
  | 'splash'
  | 'login'
  | 'signup'
  | 'address_search'
  | 'home'
  | 'search'
  | 'category'
  | 'store'
  | 'cart'
  | 'delivery'
  | 'orders'
  | 'mypage';

interface AppContextType {
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;
  goBack: () => void;
  screenHistory: ScreenType[];

  // User
  user: UserProfile;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, nickname: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  /** 비로그인 사용자를 안내 문구와 함께 로그인 화면으로 보내고, 로그인 후 returnTo 화면으로 복귀시킨다 */
  requireLogin: (message: string, returnTo?: ScreenType) => void;
  authNotice: string | null;
  updateAddress: (address: string, detailAddress: string) => Promise<void>;
  
  // Address
  deliveryAddress: string;
  deliveryDetailAddress: string;
  addressSource: 'mypage' | 'temporary';
  openAddressSearch: (source: 'mypage' | 'temporary') => void;

  // Navigation
  clearSimulationHistory: (destination: ScreenType) => void;

  // Navigation Context
  selectedCategoryId: CategoryType;
  setSelectedCategoryId: (cat: CategoryType) => void;
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (menu: MenuItem | null) => void;
  searchKeyword: string;
  setSearchKeyword: (kw: string) => void;
  recentSearches: string[];
  addRecentSearch: (kw: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (kw: string) => void;

  // Catalog (Stores & Menus)
  stores: Store[];
  menusByStore: Record<string, MenuItem[]>;
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (menu: MenuItem, store: Store, quantity: number, options: SelectedOption[]) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalAmount: number;
  cartDeliveryFee: number;
  cartFinalAmount: number;
  cartStore: Store | null;
  cartConflict: PendingCartConflict | null;
  resolveCartConflictReplace: () => void;
  resolveCartConflictKeep: () => void;

  // Order & Simulation
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  orders: Order[];
  createVirtualOrder: (paymentMethod: string, shouldFail?: boolean, riderRequest?: string) => { success: boolean; orderId?: string; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  /** 배달 완료(방어 성공) 단일 진입점. 이미 완료된 주문이면 아무 것도 하지 않고 false 반환 */
  completeDefense: (orderId: string) => boolean;
  activeSimulationOrderId: string | null;
  setActiveSimulationOrderId: (id: string | null) => void;
  defenseSuccessModalOrder: Order | null;
  setDefenseSuccessModalOrder: (order: Order | null) => void;
  
  // Stats
  defenseStats: DefenseStats;
  resetAllData: () => void;

  // Sound toggle
  soundEnabled: boolean;
  toggleSound: () => void;
}

// 개인정보/주소 등은 비어 있는 상태로 시작 (처음 가입한 유저와 동일)
const DEFAULT_USER: UserProfile = {
  id: 'usr-guest',
  email: '',
  nickname: '배달방어자',
  phone: '',
  address: '',
  detailAddress: '',
  isLoggedIn: false,
};

const AppContext = createContext<AppContextType | null>(null);

// v3: 이전(v2) 버전에 저장돼 있던 더미 사용자/주문 데이터를 브라우저에서 불러오지 않도록 키를 올림
const STORAGE_KEYS = {
  USER: 'close_call_user_v4', // v4: 이전에 로그인 상태(true)로 저장된 세션을 초기화
  ORDERS: 'close_call_orders_v3',
  RECENT_SEARCHES: 'close_call_recent_searches_v3',
  SOUND: 'close_call_sound_v3',
  SPLASH_SEEN: 'close_call_splash_seen_v3',
  IS_RESET: 'close_call_is_reset_v3',
};

// 구버전(v2, v3, v4) 잔여 사용자 캐시 제거 (Supabase Auth 세션으로 대체)
try {
  ['user', 'orders', 'recent_searches', 'sound', 'splash_seen', 'is_reset'].forEach(k =>
    localStorage.removeItem(`close_call_${k}_v2`)
  );
  localStorage.removeItem('close_call_user_v3');
  localStorage.removeItem('close_call_user_v4');
} catch {}

const pad2 = (n: number) => String(n).padStart(2, '0');

// 주문 시각 포맷: YYYY.MM.DD HH:mm
const formatOrderDate = (d: Date) =>
  `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const parseOrderDate = (s: string): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  const m = s.match(/(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null;
};

// 방어 성공 주문(실제 이용 기록)만으로 통계 계산. 기록이 없으면 전부 0
const computeDefenseStats = (orders: Order[], now: Date = new Date()): DefenseStats => {
  const defended = orders
    .filter(o => o.isDefenseSuccess)
    .map(o => ({ order: o, date: parseOrderDate(o.createdAt) }));

  const sum = (list: typeof defended) => list.reduce((acc, cur) => acc + cur.order.savedAmount, 0);

  const thisMonth = defended.filter(x => x.date && x.date.getFullYear() === now.getFullYear() && x.date.getMonth() === now.getMonth());
  const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = defended.filter(x => x.date && x.date.getFullYear() === lastMonthRef.getFullYear() && x.date.getMonth() === lastMonthRef.getMonth());

  // 월요일 시작 주
  const dow = (now.getDay() + 6) % 7;
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow);
  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
  const weeklyHistory = dayLabels.map((day, i) => {
    const start = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
    const end = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i + 1);
    const list = defended.filter(x => x.date && x.date >= start && x.date < end);
    return { day, savedAmount: sum(list), count: list.length };
  });
  const thisWeekCount = weeklyHistory.reduce((a, c) => a + c.count, 0);
  const thisWeekSaved = weeklyHistory.reduce((a, c) => a + c.savedAmount, 0);

  const monthCounts = new Map<string, { y: number; m: number; count: number }>();
  defended.forEach(x => {
    if (!x.date) return;
    const key = `${x.date.getFullYear()}-${x.date.getMonth()}`;
    const prev = monthCounts.get(key) || { y: x.date.getFullYear(), m: x.date.getMonth(), count: 0 };
    monthCounts.set(key, { ...prev, count: prev.count + 1 });
  });
  let best: { m: number; count: number } | null = null;
  monthCounts.forEach(v => {
    if (!best || v.count > best.count) best = { m: v.m, count: v.count };
  });
  const bestMonthRecord = best ? `${(best as { m: number; count: number }).m + 1}월 / ${(best as { m: number; count: number }).count}회` : '0회';

  return {
    totalDefendedCount: defended.length,
    totalSavedAmount: sum(defended),
    thisMonthSavedAmount: sum(thisMonth),
    thisMonthDefendedCount: thisMonth.length,
    lastMonthSavedAmount: sum(lastMonth),
    bestMonthRecord,
    thisWeekDefendedCount: thisWeekCount,
    thisWeekSavedAmount: thisWeekSaved,
    weeklyHistory,
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);

  // User (Supabase Auth 기반)
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  // Delivery Address (프론트엔드 임시 배달 주소 및 출처 관리)
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryDetailAddress, setDeliveryDetailAddress] = useState<string>('');
  const [addressSource, setAddressSource] = useState<'mypage' | 'temporary'>('temporary');

  // 로그인 유도 안내 문구 / 로그인 후 복귀 화면
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [loginRedirect, setLoginRedirect] = useState<ScreenType | null>(null);

  // Navigation context
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryType>('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Catalog from Supabase
  const [stores, setStores] = useState<Store[]>([]);
  const [menusByStore, setMenusByStore] = useState<Record<string, MenuItem[]>>({});
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const loadCatalog = async () => {
    try {
      setCatalogLoading(true);
      setCatalogError(null);
      const [fetchedStores, { menusByStore: fetchedMenusByStore }] = await Promise.all([
        fetchStores(),
        fetchMenus(),
      ]);
      setStores(fetchedStores);
      setMenusByStore(fetchedMenusByStore);
      if (fetchedStores.length > 0) {
        setSelectedStore(prev => prev ? (fetchedStores.find(s => s.id === prev.id) || fetchedStores[0]) : fetchedStores[0]);
      }
    } catch (err) {
      console.error('Catalog load error:', err);
      setCatalogError(err instanceof Error ? err.message : '가게 및 메뉴 데이터를 불러오지 못했습니다.');
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();

    // Supabase Auth 초기 세션 로드
    getInitialSession().then(res => {
      if (res?.profile) {
        setUser(res.profile);
        setDeliveryAddress(res.profile.address || '');
        setDeliveryDetailAddress(res.profile.detailAddress || '');
      }
    }).catch(err => {
      console.error('Failed to get initial auth session:', err);
    });

    // Supabase Auth 세션 변화 구독 (로그인, 로그아웃, 토큰 갱신)
    const { data: { subscription } } = subscribeToAuthChanges(profile => {
      if (profile) {
        setUser(profile);
        setDeliveryAddress(prev => prev || profile.address || '');
        setDeliveryDetailAddress(prev => prev || profile.detailAddress || '');
      } else {
        setUser(DEFAULT_USER);
        setDeliveryAddress('');
        setDeliveryDetailAddress('');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return saved ? JSON.parse(saved) : ['김치찜', '숯불치킨', '엽떡', '짜장면', '피자'];
    } catch {
      return ['김치찜', '숯불치킨', '엽떡', '짜장면', '피자'];
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartConflict, setCartConflict] = useState<PendingCartConflict | null>(null);

  // Orders (Supabase close_call_orders 동기화)
  const [orders, setOrders] = useState<Order[]>([]);

  // 로그인 상태 변화 시 사용자 영수증(방어 내역) DB 동기화
  useEffect(() => {
    if (user.isLoggedIn && user.id && !user.id.startsWith('usr-guest')) {
      fetchCloseCallOrders(user.id)
        .then(fetched => {
          setOrders(fetched);
        })
        .catch(err => {
          console.error('Failed to fetch user orders from Supabase:', err);
        });
    } else {
      setOrders([]);
    }
  }, [user.isLoggedIn, user.id]);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeSimulationOrderId, setActiveSimulationOrderId] = useState<string | null>(null);
  const [defenseSuccessModalOrder, setDefenseSuccessModalOrder] = useState<Order | null>(null);

  // completeDefense 1회성 가드용 (렌더와 무관하게 최신 값을 참조)
  const ordersRef = useRef<Order[]>(orders);
  ordersRef.current = orders;
  const completedOrderIdsRef = useRef<Set<string>>(new Set());
  const fanfareTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (fanfareTimerRef.current !== null) {
        clearTimeout(fanfareTimerRef.current);
        fanfareTimerRef.current = null;
      }
    };
  }, []);

  // Sound
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    sound.setEnabled(soundEnabled);
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Sync to localStorage (주문 및 검색어)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches]);

  const navigateTo = (screen: ScreenType) => {
    if (screen !== 'login' && screen !== 'signup') {
      setAuthNotice(null);
      setLoginRedirect(null);
    }
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const clearSimulationHistory = (destination: ScreenType) => {
    setScreenHistory(destination === 'home' ? ['home'] : ['home', destination]);
    setCurrentScreen(destination);
    setAuthNotice(null);
    setLoginRedirect(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goBack = () => {
    let dest: ScreenType = 'home';

    switch (currentScreen) {
      // 1) 하단 메뉴바 화면들: 상단 뒤로가기 클릭 시 무조건 홈으로 이동
      case 'search':
      case 'cart':
      case 'orders':
      case 'mypage':
        dest = 'home';
        break;

      // 2) 카테고리별 가게 목록: 뒤로가기 클릭 시 홈으로 이동
      case 'category':
        dest = 'home';
        break;

      // 3) 가게 상세 및 메뉴 화면: 뒤로가기 클릭 시 카테고리 가게 목록으로 이동
      case 'store':
        dest = 'category';
        break;

      // 4) 배달 현황 화면: 뒤로가기 클릭 시 홈으로 이동
      case 'delivery':
        dest = 'home';
        break;

      // 5) 주소 검색 화면: 호출했던 화면으로 복귀
      case 'address_search':
        dest = addressSource === 'mypage' ? 'mypage' : addressSource === 'cart' ? 'cart' : 'home';
        break;

      // 6) 로그인 / 회원가입: 이전 redirect 화면 또는 홈으로
      case 'login':
      case 'signup':
        dest = loginRedirect || 'home';
        break;

      default:
        dest = 'home';
        break;
    }

    if (dest !== 'login' && dest !== 'signup') {
      setAuthNotice(null);
      setLoginRedirect(null);
    }

    // 히스토리 정리 (배달이나 장바구니 등 완료된 플로우가 역주행하지 않도록 정리)
    setScreenHistory(prev => {
      const filtered = prev.filter(s => s !== currentScreen && s !== 'delivery');
      return filtered.length > 0 ? [...filtered, dest] : ['home', dest];
    });
    setCurrentScreen(dest);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const requireLogin = (message: string, returnTo?: ScreenType) => {
    setAuthNotice(message);
    setLoginRedirect(returnTo ?? null);
    navigateTo('login');
  };

  // 로그인/가입 완료 후 이동: 복귀 화면이 있으면 그곳으로, 없으면 홈으로
  const goAfterAuth = () => {
    const target = loginRedirect || 'home';
    setAuthNotice(null);
    setLoginRedirect(null);
    navigateTo(target);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { profile } = await authSignIn(email, password);
      setUser(profile);
      goAfterAuth();
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authSignOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(DEFAULT_USER);
    navigateTo('login');
  };

  const signup = async (
    email: string,
    password: string,
    nickname: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { profile } = await authSignUp(email, password, nickname, phone);
      setUser(profile);
      goAfterAuth();
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      return { success: false, error: msg };
    }
  };

  const openAddressSearch = (source: 'mypage' | 'temporary') => {
    if (!user.isLoggedIn) {
      requireLogin('로그인이 필요한 서비스입니다', source === 'mypage' ? 'mypage' : 'home');
      return;
    }
    setAddressSource(source);
    navigateTo('address_search');
  };

  const updateAddress = async (address: string, detailAddress: string) => {
    const fullAddress = detailAddress ? `${address} ${detailAddress}` : address;

    // 1) 임시 배달 주소는 항상 전역 상태에 갱신 (홈/결제/배달 화면 반영)
    setDeliveryAddress(address);
    setDeliveryDetailAddress(detailAddress);

    // 2) 마이페이지에서 변경한 경우에만 대표 집 주소로 DB에 영구 저장
    if (addressSource === 'mypage') {
      setUser(prev => ({
        ...prev,
        address,
        detailAddress,
      }));

      if (user.isLoggedIn && user.id && !user.id.startsWith('usr-guest')) {
        try {
          await updateUserProfile(user.id, { address: fullAddress });
        } catch (err) {
          console.error('Failed to update address in DB:', err);
        }
      }
    }
  };

  const addRecentSearch = (kw: string) => {
    if (!kw.trim()) return;
    setRecentSearches(prev => [kw.trim(), ...prev.filter(item => item !== kw.trim())].slice(0, 8));
  };

  const removeRecentSearch = (kw: string) => {
    setRecentSearches(prev => prev.filter(item => item !== kw));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Cart operations
  const cartStore = cart.length > 0 ? (stores.find(s => s.id === cart[0].storeId) || null) : null;

  const addToCart = (menu: MenuItem, store: Store, quantity: number, options: SelectedOption[]) => {
    const optionsPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const itemTotal = (menu.price + optionsPrice) * quantity;

    // Check if adding from different store
    if (cart.length > 0 && cart[0].storeId !== store.id) {
      setCartConflict({
        menu,
        store,
        quantity,
        options,
        currentStoreName: cart[0].storeName,
      });
      return;
    }

    // Check if identical item + options already exists
    const existingIndex = cart.findIndex(ci => {
      if (ci.menuItem.id !== menu.id) return false;
      if (ci.selectedOptions.length !== options.length) return false;
      const optIds1 = ci.selectedOptions.map(o => o.optionId).sort().join(',');
      const optIds2 = options.map(o => o.optionId).sort().join(',');
      return optIds1 === optIds2;
    });

    if (existingIndex > -1) {
      const newCart = [...cart];
      const existing = newCart[existingIndex];
      const newQty = existing.quantity + quantity;
      const singlePrice = existing.totalItemPrice / existing.quantity;
      newCart[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalItemPrice: singlePrice * newQty,
      };
      setCart(newCart);
    } else {
      setCart(prev => [
        ...prev,
        {
          cartItemId: `ci-${Date.now()}`,
          storeId: store.id,
          storeName: store.name,
          menuItem: menu,
          quantity,
          selectedOptions: options,
          totalItemPrice: itemTotal,
        }
      ]);
    }

    sound.playCartAdd();
    setSelectedMenuItem(null);
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId !== cartItemId) return item;
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        const unitPrice = item.totalItemPrice / item.quantity;
        return {
          ...item,
          quantity: newQty,
          totalItemPrice: unitPrice * newQty,
        };
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const resolveCartConflictReplace = () => {
    if (!cartConflict) return;
    const { menu, store, quantity, options } = cartConflict;
    const optionsPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const itemTotal = (menu.price + optionsPrice) * quantity;

    setCart([{
      cartItemId: `ci-${Date.now()}`,
      storeId: store.id,
      storeName: store.name,
      menuItem: menu,
      quantity,
      selectedOptions: options,
      totalItemPrice: itemTotal,
    }]);

    setCartConflict(null);
    sound.playCartAdd();
    setSelectedMenuItem(null);
  };

  const resolveCartConflictKeep = () => {
    setCartConflict(null);
  };

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const cartDeliveryFee = cart.length > 0 ? (cartStore?.deliveryFee || 2500) : 0;
  const cartFinalAmount = cartTotalAmount + cartDeliveryFee;

  // Virtual PG Payment
  const createVirtualOrder = (paymentMethod: string, shouldFail: boolean = false, riderRequest?: string): { success: boolean; orderId?: string; error?: string } => {
    if (cart.length === 0 || !cartStore) {
      return { success: false, error: '장바구니가 비어 있습니다.' };
    }

    if (shouldFail) {
      return { success: false, error: '카드사 승인 거절 (한도 초과 또는 일시적 통신 오류)' };
    }

    const orderId = `ord-${Date.now()}`;

    // Single receipt summary text (4-table close_call_orders structure)
    const mainItemName = cart[0].menuItem.name;
    const food_name = cart.length > 1
      ? `${mainItemName} 외 ${cart.length - 1}건`
      : cart[0].quantity > 1
      ? `${mainItemName} ${cart[0].quantity}개`
      : mainItemName;

    const allOptions = cart
      .flatMap(item => item.selectedOptions.map(opt => opt.optionName))
      .filter(Boolean);
    const option_text = allOptions.length > 0 ? allOptions.join(' / ') : undefined;

    const newOrder: Order = {
      id: orderId,
      storeId: cartStore.id,
      storeName: cartStore.name,
      storeImage: cartStore.image,
      food_name,
      option_text,
      items: [...cart],
      orderAmount: cartTotalAmount,
      deliveryFee: cartDeliveryFee,
      totalOrderAmount: cartFinalAmount,
      actualPaidAmount: 0,
      savedAmount: cartFinalAmount,
      paymentMethod,
      deliveryAddress: deliveryAddress || user.address,
      detailAddress: deliveryDetailAddress || user.detailAddress,
      riderRequest: riderRequest?.trim() || '문 앞에 두고 벨 눌러주세요',
      status: 'order_received',
      createdAt: formatOrderDate(new Date()),
      isDefenseSuccess: false,
      estimatedMinutes: cartStore.deliveryTimeMin || 25,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setActiveSimulationOrderId(orderId);
    // 장바구니는 여기서 비우지 않는다. 여기서 비우면 CartScreen이 빈 장바구니 화면으로 바뀔며
    // 결제 모달이 언마운트되어 배달 화면 전환(onSuccess)이 유실된다. 전환 직후 CartScreen에서 clearCart() 호출.
    sound.playPaymentChime();

    return { success: true, orderId };
  };

  // 배달 완료(방어 성공) 단일 진입점.
  // 이미 delivered 이거나 한 번 처리된 주문이면 어떤 로직도 다시 타지 않는다.
  // (추후 Supabase close_call_orders INSERT도 이 함수 안, 가드 통과 지점에 1회만 추가)
  const completeDefense = (orderId: string): boolean => {
    const target = ordersRef.current.find(o => o.id === orderId);
    if (!target || target.status === 'delivered' || completedOrderIdsRef.current.has(orderId)) {
      return false;
    }
    completedOrderIdsRef.current.add(orderId);

    setOrders(prev => prev.map(ord =>
      ord.id === orderId ? { ...ord, status: 'delivered', isDefenseSuccess: true } : ord
    ));
    setCurrentOrder(prev =>
      prev && prev.id === orderId ? { ...prev, status: 'delivered', isDefenseSuccess: true } : prev
    );

    sound.playDoorbell();
    if (fanfareTimerRef.current !== null) clearTimeout(fanfareTimerRef.current);
    fanfareTimerRef.current = window.setTimeout(() => {
      fanfareTimerRef.current = null;
      sound.playDefenseFanfare();
    }, 600);

    // Supabase DB 영수증 INSERT (로그인 사용자 대상, 단 1회)
    if (user.isLoggedIn && user.id && !user.id.startsWith('usr-guest')) {
      createCloseCallOrder({
        userId: user.id,
        storeId: target.storeId,
        foodName: target.food_name,
        optionText: target.option_text || null,
        savedPrice: target.savedAmount,
      })
        .then(dbOrderId => {
          setOrders(prev =>
            prev.map(ord => (ord.id === orderId ? { ...ord, id: String(dbOrderId) } : ord))
          );
        })
        .catch(err => {
          console.error('Failed to save close_call_orders to Supabase:', err);
        });
    }

    return true;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    // 완료 처리는 반드시 completeDefense 를 통과
    if (status === 'delivered') {
      completeDefense(orderId);
      return;
    }

    // 이미 완료된 주문의 상태를 되돌리지 않음
    setOrders(prev => prev.map(ord =>
      ord.id === orderId && ord.status !== 'delivered' ? { ...ord, status } : ord
    ));
    setCurrentOrder(prev =>
      prev && prev.id === orderId && prev.status !== 'delivered' ? { ...prev, status } : prev
    );
  };

  // Defense Statistics: 실제 방어 성공 기록으로만 계산 (기록 없으면 0건/0원)
  const defenseStats: DefenseStats = computeDefenseStats(orders);

  const resetAllData = () => {
    // Feature deprecated per user request
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        screenHistory,
        user,
        login,
        requireLogin,
        authNotice,
        logout,
        signup,
        updateAddress,
        deliveryAddress,
        deliveryDetailAddress,
        addressSource,
        openAddressSearch,
        clearSimulationHistory,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedStore,
        setSelectedStore,
        selectedMenuItem,
        setSelectedMenuItem,
        searchKeyword,
        setSearchKeyword,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        removeRecentSearch,
        stores,
        menusByStore,
        catalogLoading,
        catalogError,
        reloadCatalog: loadCatalog,
        cart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        cartTotalAmount,
        cartDeliveryFee,
        cartFinalAmount,
        cartStore,
        cartConflict,
        resolveCartConflictReplace,
        resolveCartConflictKeep,
        currentOrder,
        setCurrentOrder,
        orders,
        createVirtualOrder,
        updateOrderStatus,
        completeDefense,
        activeSimulationOrderId,
        setActiveSimulationOrderId,
        defenseSuccessModalOrder,
        setDefenseSuccessModalOrder,
        defenseStats,
        resetAllData,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
