import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Trash2, 
  Minus, 
  Plus, 
  MapPin, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  ShoppingBag, 
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VirtualPGModal } from '../payment/VirtualPGModal';
import { LoginRequiredGuard } from '../auth/LoginRequiredGuard';

export const CartScreen: React.FC = () => {
  const { 
    cart, 
    cartStore, 
    updateCartItemQuantity, 
    removeCartItem, 
    clearCart, 
    cartTotalAmount, 
    cartDeliveryFee, 
    cartFinalAmount, 
    user, 
    navigateTo, 
    goBack,
    setActiveSimulationOrderId,
    deliveryAddress,
    deliveryDetailAddress,
    openAddressSearch
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('카카오페이');
  const [riderRequest, setRiderRequest] = useState('문 앞에 두고 벨 눌러주세요');
  const [showPGModal, setShowPGModal] = useState(false);

  const paymentOptions = [
    { id: '카카오페이', name: '카카오페이', badge: '가상 0원' },
    { id: '네이버페이', name: '네이버페이', badge: '가상 0원' },
    { id: '토스페이', name: '토스페이', badge: '가상 0원' },
    { id: '신용카드', name: '신용/체크카드', badge: '가상 0원' },
    { id: '계좌이체', name: '계좌이체', badge: '가상 0원' },
  ];

  const handleStartPayment = () => {
    if (cart.length === 0) return;
    setShowPGModal(true);
  };

  const handlePaymentSuccess = (orderId: string) => {
    setShowPGModal(false);
    setActiveSimulationOrderId(orderId);
    navigateTo('delivery');
    // 화면 전환과 함께 비운다 (createVirtualOrder에서 비우면 결제 모달이 먼저 언마운트되어 전환이 유실됨)
    clearCart();
  };

  // 비로그인 인증 가드
  if (!user.isLoggedIn) {
    return (
      <LoginRequiredGuard
        idPrefix="cart"
        title="장바구니"
        description={'로그인하면 메뉴를 담고\n0원으로 방어해볼 수 있어요.'}
      />
    );
  }

  // Wireframe Screen 13: 빈 장바구니 (Empty Cart)
  if (cart.length === 0 || !cartStore) {
    return (
      <div id="empty-cart-screen" className="flex-1 flex flex-col bg-stone-50 min-h-0">
        <div className="bg-white px-4 py-3 border-b border-stone-100 flex items-center justify-between shrink-0">
          <button onClick={goBack} className="p-1 -ml-2 text-stone-600 hover:text-stone-900 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-base font-bold text-stone-900">장바구니</h2>
          <div className="w-6" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-20 h-20 rounded-full bg-stone-200/70 flex items-center justify-center text-3xl mb-4 shadow-inner">
            🛒
          </div>
          <h3 className="text-base font-bold text-stone-900">장바구니가 비어있습니다.</h3>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-xs">
            지키고픈 배달의 유혹에서 탈출하게~~<br />
            먹고 싶은 음식을 마음껏 담고 0원으로 방어해보세요!
          </p>

          <button
            id="empty-cart-explore-btn"
            onClick={() => navigateTo('home')}
            className="mt-6 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            음식 둘러보러 가기
          </button>
        </div>
      </div>
    );
  }

  // Wireframe Screen 14: 장바구니 화면 (Populated Cart)
  return (
    <div id="cart-screen" className="flex-1 flex flex-col bg-stone-100 min-h-0 relative">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-stone-150 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-2xs">
        <button onClick={goBack} className="p-1 -ml-2 text-stone-600 hover:text-stone-900 rounded-full cursor-pointer">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-900">장바구니</h2>
        <button 
          id="cart-clear-btn"
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-600 font-medium cursor-pointer"
        >
          비우기
        </button>
      </div>

      {/* Main Scrollable Body */}
      <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto min-h-0">
        {/* Store Title Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-150">
            <h3 className="text-base font-bold text-stone-900">
              {cartStore.name}
            </h3>
            <button
              onClick={() => navigateTo('store')}
              className="text-xs text-amber-600 font-semibold hover:underline cursor-pointer"
            >
              + 메뉴 추가
            </button>
          </div>

          {/* Cart Items List matching Wireframe 14 */}
          <div className="divide-y divide-stone-100">
            {cart.map((item) => (
              <div key={item.cartItemId} id={`cart-item-${item.cartItemId}`} className="py-3.5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      {item.menuItem.name}
                    </h4>
                    {item.selectedOptions.length > 0 && (
                      <div className="text-[11px] text-stone-500 mt-1 space-y-0.5">
                        {item.selectedOptions.map((opt, i) => (
                          <div key={i} className="flex items-center gap-1 text-stone-400">
                            <span>· {opt.groupTitle}:</span>
                            <span className="text-stone-600 font-medium">{opt.optionName}</span>
                            {opt.price > 0 && (
                              <span className="text-stone-400">(+{opt.price.toLocaleString()}원)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeCartItem(item.cartItemId)}
                    className="p-1 text-stone-300 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-sm font-bold text-stone-900">
                    {item.totalItemPrice.toLocaleString()}원
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2.5 bg-stone-100 rounded-xl p-1 border border-stone-200">
                    <button
                      onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center font-bold text-xs text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Request matching Wireframe 14 */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-150">
            <h4 className="text-xs font-bold text-stone-800">배달 주소</h4>
            <button
              id="cart-address-change-btn"
              onClick={() => openAddressSearch('temporary')}
              className="text-xs text-amber-600 font-bold hover:underline cursor-pointer"
            >
              변경
            </button>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-stone-900">{(deliveryAddress || user.address) || '배달 주소를 설정해주세요'}</p>
              <p className="text-stone-500 mt-0.5">{deliveryDetailAddress || user.detailAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-stone-600 pt-1">
            <Phone className="w-4 h-4 text-stone-400 shrink-0" />
            <span>{user.phone || '연락처 미등록'}</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1.5">
              라이더 요청사항
            </label>
            <input
              type="text"
              value={riderRequest}
              onChange={(e) => setRiderRequest(e.target.value)}
              placeholder="예: 문 앞에 두고 벨 눌러주세요"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Payment Method Selection matching Wireframe 14 */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-150">
            <h4 className="text-xs font-bold text-stone-800">결제 수단 선택</h4>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              0원 가상 승인
            </span>
          </div>

          <div className="space-y-2">
            {paymentOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === opt.id 
                    ? 'border-amber-500 bg-amber-50/40 text-stone-900 font-bold ring-1 ring-amber-400/30' 
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="w-4 h-4 accent-amber-600"
                  />
                  <span className="text-xs">{opt.name}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">{opt.badge}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PRD FR-04: Clear Financial Distinction Between Order Amount and Actual Payment */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-2.5">
          <h4 className="text-xs font-bold text-stone-800 pb-2 border-b border-stone-150">
            결제 금액 확인
          </h4>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>주문 금액</span>
            <span>{cartTotalAmount.toLocaleString()}원</span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>배달팁</span>
            <span>+{cartDeliveryFee.toLocaleString()}원</span>
          </div>

          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>시킬뻔 가상 결제 방어 혜택</span>
            </div>
            <span>-{cartFinalAmount.toLocaleString()}원</span>
          </div>

          <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900">실제 결제 금액</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">
                ({cartFinalAmount.toLocaleString()}원 절약!)
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-600">
              0원
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Bottom Checkout Action Bar - ALWAYS in view at bottom of screen */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3.5 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] shrink-0">
        <button
          id="cart-checkout-btn"
          onClick={handleStartPayment}
          className="w-full py-4 bg-amber-500 hover:bg-amber-450 active:scale-[0.99] text-stone-950 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          <span>총 {cartFinalAmount.toLocaleString()}원 0원 결제하기</span>
        </button>
      </div>

      {/* Virtual PG Modal */}
      {showPGModal && (
        <VirtualPGModal
          paymentMethod={paymentMethod}
          riderRequest={riderRequest}
          orderAmount={cartFinalAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPGModal(false)}
        />
      )}
    </div>
  );
};
