-- ==========================================
-- 시킬뻔 (Close Call) 기초 매장 및 메뉴 Seed SQL
-- ==========================================

-- 1. stores 시드 데이터
INSERT INTO public.stores (
  id, name, category, rating, delivery_tip, thumbnail_url,
  review_count, delivery_time_min, delivery_time_max, min_order_amount, notice, tags
) VALUES
  (1, '김진수네 저녁식사는 항상 진수성찬', 'korean', 4.9, 2500, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80', 1840, 25, 35, 14000, '따뜻한 집밥 한 상! 어머니의 손맛 그대로 매일 아침 직접 끓인 찌개와 정갈한 5찬을 제공합니다.', ARRAY['한식맛집', '김치찌개', '제육볶음', '1인메뉴']),
  (2, '훌랄라 바베큐 치킨 합정점', 'chicken', 4.8, 3000, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80', 2310, 30, 45, 17000, '참숯 직화구이의 깊은 불향! 특제 비법 양념에 떡사리와 라면사리의 환상 궁합!', ARRAY['참숯바베큐', '숯불치킨', '야식추천', '치맥']),
  (3, '동대문 불타는 매운 엽기떡볶이', 'bunsik', 4.9, 2000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80', 3420, 20, 35, 14000, '스트레스 날리는 화끈한 매운맛! 100% 자연산 모짜렐라 치즈와 쫀득한 밀떡.', ARRAY['엽떡', '치즈폭탄', '야식1위', '분식']),
  (4, '만리장성에서 먹는 짜장면이 그렇게 맛있다더라', 'chinese', 4.7, 1500, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', 1120, 15, 25, 13000, '30년 전통 수타의 식감! 바삭 쫄깃한 찹쌀 탕수육과 불맛 간짜장 전문점입니다.', ARRAY['탕수육세트', '간짜장', '해물짬뽕', '신속배달']),
  (5, '반올림 통베이컨 포테이토 피자', 'pizza', 4.8, 2000, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80', 980, 30, 40, 18000, '특제 갈릭소스와 두툼한 생감자, 훈제 베이컨이 듬뿍 들어간 시그니처 피자!', ARRAY['치즈크러스트', '포테이토피자', '오븐스파게티']),
  (6, '브라질산 닭다리로만 튀기는 갓성비 치킨', 'chicken', 4.6, 1500, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80', 890, 25, 40, 13000, '오직 겉바속촉 순살 닭다리살 100%! 넘치는 양과 착한 가격으로 모십니다.', ARRAY['순살치킨', '갓성비', '양념치킨', '감자튀김']),
  (7, '돈카츠 명가 카츠야 홍대본점', 'japanese', 4.9, 2500, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80', 1520, 20, 35, 15000, '국내산 한돈 300시간 누룩 숙성! 핑크빛 촉촉한 특등심과 치즈 폭탄 카츠.', ARRAY['특등심카츠', '치즈카츠', '냉모밀', '일식']),
  (8, '도야지 불타는 족발&직화보쌈', 'jokbal', 4.8, 3000, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', 1670, 30, 45, 26000, '매일 삶는 국내산 생족! 쟁반 막국수와 겉절이, 계란찜 기본 서비스 증정!', ARRAY['반반족발', '불족발', '마늘보쌈', '막국수']),
  (9, '버거스쿼드 수제버거 홍대본점', 'burger', 4.9, 2500, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', 1420, 20, 35, 13000, '100% 순소고기 패티의 깊은 육즙! 매일 아침 구워내는 브리오슈 번과 특제 소스의 풍미.', ARRAY['수제버거', '치즈버거', '감자튀김', '밀크쉐이크']),
  (10, '달콤한 오후 디저트&베이커리 카페', 'cafe', 4.9, 2000, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', 1890, 15, 30, 12000, '프랑스 고메버터 100% 크로플과 당일 구운 소금빵, 진한 바닐라빈 라떼 전문 디저트 카페.', ARRAY['크로플', '디저트', '소금빵', '아메리카노'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  delivery_tip = EXCLUDED.delivery_tip,
  thumbnail_url = EXCLUDED.thumbnail_url,
  review_count = EXCLUDED.review_count,
  delivery_time_min = EXCLUDED.delivery_time_min,
  delivery_time_max = EXCLUDED.delivery_time_max,
  min_order_amount = EXCLUDED.min_order_amount,
  notice = EXCLUDED.notice,
  tags = EXCLUDED.tags;

-- stores 시퀀스 동기화
SELECT setval(pg_get_serial_sequence('public.stores', 'id'), coalesce(max(id), 1)) FROM public.stores;

-- 2. menus 시드 데이터
INSERT INTO public.menus (
  id, store_id, name, description, image_url, price
) VALUES
  (101, 1, '[1등 메뉴] 진수 반상 - 1인 메뉴', '진수성찬의 시그니처 대표 메뉴! 공기밥, 김, 김치2종, 제철 밑반찬 3종 포함.', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80', 16500),
  (102, 1, '묵은지 생돼지 김치찜 (2~3인)', '푹 쪄낸 통묵은지와 야들야들한 생돼지 앞다리살의 완벽한 조화.', 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=80', 24000),
  (103, 1, '직화 고추장 불고기 정식', '불향 가득 입힌 매콤달콤 고추장 제육볶음과 쌈채소 세트.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', 15000),
  (104, 1, '스팸 계란말이 (대)', '촉촉한 계란 5알과 짭조름한 스팸의 두툼한 만남.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80', 8500),
  (105, 1, '살얼음 식혜 500ml', '직접 담근 전통 단호박 엿기름 살얼음 식혜.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80', 3000),
  (201, 2, '시그니처 숯불 양념 바베큐 치킨', '국내산 닭을 참숯 화덕에서 기름 쏙 빼고 비법 양념소스를 듬뿍 바른 시그니처 메뉴!', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80', 21900),
  (202, 2, '숯불 소금구이 바베큐', '담백함의 끝판왕! 오직 참숯 직화 열기로 구워낸 겉바속촉 다이어트 야식 치킨.', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80', 20900),
  (203, 2, '치즈볼 5개 + 갈릭 디핑소스', '달콤한 크림치즈와 모짜렐라가 가득 찬 쫀득 치즈볼.', 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80', 5500),
  (301, 3, '치즈폭탄 엽기떡볶이 (3~4인)', '떡, 오뎅, 햄 7개, 치즈가 기본으로 들어간 중독성 최강 국물 떡볶이.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80', 17000),
  (302, 3, '로제 엽기떡볶이 (치즈포함)', '부드러운 크림과 매콤한 엽떡의 환상적인 하모니!', 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600&auto=format&fit=crop&q=80', 19000),
  (401, 4, '탕수육(소) + 직화 간짜장 1인 세트', '바삭하고 쫄깃한 한돈 등심 탕수육과 양파 아삭한 불맛 간짜장.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80', 18000),
  (402, 4, '얼큰 삼선 해물짬뽕', '오징어, 홍합, 새우가 듬뿍 들어간 칼칼하고 시원한 국물.', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80', 11000),
  (501, 5, '반올림 통베이컨 포테이토 피자 (L)', '두툼한 통베이컨과 부드러운 웨지감자, 갈릭소스가 듬뿍!', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 24900),
  (601, 6, '레전드 갓성비 순살 핫후라이드 (1인)', '바삭하고 매콤한 크리스피 튀김옷과 육즙 가득 순살 닭다리.', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 10500),
  (701, 7, '숙성 특등심 로스카츠 정식', '육즙 가득 두툼한 프리미엄 등심카츠와 미소장국, 양배추 샐러드.', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80', 15500),
  (801, 8, '국내산 생족발 (중) + 쟁반막국수 세트', '부드럽고 쫄깃한 온족발과 새콤달콤 야채 막국수 풀세트.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 36000),
  (901, 9, '더블 아메리칸 치즈버거 세트', '순소고기 100% 더블 패티, 진한 체다치즈 2장, 케이준 감자튀김, 콜라 세트.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 13500),
  (902, 9, '트러플 머쉬룸 수제버거 단품', '구운 양송이버섯과 은은한 트러플 마요 소스의 고급스러운 조화.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80', 11000),
  (903, 9, '매콤 크리스피 핫치킨 버거', '통닭다리살을 바삭하게 튀겨낸 스파이시 치킨 패티와 코울슬로.', 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80', 9800),
  (1001, 10, '프랑스 고메버터 크로플 세트 (2pc)', '겉은 바삭하고 속은 쫄깃한 수제 크로플과 바닐라 젤라또 아이스크림.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 9500),
  (1002, 10, '리얼 딸기 생크림 듬뿍 와플', '생딸기가 가득 올라간 옛날 감성 뚱와플.', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80', 8500),
  (1003, 10, '고소한 아메리카노 (1L 보틀)', '브라질 & 콜롬비아 원두 블렌딩의 깊고 진한 풍미.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', 4500)
ON CONFLICT (id) DO UPDATE SET
  store_id = EXCLUDED.store_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  price = EXCLUDED.price;

-- menus 시퀀스 동기화
SELECT setval(pg_get_serial_sequence('public.menus', 'id'), coalesce(max(id), 1)) FROM public.menus;
