export type CategoryType = 
  | 'all'
  | 'korean'
  | 'chicken'
  | 'pizza'
  | 'bunsik'
  | 'japanese'
  | 'chinese'
  | 'jokbal'
  | 'cafe'
  | 'burger';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string;
}

export interface MenuOptionItem {
  id: string;
  name: string;
  price: number;
}

export interface MenuOptionGroup {
  id: string;
  title: string;
  required: boolean;
  type: 'radio' | 'checkbox';
  options: MenuOptionItem[];
}

export interface MenuItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string; // e.g. "인기메뉴", "메인메뉴", "사이드", "음료"
  isPopular?: boolean;
  optionGroups?: MenuOptionGroup[];
}

export interface Store {
  id: string;
  name: string;
  category: CategoryType;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrderAmount: number;
  address?: string;
  phone?: string;
  notice?: string;
  tags: string[];
  isNew?: boolean;
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  storeId: string;
  storeName: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  totalItemPrice: number;
}

export type OrderStatus = 
  | 'payment_pending'
  | 'payment_failed'
  | 'order_received'   // 주문 접수
  | 'cooking'          // 조리 중
  | 'delivery_started' // 배달 시작
  | 'delivering'       // 배달 중
  | 'delivered';       // 배달 완료 (방어 성공!)

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  storeImage: string;
  food_name: string;        // 단일 영수증 요약 메뉴명 (예: "뿌링클 치킨 외 1건")
  option_text?: string;     // 단일 영수증 옵션 요약 텍스트 (예: "순살 / 매운맛 / 콜라 500ml")
  items?: CartItem[];       // 상세 장바구니 품목 (선택사항)
  orderAmount: number;     // 실제 배달음식 주문금액 (e.g. 36,500원)
  deliveryFee: number;     // 배달비 (e.g. 3,000원)
  totalOrderAmount: number; // 총 주문 금액 (e.g. 39,500원)
  actualPaidAmount: 0;     // 실제 지출 금액 (항상 0원!)
  savedAmount: number;     // 절약/방어한 금액 (totalOrderAmount와 동일)
  paymentMethod: string;
  deliveryAddress: string;
  detailAddress: string;
  riderRequest: string;
  status: OrderStatus;
  createdAt: string;       // ISO or YYYY.MM.DD HH:mm
  isDefenseSuccess: boolean; // 배달 시뮬레이션 완료 시 true
  estimatedMinutes: number;
}

export interface PendingCartConflict {
  menu: MenuItem;
  store: Store;
  quantity: number;
  options: SelectedOption[];
  currentStoreName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  phone: string;
  address: string;
  detailAddress: string;
  isLoggedIn: boolean;
}

export interface DefenseStats {
  totalDefendedCount: number;
  totalSavedAmount: number;
  thisMonthSavedAmount: number;
  thisMonthDefendedCount: number;
  lastMonthSavedAmount: number;
  bestMonthRecord: string; // 예: '10월 / 3회' (기록 없으면 '0회')
  thisWeekDefendedCount: number;
  thisWeekSavedAmount: number;
  weeklyHistory: {
    day: string; // '월', '화', '수', '목', '금', '토', '일'
    savedAmount: number;
    count: number;
  }[];
}
