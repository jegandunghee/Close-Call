import React, { useState } from 'react';
import { ChevronLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SignupScreen: React.FC = () => {
  const { signup, navigateTo, goBack } = useApp();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';

    // If 8 digits or starts without 0 (e.g., 12345678 -> 1234-5678)
    if (digits.length <= 8 && !digits.startsWith('0')) {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
    }

    // Seoul area code 02
    if (digits.startsWith('02')) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    }

    // Standard mobile or other area codes (010, etc.)
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!nickname.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const savedPhone = formatPhoneNumber(phone.trim()) || phone.trim();
    try {
      setLoading(true);
      const res = await signup(email, password, nickname, savedPhone);
      if (!res.success) {
        setError(res.error || '회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-screen" className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-4">
        <button 
          id="signup-back-btn" 
          onClick={goBack} 
          className="p-1 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-stone-900">회원가입</h2>
        <div className="w-6" />
      </div>

      <p className="text-xs text-stone-500 mb-5">
        시킬뻔 가입하고 충동 배달비 수십만 원을 지켜보세요!
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">이메일</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="signup-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@closecall.app"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">닉네임</label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="signup-nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 배달지킴이"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">휴대폰 번호</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="signup-phone-input"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-XXXX-XXXX"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">비밀번호</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="signup-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상 입력"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">비밀번호 확인</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="signup-confirm-password-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium py-1">{error}</p>
        )}

        <button
          id="signup-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-450 disabled:bg-amber-300 active:scale-[0.99] text-stone-950 font-bold rounded-xl text-sm shadow-md transition-all mt-4 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? '가입 진행 중...' : '회원가입 완료'}
        </button>
      </form>

      <div className="mt-auto pt-6 text-center">
        <span className="text-xs text-stone-400">이미 계정이 있으신가요? </span>
        <button
          id="signup-to-login-btn"
          onClick={() => navigateTo('login')}
          className="text-xs text-stone-900 font-bold hover:underline ml-1"
        >
          로그인하러 가기
        </button>
      </div>
    </div>
  );
};
