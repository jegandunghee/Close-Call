import { supabase } from '../lib/supabase';
import { Order } from '../types';

export interface CreateOrderParams {
  userId: string;
  storeId: string | number;
  foodName: string;
  optionText?: string | null;
  savedPrice: number;
}

export interface DbOrderJoinRow {
  id: number;
  user_id: string;
  store_id: number | null;
  food_name: string;
  option_text: string | null;
  saved_price: number;
  created_at: string;
  stores: {
    name: string;
    thumbnail_url: string | null;
  } | null;
}

/**
 * 방어 성공(배달 완료) 시점에 Supabase close_call_orders 테이블에 영수증 레코드 생성
 */
export async function createCloseCallOrder(params: CreateOrderParams): Promise<number> {
  const numericStoreId = Number(params.storeId);

  const { data, error } = await supabase
    .from('close_call_orders')
    .insert({
      user_id: params.userId,
      store_id: isNaN(numericStoreId) ? null : numericStoreId,
      food_name: params.foodName,
      option_text: params.optionText?.trim() ? params.optionText.trim() : null,
      saved_price: params.savedPrice,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`주문 영수증 저장 실패: ${error.message}`);
  }

  return data.id;
}

/**
 * 사용자의 방어 성공 주문 내역(영수증) 조회
 * FK 조인을 통해 매장명과 썸네일을 함께 가져오며 매장이 삭제되었을 경우 '삭제된 매장'으로 매핑
 */
export async function fetchCloseCallOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('close_call_orders')
    .select(`
      id,
      user_id,
      store_id,
      food_name,
      option_text,
      saved_price,
      created_at,
      stores (
        name,
        thumbnail_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`주문 내역 조회 실패: ${error.message}`);
  }

  return (data as unknown as DbOrderJoinRow[]).map(row => {
    const storeName = row.stores?.name || '삭제된 매장';
    const storeImage = row.stores?.thumbnail_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';

    return {
      id: String(row.id),
      storeId: String(row.store_id ?? ''),
      storeName,
      storeImage,
      food_name: row.food_name,
      option_text: row.option_text || undefined,
      orderAmount: row.saved_price,
      deliveryFee: 0,
      totalOrderAmount: row.saved_price,
      actualPaidAmount: 0,
      savedAmount: row.saved_price,
      paymentMethod: '가상 결제 (0원)',
      deliveryAddress: '',
      detailAddress: '',
      riderRequest: '',
      status: 'delivered',
      createdAt: row.created_at,
      isDefenseSuccess: true,
      estimatedMinutes: 0,
    };
  });
}
