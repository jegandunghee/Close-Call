import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MapPin, Check, Edit3, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoginRequiredGuard } from '../auth/LoginRequiredGuard';

declare global {
  interface Window {
    daum?: any;
  }
}

export const AddressScreen: React.FC = () => {
  const { user, updateAddress, goBack, deliveryAddress, deliveryDetailAddress } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [mode, setMode] = useState<'kakao' | 'manual'>('kakao');
  const [selectedRoad, setSelectedRoad] = useState(deliveryAddress || user.address || '');
  const [detailAddress, setDetailAddress] = useState(deliveryDetailAddress || user.detailAddress || '');
  const [manualAddressInput, setManualAddressInput] = useState(deliveryAddress || user.address || '');
  const [isLoadingScript, setIsLoadingScript] = useState(!window.daum?.Postcode);
  const [scriptError, setScriptError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Daum Postcode unmount 시 iframe null document 참조 오류 방어
  useEffect(() => {
    const handlePostcodeError = (e: ErrorEvent) => {
      if (
        (e.message && e.message.includes("reading 'document'")) ||
        (e.filename && e.filename.includes('postcode'))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('error', handlePostcodeError);
    return () => {
      window.removeEventListener('error', handlePostcodeError);
    };
  }, []);

  if (!user.isLoggedIn) {
    return (
      <LoginRequiredGuard
        idPrefix="address"
        title="배달 주소 설정"
        description={'로그인하면 배달 주소를 설정하고\n가상 배달 주문을 진행할 수 있어요.'}
      />
    );
  }

  // Initialize Kakao/Daum Postcode Embed
  useEffect(() => {
    if (step !== 1 || mode !== 'kakao') return;

    let isMounted = true;

    const initPostcode = () => {
      if (!window.daum || !window.daum.Postcode || !containerRef.current) return;
      containerRef.current.innerHTML = '';

      try {
        new window.daum.Postcode({
          oncomplete: (data: any) => {
            if (!isMounted) return;
            let fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            if (!fullAddress) fullAddress = data.address;

            let extraAddress = '';
            if (data.userSelectedType === 'R') {
              if (data.bname !== '') {
                extraAddress += data.bname;
              }
              if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
              }
              if (extraAddress !== '') {
                fullAddress += ` (${extraAddress})`;
              }
            }

            setSelectedRoad(fullAddress);
            setStep(2);
          },
          width: '100%',
          height: '100%',
        }).embed(containerRef.current, { autoClose: false });
      } catch (err) {
        console.error('Failed to embed Daum Postcode:', err);
        if (isMounted) setScriptError(true);
      }
    };

    if (window.daum && window.daum.Postcode) {
      initPostcode();
    } else {
      setIsLoadingScript(true);
      setScriptError(false);

      const existingScript = document.getElementById('daum-postcode-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'daum-postcode-script';
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        if (!isMounted) return;
        setIsLoadingScript(false);
        initPostcode();
      };
      script.onerror = () => {
        if (!isMounted) return;
        setIsLoadingScript(false);
        setScriptError(true);
      };
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (containerRef.current) {
        try {
          const iframes = containerRef.current.getElementsByTagName('iframe');
          for (let i = 0; i < iframes.length; i++) {
            iframes[i].src = 'about:blank';
          }
          containerRef.current.innerHTML = '';
        } catch {
          // ignore
        }
      }
    };
  }, [step, mode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddressInput.trim()) return;
    setSelectedRoad(manualAddressInput.trim());
    setStep(2);
  };

  const handleSave = () => {
    updateAddress(selectedRoad, detailAddress);
    goBack();
  };

  return (
    <div id="address-screen" className="flex-1 flex flex-col bg-white min-h-0">
      {/* Top Header - Back button only (close button removed as requested) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-150 shrink-0 bg-white sticky top-0 z-20 shadow-2xs">
        <button 
          id="address-back-btn" 
          onClick={step === 2 ? () => setStep(1) : goBack} 
          className="p-2 -ml-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-semibold text-stone-600 sm:inline">뒤로</span>
        </button>
        <h2 className="text-base font-bold text-stone-900">
          {step === 1 ? '주소 검색' : '배달 주소 설정'}
        </h2>
        <div className="w-8" />
      </div>

      {step === 1 ? (
        /* Step 1: Real Address Search using Kakao Postcode API or Manual Direct Entry */
        <div className="flex-1 flex flex-col min-h-0 bg-stone-50">
          {/* Tabs: Kakao API Search vs Manual Direct Entry */}
          <div className="bg-white px-4 pt-2.5 pb-2 border-b border-stone-200/80 shrink-0 flex items-center gap-2">
            <button
              id="address-mode-kakao-tab"
              type="button"
              onClick={() => setMode('kakao')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'kakao' 
                  ? 'bg-amber-500 text-stone-950 shadow-xs' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>카카오 도로명 주소 검색</span>
            </button>
            <button
              id="address-mode-manual-tab"
              type="button"
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'manual' 
                  ? 'bg-stone-900 text-white shadow-xs' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>직접 주소 입력</span>
            </button>
          </div>

          {mode === 'kakao' ? (
            /* Kakao Postcode Embed Area */
            <div className="flex-1 flex flex-col min-h-0 relative bg-white">
              {isLoadingScript && (
                <div className="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
                  <p className="text-xs font-semibold text-stone-600">
                    카카오 우편번호 검색 서비스를 불러오는 중입니다...
                  </p>
                </div>
              )}

              {scriptError ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">검색 서비스를 불러오지 못했습니다</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      네트워크 상태를 확인하시거나 직접 주소를 입력해 주세요.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    직접 주소 입력으로 전환
                  </button>
                </div>
              ) : (
                /* Kakao Postcode Widget will be cleanly embedded here */
                <div 
                  ref={containerRef} 
                  id="kakao-postcode-container"
                  className="flex-1 w-full h-full min-h-[480px] overflow-hidden" 
                />
              )}
            </div>
          ) : (
            /* Manual Address Input Form */
            <div className="p-4 space-y-4 bg-white flex-1 overflow-y-auto">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-bold">직접 주소 입력 안내</p>
                <p className="text-stone-600 leading-relaxed">
                  도로명 주소 또는 지번 주소를 원하는 형식 그대로 직접 입력하여 배달지로 설정할 수 있습니다.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    기본 주소 (도로명 / 지번)
                  </label>
                  <input
                    id="address-manual-road-input"
                    type="text"
                    value={manualAddressInput}
                    onChange={(e) => setManualAddressInput(e.target.value)}
                    placeholder="예: 서울특별시 마포구 어울마당로 75"
                    required
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                    autoFocus
                  />
                </div>

                <button
                  id="address-manual-next-btn"
                  type="submit"
                  disabled={!manualAddressInput.trim()}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md transition-all cursor-pointer"
                >
                  다음 (상세 주소 입력)
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* Step 2: Confirmation & Detail Address Input */
        <div className="flex-1 flex flex-col justify-between bg-stone-50 min-h-0">
          <div className="p-4 bg-white border-b border-stone-150 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                선택된 배달 주소
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-900 font-semibold underline"
              >
                주소 다시 검색
              </button>
            </div>
            <p className="text-base font-bold text-stone-900 mt-1 leading-snug">
              {selectedRoad}
            </p>
          </div>

          {/* Location Pin Visual Map Display Area */}
          <div className="relative flex-1 bg-stone-200 overflow-hidden flex items-center justify-center min-h-[200px]">
            {/* SVG Grid simulating city layout */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#F1F5F9" />
              <rect width="100%" height="100%" fill="url(#street-grid)" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#E2E8F0" strokeWidth="16" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#E2E8F0" strokeWidth="16" />
            </svg>

            {/* Map center destination pin */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="px-3 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-full shadow-lg mb-1 whitespace-nowrap">
                배달 받으실 곳
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] text-stone-600 font-medium shadow-sm border border-stone-200/80">
              배달지 주소가 확정되었습니다
            </div>
          </div>

          {/* Detailed address input and Final Save button */}
          <div className="p-4 bg-white border-t border-stone-200 shadow-md space-y-3 shrink-0">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                상세 주소 (동 / 호수 / 층 / 기타)
              </label>
              <input
                id="address-detail-input"
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="예: 101동 1402호, 2층 원룸"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                id="address-step-prev-btn"
                onClick={() => setStep(1)}
                className="py-3.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-sm transition-colors cursor-pointer"
              >
                이전
              </button>
              <button
                type="button"
                id="address-save-btn"
                onClick={handleSave}
                className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>이 주소로 설정</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
