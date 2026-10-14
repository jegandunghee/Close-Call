import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  User as UserIcon, 
  AlertTriangle,
  Lock,
  MapPin,
  LogOut,
  UserX,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoginRequiredGuard } from '../auth/LoginRequiredGuard';

export const MyPageScreen: React.FC = () => {
  const { 
    user, 
    defenseStats, 
    navigateTo, 
    goBack, 
    logout,
    openAddressSearch
  } = useApp();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMessage, setPwMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw) {
      setPwMessage('새 비밀번호를 입력하세요.');
      return;
    }
    setPwMessage('비밀번호가 성공적으로 변경되었습니다.');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPwMessage('');
      setCurrentPw('');
      setNewPw('');
      triggerToast('비밀번호가 변경되었습니다.');
    }, 800);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(false);
    logout();
  };

  // 비로그인 인증 가드: 프로필/통계 대신 로그인 안내 화면 표시
  if (!user.isLoggedIn) {
    return (
      <LoginRequiredGuard
        idPrefix="mypage"
        title="마이페이지"
        description={'로그인하면 나의 방어 기록과\n절약 통계를 확인할 수 있어요.'}
      />
    );
  }

  return (
    <div id="mypage-screen" className="flex-1 flex flex-col bg-stone-100 pb-20">
      {/* Top Header matching Wireframe: Back button + Center Title */}
      <div className="bg-white px-4 py-3 border-b border-stone-150 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button 
          id="mypage-back-btn"
          onClick={goBack} 
          className="p-1 -ml-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-900">마이페이지</h2>
        <div className="w-6" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
        {/* Profile Row matching Wireframe: Circular avatar + User Name */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 shrink-0">
            <UserIcon className="w-7 h-7 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-stone-900 truncate">
              {user.nickname || '홍길동'}
            </h3>
            <p className="text-xs text-stone-400 truncate mt-0.5">
              {user.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Monthly Savings Highlight Row matching Wireframe: "이번달 절약 금액" */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <span className="text-xs font-medium text-stone-600">이번달 절약 금액</span>
          <span className="text-base font-bold text-stone-900">
            {defenseStats.thisMonthSavedAmount.toLocaleString()}원
          </span>
        </div>

        {/* Monthly Card matching Wireframe: "월별" with graph boxes & stats */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-stone-800">월별</h4>

          {/* Graph Simulation Box */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-150">
            <div className="flex items-end justify-around h-20 pt-2 px-4 gap-6">
              {/* Last month bar */}
              <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-stone-500 font-semibold whitespace-nowrap">
                  {defenseStats.lastMonthSavedAmount.toLocaleString()}원
                </span>
                <div 
                  className={`w-10 rounded-t-md transition-all ${
                    defenseStats.lastMonthSavedAmount > 0 ? 'h-11 bg-stone-300' : 'h-2 bg-stone-200'
                  }`} 
                />
                <span className="text-[10px] text-stone-500 font-medium">지난달</span>
              </div>

              {/* This month bar */}
              <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-amber-600 font-bold whitespace-nowrap">
                  {defenseStats.thisMonthSavedAmount > 0 ? `${defenseStats.thisMonthSavedAmount.toLocaleString()}원` : '0원'}
                </span>
                <div 
                  className={`w-10 rounded-t-md transition-all ${
                    defenseStats.thisMonthSavedAmount > 0 ? 'h-16 bg-amber-500 shadow-sm' : 'h-2 bg-stone-200'
                  }`} 
                />
                <span className="text-[10px] text-stone-900 font-bold">이번달</span>
              </div>
            </div>
          </div>

          {/* Bottom Split Stats matching Wireframe: "총 참은 횟수" | "월 최고 기록" */}
          <div className="grid grid-cols-2 divide-x divide-stone-150 pt-2">
            <div className="pr-3">
              <span className="text-[11px] text-stone-400 block">총 참은 횟수</span>
              <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                {defenseStats.thisMonthDefendedCount}회
              </span>
            </div>
            <div className="pl-3">
              <span className="text-[11px] text-stone-400 block">월 최고 기록</span>
              <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                {defenseStats.bestMonthRecord}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Card matching Wireframe: "이번 주" */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-2.5">
          <h4 className="text-xs font-bold text-stone-800 pb-1">이번 주</h4>

          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">참은 횟수</span>
            <span className="font-bold text-stone-900">
              {defenseStats.thisWeekDefendedCount}회
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
            <span className="text-stone-500 font-medium">절약 금액</span>
            <span className="font-bold text-stone-900">
              {defenseStats.thisWeekSavedAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Account Settings Card matching Wireframe: "계정 설정" with action rows */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-1">
          <h4 className="text-xs font-bold text-stone-800 pb-2">계정 설정</h4>

          <button
            id="mypage-btn-password"
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-2.5 flex items-center justify-between text-left text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors"
          >
            <span>비밀번호 변경</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            id="mypage-btn-address"
            onClick={() => openAddressSearch('mypage')}
            className="w-full py-2.5 flex items-center justify-between text-left text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors border-t border-stone-100 cursor-pointer"
          >
            <span>주소 변경</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            id="mypage-btn-logout"
            onClick={logout}
            className="w-full py-2.5 flex items-center justify-between text-left text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors border-t border-stone-100 cursor-pointer"
          >
            <span>로그아웃</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            id="mypage-btn-withdraw"
            onClick={() => setShowWithdrawModal(true)}
            className="w-full py-2.5 flex items-center justify-between text-left text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors border-t border-stone-100 cursor-pointer"
          >
            <span>회원탈퇴</span>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>

        {/* Footer Info matching Wireframe */}
        <div className="text-center pt-3 pb-4 text-[11px] text-stone-400 space-y-0.5">
          <p>앱 버전 1.0.0</p>
          <p>©2026. 재희컴퍼니. All rights reserved</p>
          <p>문의 : admin@email.com</p>
        </div>
      </div>

      {/* Modal Layer Popup: Password Change */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[320px] bg-white rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="w-11 h-11 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-stone-900 text-center">
              비밀번호 변경
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-2.5 text-left">
              <div>
                <label className="block text-[10px] font-semibold text-stone-500 mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-500 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="새 비밀번호 입력"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {pwMessage && (
                <p className="text-xs text-emerald-600 font-semibold">{pwMessage}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
                >
                  변경 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Layer Popup: Withdraw Confirmation */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[320px] bg-white rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <UserX className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-stone-900">
                정말 탈퇴하시겠습니까?
              </h3>
              <p className="text-xs text-stone-500">
                탈퇴 시 모든 계정 정보와 절약 기록이 영구히 삭제됩니다.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
