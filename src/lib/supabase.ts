import { createClient } from "@supabase/supabase-js";

// .env에 적어둔 환경변수 불러오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 환경변수 에러 체크 
if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요');
}

// supabase 클라이언트 생성, 다른파일에서 가져다 쓸 수 있도록 export 하기 
export const supabase = createClient(supabaseUrl, supabasePublishableKey);