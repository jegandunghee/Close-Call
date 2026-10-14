import { supabase } from '../lib/supabase';
import { Store, MenuItem, CategoryType } from '../types';
import { MENU_OPTIONS, MENU_META } from '../constants/menuOptions';

export interface DbStoreRow {
  id: number;
  name: string;
  category: string;
  rating: number;
  delivery_tip: number;
  thumbnail_url: string | null;
  review_count: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  min_order_amount: number | null;
  notice: string | null;
  tags: string[] | null;
}

export interface DbMenuRow {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
}

export async function fetchStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`매장 목록 조회 실패: ${error.message}`);
  }

  return (data as DbStoreRow[]).map(row => ({
    id: String(row.id),
    name: row.name,
    category: (row.category || 'all') as CategoryType,
    image: row.thumbnail_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count ?? 0,
    deliveryTimeMin: row.delivery_time_min ?? 20,
    deliveryTimeMax: row.delivery_time_max ?? 40,
    deliveryFee: row.delivery_tip ?? 0,
    minOrderAmount: row.min_order_amount ?? 0,
    notice: row.notice ?? undefined,
    tags: row.tags ?? [],
  }));
}

export async function fetchMenus(): Promise<{
  menus: MenuItem[];
  menusByStore: Record<string, MenuItem[]>;
}> {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`메뉴 목록 조회 실패: ${error.message}`);
  }

  const menus: MenuItem[] = (data as DbMenuRow[]).map(row => {
    const numericId = Number(row.id);
    const meta = MENU_META[numericId];
    const options = MENU_OPTIONS[numericId];

    return {
      id: String(row.id),
      storeId: String(row.store_id),
      name: row.name,
      description: row.description || '',
      price: row.price,
      image: row.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      category: meta?.category || '일반메뉴',
      isPopular: meta?.isPopular,
      optionGroups: options,
    };
  });

  const menusByStore: Record<string, MenuItem[]> = {};
  menus.forEach(menu => {
    if (!menusByStore[menu.storeId]) {
      menusByStore[menu.storeId] = [];
    }
    menusByStore[menu.storeId].push(menu);
  });

  return { menus, menusByStore };
}
