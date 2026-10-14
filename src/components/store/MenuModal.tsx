import React, { useState } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { MenuItem, SelectedOption } from '../../types';
import { useApp } from '../../context/AppContext';

interface MenuModalProps {
  menu: MenuItem;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ menu, onClose }) => {
  const { selectedStore, addToCart, user, requireLogin } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(() => {
    // Preselect default required radio options
    const defaults: SelectedOption[] = [];
    if (menu.optionGroups) {
      menu.optionGroups.forEach(group => {
        if (group.type === 'radio' && group.options.length > 0) {
          defaults.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: group.options[0].id,
            optionName: group.options[0].name,
            price: group.options[0].price,
          });
        }
      });
    }
    return defaults;
  });

  const handleRadioSelect = (groupId: string, groupTitle: string, optionId: string, optionName: string, price: number) => {
    setSelectedOptions(prev => {
      const filtered = prev.filter(o => o.groupId !== groupId);
      return [...filtered, { groupId, groupTitle, optionId, optionName, price }];
    });
  };

  const handleCheckboxToggle = (groupId: string, groupTitle: string, optionId: string, optionName: string, price: number) => {
    setSelectedOptions(prev => {
      const exists = prev.some(o => o.groupId === groupId && o.optionId === optionId);
      if (exists) {
        return prev.filter(o => !(o.groupId === groupId && o.optionId === optionId));
      } else {
        return [...prev, { groupId, groupTitle, optionId, optionName, price }];
      }
    });
  };

  const optionsTotalPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const singleUnitPrice = menu.price + optionsTotalPrice;
  const totalPrice = singleUnitPrice * quantity;

  const handleAddToCart = () => {
    // 비로그인 인증 가드: 구경은 자유, 담기는 로그인 필요
    if (!user.isLoggedIn) {
      onClose();
      requireLogin('로그인이 필요합니다. 로그인 후 장바구니에 담아주세요.', 'store');
      return;
    }
    if (!selectedStore) return;
    addToCart(menu, selectedStore, quantity, selectedOptions);
    onClose();
  };

  return (
    <div 
      id="menu-detail-modal"
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs animate-fadeIn"
    >
      <div 
        className="w-full sm:max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button & Image matching Wireframe Screen 10 */}
        <div className="relative h-48 shrink-0 bg-stone-100">
          <img
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
          <button
            id="menu-modal-close-btn"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Information */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="border-b border-stone-150 pb-4">
            <h2 className="text-lg font-bold text-stone-900 leading-tight">
              {menu.name}
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              {menu.description}
            </p>
            <div className="text-base font-bold text-stone-900 mt-2">
              기본 가격: <span className="text-amber-600">{menu.price.toLocaleString()}원</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-1 border-b border-stone-150 pb-4">
            <span className="text-sm font-bold text-stone-800">수량</span>
            <div className="flex items-center gap-3 bg-stone-100 rounded-xl p-1 border border-stone-200">
              <button
                id="menu-qty-minus-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-700 disabled:opacity-30 shadow-2xs hover:bg-stone-50"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-stone-900">{quantity}</span>
              <button
                id="menu-qty-plus-btn"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option Groups matching Wireframe Screen 10 */}
          {menu.optionGroups && menu.optionGroups.map((group) => (
            <div key={group.id} className="space-y-2 border-b border-stone-150 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-800">
                  {group.title}
                </h3>
                {group.required && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                    필수
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {group.options.map((option) => {
                  const isChecked = selectedOptions.some(
                    o => o.groupId === group.id && o.optionId === option.id
                  );

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-amber-500 bg-amber-50/40 text-stone-900' 
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type={group.type}
                          name={group.id}
                          checked={isChecked}
                          onChange={() => {
                            if (group.type === 'radio') {
                              handleRadioSelect(group.id, group.title, option.id, option.name, option.price);
                            } else {
                              handleCheckboxToggle(group.id, group.title, option.id, option.name, option.price);
                            }
                          }}
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <span className="text-xs font-medium">{option.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-600">
                        {option.price > 0 ? `+${option.price.toLocaleString()}원` : '0원'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Bottom Action Button matching Wireframe 10 */}
        <div className="p-4 bg-white border-t border-stone-200 shadow-lg shrink-0">
          <button
            id="menu-modal-add-cart-btn"
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-450 active:scale-[0.99] text-stone-950 font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-between px-5"
          >
            <span>{totalPrice.toLocaleString()}원</span>
            <span>장바구니 담기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
