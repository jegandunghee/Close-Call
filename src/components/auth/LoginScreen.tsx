import React, { useState } from 'react';
import { ChevronLeft, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login, navigateTo, goBack, authNotice } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!password.trim()) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || '로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-screen" className="flex-1 flex flex-col bg-white p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-6">
        <button 
          id="login-back-btn" 
          onClick={goBack} 
          className="p-1 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-stone-900">로그인</h2>
        <div className="w-6" />
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl mb-3 shadow-md">
          시;
        </div>
        <h3 className="text-xl font-bold text-stone-900">반가워요!</h3>
        <p className="text-xs text-stone-500 mt-1">배달 충동을 현명하게 이겨내는 가상 주문</p>
      </div>

      {authNotice && (
        <div
          id="login-auth-notice"
          className="mb-4 px-3.5 py-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-800 flex items-center gap-2 animate-fadeIn"
        >
          <Lock className="w-4 h-4 shrink-0" />
          <span>{authNotice}</span>
        </div>
      )}

      {/* Form matching Wireframe */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">이메일</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">비밀번호</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        )}

        {/* Social Login Circles matching Wireframe */}
        <div className="pt-4 pb-2">
          <p className="text-[11px] text-center text-stone-400 mb-3">간편 로그인</p>
          <div className="flex justify-center items-center gap-4">
            <button
              id="login-kakao-btn"
              type="button"
              className="w-11 h-11 rounded-full bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-transform"
              title="카카오 로그인"
            >
              카카오
            </button>
            <button
              id="login-google-btn"
              type="button"
              className="w-11 h-11 rounded-full bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-transform"
              title="구글 로그인"
            >
              G
            </button>
            <button
              id="login-naver-btn"
              type="button"
              className="w-11 h-11 rounded-full bg-[#03C75A] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-transform"
              title="네이버 로그인"
            >
              N
            </button>
          </div>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all mt-4 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {/* Wireframe link: 회원가입 하러가기 */}
      <div className="mt-auto pt-6 text-center">
        <span className="text-xs text-stone-400">아직 계정이 없으신가요? </span>
        <button
          id="login-to-signup-btn"
          onClick={() => navigateTo('signup')}
          className="text-xs text-amber-600 font-bold hover:underline ml-1"
        >
          회원가입 하러가기
        </button>
      </div>
    </div>
  );
};
