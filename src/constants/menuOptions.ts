import { MenuOptionGroup } from '../types';

/**
 * DB menus 테이블에는 옵션 그룹 컬럼이 없으므로,
 * 메뉴의 고유 숫자 ID(bigint)를 키로 하여 옵션 그룹 목록을 매핑합니다.
 */
export const MENU_OPTIONS: Record<number, MenuOptionGroup[]> = {
  "101": [
    {
      "id": "og-soup",
      "title": "국/찌개 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-s1",
          "name": "된장국(두부, 감자, 애호박)",
          "price": 0
        },
        {
          "id": "opt-s2",
          "name": "맑은 콩나물국",
          "price": 0
        },
        {
          "id": "opt-s3",
          "name": "돼지고기 김치찌개 변경",
          "price": 1000
        },
        {
          "id": "opt-s4",
          "name": "우삼겹 청국장찌개 변경",
          "price": 1500
        }
      ]
    },
    {
      "id": "og-side",
      "title": "메인반찬 & 사이드 추가 (선택)",
      "required": false,
      "type": "checkbox",
      "options": [
        {
          "id": "opt-m1",
          "name": "수제 떡갈비 3pc",
          "price": 2000
        },
        {
          "id": "opt-m2",
          "name": "반숙 계란후라이 추가",
          "price": 800
        },
        {
          "id": "opt-m3",
          "name": "고추장 불고기 100g 추가",
          "price": 3000
        },
        {
          "id": "opt-m4",
          "name": "갓 지은 흑미밥 추가",
          "price": 1000
        }
      ]
    }
  ],
  "102": [
    {
      "id": "og-spicy",
      "title": "맵기 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-sp1",
          "name": "보통맛 (신라면 맵기)",
          "price": 0
        },
        {
          "id": "opt-sp2",
          "name": "매운맛 (열라면 맵기)",
          "price": 0
        },
        {
          "id": "opt-sp3",
          "name": "아주 매운맛 (불닭 맵기)",
          "price": 500
        }
      ]
    },
    {
      "id": "og-toppings",
      "title": "사리 추가 (선택)",
      "required": false,
      "type": "checkbox",
      "options": [
        {
          "id": "opt-t1",
          "name": "두부 사리 (4조각)",
          "price": 1500
        },
        {
          "id": "opt-t2",
          "name": "라면 사리",
          "price": 1500
        },
        {
          "id": "opt-t3",
          "name": "고기 추가 (150g)",
          "price": 4000
        }
      ]
    }
  ],
  "201": [
    {
      "id": "og-chicken-type",
      "title": "뼈 / 순살 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-c1",
          "name": "오리지널 뼈 (국내산)",
          "price": 0
        },
        {
          "id": "opt-c2",
          "name": "부드러운 순살 닭다리살",
          "price": 2000
        }
      ]
    },
    {
      "id": "og-spicy-lv",
      "title": "매운맛 단계 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-lv1",
          "name": "순한맛 (달콤담백)",
          "price": 0
        },
        {
          "id": "opt-lv2",
          "name": "중간맛 (신라면 정도)",
          "price": 0
        },
        {
          "id": "opt-lv3",
          "name": "매운맛 (화끈한 불맛)",
          "price": 500
        }
      ]
    },
    {
      "id": "og-noodle",
      "title": "사리 추가 (선택)",
      "required": false,
      "type": "checkbox",
      "options": [
        {
          "id": "opt-nd1",
          "name": "라면 사리 추가",
          "price": 2500
        },
        {
          "id": "opt-nd2",
          "name": "쫄깃 떡사리 (10개)",
          "price": 1500
        },
        {
          "id": "opt-nd3",
          "name": "모짜렐라 치즈 토핑",
          "price": 3000
        }
      ]
    }
  ],
  "301": [
    {
      "id": "og-tbk-type",
      "title": "구성 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-tb1",
          "name": "엽기떡볶이 (떡 많이)",
          "price": 0
        },
        {
          "id": "opt-tb2",
          "name": "엽기오뎅 (오뎅 많이)",
          "price": 0
        },
        {
          "id": "opt-tb3",
          "name": "엽기반반 (떡 반 + 오뎅 반)",
          "price": 0
        }
      ]
    },
    {
      "id": "og-tbk-spicy",
      "title": "맵기 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-tsp1",
          "name": "착한맛",
          "price": 0
        },
        {
          "id": "opt-tsp2",
          "name": "초보맛",
          "price": 0
        },
        {
          "id": "opt-tsp3",
          "name": "덜매운맛 (신라면 2배)",
          "price": 0
        },
        {
          "id": "opt-tsp4",
          "name": "오리지널 (엽떡 대표맛)",
          "price": 0
        }
      ]
    },
    {
      "id": "og-tbk-sides",
      "title": "토핑 & 사이드 추가 (선택)",
      "required": false,
      "type": "checkbox",
      "options": [
        {
          "id": "opt-ts1",
          "name": "모둠튀김 (야채, 김말이, 만두)",
          "price": 2500
        },
        {
          "id": "opt-ts2",
          "name": "주먹김밥 (셀프)",
          "price": 2500
        },
        {
          "id": "opt-ts3",
          "name": "중국당면 추가",
          "price": 2500
        },
        {
          "id": "opt-ts4",
          "name": "치즈 추가 (자연산 100%)",
          "price": 3000
        }
      ]
    }
  ],
  "401": [
    {
      "id": "og-chinese-sauce",
      "title": "탕수육 소스 방식 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-cs1",
          "name": "찍먹 (소스 따로 제공)",
          "price": 0
        },
        {
          "id": "opt-cs2",
          "name": "부먹 (소스 부어서 제공)",
          "price": 0
        }
      ]
    },
    {
      "id": "og-chinese-noodle",
      "title": "면 곱빼기 (선택)",
      "required": false,
      "type": "checkbox",
      "options": [
        {
          "id": "opt-cn1",
          "name": "간짜장 곱빼기 (+1인분 수준)",
          "price": 1500
        },
        {
          "id": "opt-cn2",
          "name": "군만두 (4pc) 추가",
          "price": 2500
        }
      ]
    }
  ],
  "501": [
    {
      "id": "og-crust",
      "title": "도우 & 크러스트 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-cr1",
          "name": "기본 오리지널 도우",
          "price": 0
        },
        {
          "id": "opt-cr2",
          "name": "치즈 크러스트 (스트링치즈)",
          "price": 3500
        },
        {
          "id": "opt-cr3",
          "name": "골드 소보로 고구마 크러스트",
          "price": 4500
        }
      ]
    },
    {
      "id": "og-pizza-sides",
      "title": "사이드 디시 (선택)",
      "required": false,
      "type": "checkbox",
      "options": [
        {
          "id": "opt-ps1",
          "name": "치즈 오븐 스파게티",
          "price": 5500
        },
        {
          "id": "opt-ps2",
          "name": "핫윙 5조각",
          "price": 4500
        },
        {
          "id": "opt-ps3",
          "name": "코카콜라 1.25L",
          "price": 2500
        }
      ]
    }
  ],
  "601": [
    {
      "id": "og-sauce6",
      "title": "디핑 소스 선택 (필수 1개)",
      "required": true,
      "type": "radio",
      "options": [
        {
          "id": "opt-ds1",
          "name": "달콤 양념 소스",
          "price": 0
        },
        {
          "id": "opt-ds2",
          "name": "볼케이노 매운 소스",
          "price": 500
        },
        {
          "id": "opt-ds3",
          "name": "어니언 크림 소스",
          "price": 500
        }
      ]
    }
  ],
  "901": [
    {
      "id": "og-bg-side",
      "title": "사이드 변경 (선택)",
      "required": false,
      "type": "radio",
      "options": [
        {
          "id": "opt-bg-s1",
          "name": "케이준 감자튀김 (기본)",
          "price": 0
        },
        {
          "id": "opt-bg-s2",
          "name": "어니언링 6조각 변경",
          "price": 1000
        },
        {
          "id": "opt-bg-s3",
          "name": "치즈 프라이즈 변경",
          "price": 1500
        }
      ]
    }
  ]
};

