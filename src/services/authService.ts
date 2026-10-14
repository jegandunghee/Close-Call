import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export interface DbUserRow {
  id: string;
  email: string;
  phone: string | null;
  nickname: string | null;
  address: string | null;
}

export function generateDefaultNickname(): string {
  return `배달방어자${Math.floor(100 + Math.random() * 900)}`;
}

export async function signUp(
  email: string,
  password: string,
  nickname: string,
  phone?: string
): Promise<{ user: any; profile: UserProfile }> {
  const finalNickname = nickname?.trim() || generateDefaultNickname();
  const cleanPhone = phone?.trim() || null;

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        nickname: finalNickname,
        phone: cleanPhone,
      },
    },
  });

  if (error) {
    if (
      error.message.includes('already registered') ||
      error.message.includes('User already registered')
    ) {
      throw new Error('이미 가입된 이메일입니다.');
    }
    throw new Error(error.message);
  }

  // Supabase 보안 정책으로 이미 존재하는 사용자일 때 identities가 빈 배열로 반환되는 경우
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('이미 가입된 이메일입니다.');
  }

  if (!data.user) {
    throw new Error('회원가입에 실패했습니다. 다시 시도해 주세요.');
  }

  // 프로필 정보 매핑
  const profile: UserProfile = {
    id: data.user.id,
    email: data.user.email || email,
    nickname: finalNickname,
    phone: cleanPhone || '',
    address: '',
    detailAddress: '',
    isLoggedIn: true,
  };

  return { user: data.user, profile };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: any; profile: UserProfile }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if (
      error.message.includes('Invalid login credentials') ||
      error.message.includes('invalid_grant')
    ) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('로그인에 실패했습니다. 다시 시도해 주세요.');
  }

  const profile = await fetchUserProfile(data.user.id, data.user.email || email);
  return { user: data.user, profile };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchUserProfile(userId: string, defaultEmail = ''): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch user profile:', error);
  }

  const row = data as DbUserRow | null;

  return {
    id: userId,
    email: row?.email || defaultEmail,
    nickname: row?.nickname || '배달방어자',
    phone: row?.phone || '',
    address: row?.address || '',
    detailAddress: '',
    isLoggedIn: true,
  };
}

export async function updateUserProfile(
  userId: string,
  updates: { nickname?: string; address?: string; phone?: string }
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) {
    throw new Error(`프로필 수정 실패: ${error.message}`);
  }
}

export async function getInitialSession(): Promise<{ user: any; profile: UserProfile } | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) {
    return null;
  }

  const profile = await fetchUserProfile(
    data.session.user.id,
    data.session.user.email || ''
  );

  return { user: data.session.user, profile };
}

export function subscribeToAuthChanges(
  onSessionChange: (profile: UserProfile | null) => void
) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await fetchUserProfile(
        session.user.id,
        session.user.email || ''
      );
      onSessionChange(profile);
    } else {
      onSessionChange(null);
    }
  });
}