/**
 * DB menus 테이블에는 카테고리(e.g. "인기메뉴", "사이드") 및 인기 여부가 없으므로,
 * 메뉴의 고유 숫자 ID(bigint)를 키로 하여 프론트엔드 탭 분류 메타데이터를 매핑합니다.
 */
export const MENU_META: Record<number, { category: string; isPopular?: boolean }> = {
  "101": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "102": {
    "category": "메인메뉴",
    "isPopular": true
  },
  "103": {
    "category": "1인세트"
  },
  "104": {
    "category": "사이드"
  },
  "105": {
    "category": "음료"
  },
  "201": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "202": {
    "category": "메인메뉴"
  },
  "203": {
    "category": "사이드"
  },
  "301": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "302": {
    "category": "메인메뉴",
    "isPopular": true
  },
  "401": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "402": {
    "category": "메인메뉴"
  },
  "501": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "601": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "701": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "801": {
    "category": "인기메뉴",
    "isPopular": true
  },
  "901": {
    "category": "버거세트",
    "isPopular": true
  },
  "902": {
    "category": "수제버거단품",
    "isPopular": true
  },
  "903": {
    "category": "수제버거단품"
  },
  "1001": {
    "category": "디저트",
    "isPopular": true
  },
  "1002": {
    "category": "디저트",
    "isPopular": true
  },
  "1003": {
    "category": "음료"
  }
};
