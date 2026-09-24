import { appleProducts } from "./apple-products";
import { autoMotoProducts } from "./auto-moto-products";
import { beautyProducts } from "./beauty-products";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;

  price: number;
  oldPrice: number;

  sold: number;
  stock: number;

  rating: number;
  reviewCount: number;

  tag: string;

  image: string;
  images: string[];

  description: string;

  specs: {
    label: string;
    value: string;
  }[];

  options?: {
    name: string;
    values: string[];
  }[];

  /*
   * 不同顏色對應不同商品圖片
   *
   * 例如：
   *
   * colorImages: {
   *   "黑色": [
   *     "圖片1",
   *     "圖片2",
   *     "圖片3"
   *   ]
   * }
   */
  colorImages?: Record<string, string[]>;
};


export const products: Product[] = [
  ...appleProducts,
  ...autoMotoProducts,
  ...beautyProducts,


  // =====================================================
  // 01 iPhone 17 Pro Max
  // =====================================================

  {
    id: "iphone-17-pro-max",

    name: "iPhone 17 Pro Max",

    brand: "Apple",

    category: "手機",

    price: 42900,

    oldPrice: 49900,

    sold: 8921,

    stock: 26,

    rating: 4.9,

    reviewCount: 2386,

    tag: "熱門",

    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=90",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=90",
      "https://images.unsplash.com/photo-1592286927505-2fd0b9b0b9f3?w=1200&q=90",
    ],

    colorImages: {
      "鈦原色": [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=90",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=90",
        "https://images.unsplash.com/photo-1592286927505-2fd0b9b0b9f3?w=1200&q=90",
      ],

      "黑色": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=90",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=90",
        "https://images.unsplash.com/photo-1592286927505-2fd0b9b0b9f3?w=1200&q=90",
      ],

      "銀色": [
        "https://images.unsplash.com/photo-1592286927505-2fd0b9b0b9f3?w=1200&q=90",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=90",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=90",
      ],
    },

    description:
      "新世代旗艦智慧型手機，提供高階效能、專業級攝影能力與完整的行動裝置體驗。",

    specs: [
      {
        label: "品牌",
        value: "Apple",
      },
      {
        label: "產品類型",
        value: "智慧型手機",
      },
      {
        label: "螢幕",
        value: "6.9 吋",
      },
      {
        label: "儲存容量",
        value: "256GB / 512GB / 1TB",
      },
      {
        label: "連線",
        value: "5G / Wi-Fi / Bluetooth",
      },
      {
        label: "作業系統",
        value: "iOS",
      },
    ],

    options: [
      {
        name: "顏色",
        values: [
          "鈦原色",
          "黑色",
          "銀色",
        ],
      },
      {
        name: "容量",
        values: [
          "256GB",
          "512GB",
          "1TB",
        ],
      },
    ],
  },


  // =====================================================
  // 02 Samsung Galaxy S26 Ultra
  // =====================================================

  {
    id: "samsung-galaxy-s26-ultra",

    name: "Samsung Galaxy S26 Ultra",

    brand: "Samsung",

    category: "手機",

    price: 38900,

    oldPrice: 44900,

    sold: 6210,

    stock: 34,

    rating: 4.8,

    reviewCount: 1842,

    tag: "NEW",

    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=90",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=90",
    ],

    colorImages: {
      "黑色": [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=90",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=90",
      ],

      "銀色": [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=90",
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=90",
      ],

      "藍色": [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=90",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=90",
      ],
    },

    description:
      "Samsung 旗艦智慧型手機，搭載高階顯示器、相機系統與旗艦級行動處理能力。",

    specs: [
      {
        label: "品牌",
        value: "Samsung",
      },
      {
        label: "產品類型",
        value: "智慧型手機",
      },
      {
        label: "螢幕",
        value: "6.8 吋",
      },
      {
        label: "儲存容量",
        value: "256GB / 512GB / 1TB",
      },
      {
        label: "連線",
        value: "5G / Wi-Fi / Bluetooth",
      },
    ],

    options: [
      {
        name: "顏色",
        values: [
          "黑色",
          "銀色",
          "藍色",
        ],
      },
      {
        name: "容量",
        values: [
          "256GB",
          "512GB",
          "1TB",
        ],
      },
    ],
  },


  // =====================================================
  // 03 Sony BRAVIA OLED
  // =====================================================

  {
    id: "sony-bravia-oled-65",

    name: "Sony BRAVIA OLED 65 吋",

    brand: "Sony",

    category: "電視",

    price: 79900,

    oldPrice: 99900,

    sold: 2187,

    stock: 12,

    rating: 4.8,

    reviewCount: 736,

    tag: "旗艦",

    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=90",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&q=90",
    ],

    description:
      "高階 OLED 智慧電視，提供高對比畫面、細緻色彩與家庭娛樂體驗。",

    specs: [
      {
        label: "品牌",
        value: "Sony",
      },
      {
        label: "尺寸",
        value: "65 吋",
      },
      {
        label: "面板",
        value: "OLED",
      },
      {
        label: "解析度",
        value: "4K",
      },
      {
        label: "系統",
        value: "Google TV",
      },
    ],
  },


  // =====================================================
  // 04 PlayStation 5 Pro
  // =====================================================

  {
    id: "playstation-5-pro",

    name: "PlayStation 5 Pro",

    brand: "PlayStation",

    category: "電玩",

    price: 23980,

    oldPrice: 25980,

    sold: 7412,

    stock: 18,

    rating: 4.9,

    reviewCount: 3187,

    tag: "熱門",

    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&q=90",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=90",
    ],

    description:
      "高階家用遊戲主機，提供更高效能的遊戲體驗與次世代圖像效果。",

    specs: [
      {
        label: "品牌",
        value: "Sony Interactive Entertainment",
      },
      {
        label: "類型",
        value: "家用遊戲主機",
      },
      {
        label: "儲存",
        value: "SSD",
      },
      {
        label: "輸出",
        value: "4K / HDR",
      },
    ],
  },


  // =====================================================
  // 05 Nintendo Switch 2
  // =====================================================

  {
    id: "nintendo-switch-2",

    name: "Nintendo Switch 2",

    brand: "Nintendo",

    category: "電玩",

    price: 14980,

    oldPrice: 15980,

    sold: 9210,

    stock: 42,

    rating: 4.8,

    reviewCount: 4021,

    tag: "NEW",

    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=1200&q=90",
      "https://images.unsplash.com/photo-1592840062661-3a5e0f1a9c6c?w=1200&q=90",
    ],

    description:
      "新世代 Nintendo 遊戲主機，支援掌上與電視模式，適合家庭與多人遊戲。",

    specs: [
      {
        label: "品牌",
        value: "Nintendo",
      },
      {
        label: "類型",
        value: "遊戲主機",
      },
      {
        label: "模式",
        value: "掌上 / 桌上 / TV",
      },
      {
        label: "儲存",
        value: "內建儲存空間",
      },
    ],
  },


  // =====================================================
  // 06 RTX 5090
  // =====================================================

  {
    id: "rtx-5090",

    name: "NVIDIA GeForce RTX 5090",

    brand: "NVIDIA",

    category: "顯卡",

    price: 99900,

    oldPrice: 109900,

    sold: 1865,

    stock: 7,

    rating: 4.9,

    reviewCount: 891,

    tag: "頂級",

    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=90",
    ],

    description:
      "頂級 PC 顯示卡產品，針對高解析度遊戲、創作與高效能運算需求打造。",

    specs: [
      {
        label: "品牌",
        value: "NVIDIA",
      },
      {
        label: "產品類型",
        value: "GPU / 顯示卡",
      },
      {
        label: "用途",
        value: "遊戲 / AI / 創作",
      },
      {
        label: "介面",
        value: "PCI Express",
      },
    ],
  },


  // =====================================================
  // 07 ASUS ROG
  // =====================================================

  {
    id: "asus-rog-laptop",

    name: "ASUS ROG 旗艦電競筆電",

    brand: "ASUS",

    category: "筆電",

    price: 89900,

    oldPrice: 99900,

    sold: 3218,

    stock: 15,

    rating: 4.8,

    reviewCount: 1204,

    tag: "電競",

    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=90",
    ],

    description:
      "高效能電競筆電，適合遊戲、影音製作與高效能工作。",

    specs: [
      {
        label: "品牌",
        value: "ASUS ROG",
      },
      {
        label: "類型",
        value: "電競筆記型電腦",
      },
      {
        label: "螢幕",
        value: "16 吋",
      },
      {
        label: "用途",
        value: "Gaming / Creator",
      },
    ],
  },


  // =====================================================
  // 08 MacBook Pro
  // =====================================================

  {
    id: "macbook-pro",

    name: "MacBook Pro 16 吋",

    brand: "Apple",

    category: "筆電",

    price: 89900,

    oldPrice: 99900,

    sold: 5812,

    stock: 23,

    rating: 4.9,

    reviewCount: 2837,

    tag: "熱門",

    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=90",
    ],

    description:
      "專業級 MacBook Pro，適合程式開發、影像處理、影音創作與日常工作。",

    specs: [
      {
        label: "品牌",
        value: "Apple",
      },
      {
        label: "尺寸",
        value: "16 吋",
      },
      {
        label: "類型",
        value: "專業筆記型電腦",
      },
      {
        label: "系統",
        value: "macOS",
      },
    ],
  },


  // =====================================================
  // 09 Sony Alpha
  // =====================================================

  {
    id: "sony-alpha-camera",

    name: "Sony α7 系列全片幅相機",

    brand: "Sony",

    category: "相機",

    price: 72900,

    oldPrice: 82900,

    sold: 1987,

    stock: 11,

    rating: 4.8,

    reviewCount: 632,

    tag: "攝影",

    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=90",
    ],

    description:
      "全片幅無反相機，適合專業攝影、影片拍攝與內容創作。",

    specs: [
      {
        label: "品牌",
        value: "Sony",
      },
      {
        label: "類型",
        value: "全片幅無反相機",
      },
      {
        label: "用途",
        value: "照片 / 影片",
      },
    ],
  },


  // =====================================================
  // 10 Leica Q3
  // =====================================================

  {
    id: "leica-q3",

    name: "Leica Q3",

    brand: "Leica",

    category: "相機",

    price: 168000,

    oldPrice: 178000,

    sold: 621,

    stock: 4,

    rating: 4.9,

    reviewCount: 214,

    tag: "精品",

    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1200&q=90",
    ],

    description:
      "Leica 高階固定鏡頭數位相機，結合經典設計與高畫質攝影體驗。",

    specs: [
      {
        label: "品牌",
        value: "Leica",
      },
      {
        label: "類型",
        value: "高階數位相機",
      },
      {
        label: "定位",
        value: "Premium",
      },
    ],
  },


  // =====================================================
  // 11 JBL PartyBox
  // =====================================================

  {
    id: "jbl-partybox-ultimate",

    name: "JBL PartyBox Ultimate",

    brand: "JBL",

    category: "音響",

    price: 29900,

    oldPrice: 34900,

    sold: 3842,

    stock: 19,

    rating: 4.8,

    reviewCount: 1021,

    tag: "派對",

    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&q=90",
    ],

    description:
      "大型派對型藍牙音響，適合家庭聚會、戶外活動與音樂娛樂。",

    specs: [
      {
        label: "品牌",
        value: "JBL",
      },
      {
        label: "類型",
        value: "Party Speaker",
      },
      {
        label: "連線",
        value: "Bluetooth",
      },
    ],
  },


  // =====================================================
  // 12 Bose
  // =====================================================

  {
    id: "bose-qc-ultra",

    name: "Bose QuietComfort Ultra",

    brand: "Bose",

    category: "耳機",

    price: 10900,

    oldPrice: 12900,

    sold: 7210,

    stock: 31,

    rating: 4.8,

    reviewCount: 2187,

    tag: "熱門",

    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=90",
    ],

    description:
      "高階降噪耳罩式耳機，提供沉浸式聆聽與長時間舒適配戴體驗。",

    specs: [
      {
        label: "品牌",
        value: "Bose",
      },
      {
        label: "類型",
        value: "無線降噪耳機",
      },
      {
        label: "連線",
        value: "Bluetooth",
      },
    ],
  },


  // =====================================================
  // 13 Sonos
  // =====================================================

  {
    id: "sonos-era-300",

    name: "Sonos Era 300",

    brand: "Sonos",

    category: "音響",

    price: 15900,

    oldPrice: 17900,

    sold: 1287,

    stock: 16,

    rating: 4.7,

    reviewCount: 421,

    tag: "音樂",

    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&q=90",
    ],

    description:
      "高階家庭智慧音響，適合建立多房間音樂系統。",

    specs: [
      {
        label: "品牌",
        value: "Sonos",
      },
      {
        label: "類型",
        value: "智慧音響",
      },
      {
        label: "連線",
        value: "Wi-Fi",
      },
    ],
  },


  // =====================================================
  // 14 Marshall
  // =====================================================

  {
    id: "marshall-woburn-iii",

    name: "Marshall Woburn III",

    brand: "Marshall",

    category: "音響",

    price: 17900,

    oldPrice: 19900,

    sold: 2178,

    stock: 14,

    rating: 4.8,

    reviewCount: 562,

    tag: "經典",

    image:
      "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=1200&q=90",
    ],

    description:
      "經典復古外型與高音質表現兼具的家庭音響。",

    specs: [
      {
        label: "品牌",
        value: "Marshall",
      },
      {
        label: "類型",
        value: "家庭音響",
      },
      {
        label: "連線",
        value: "Bluetooth",
      },
    ],
  },


  // =====================================================
  // 15 Dyson
  // =====================================================

  {
    id: "dyson-vacuum",

    name: "Dyson 旗艦吸塵器",

    brand: "Dyson",

    category: "家電",

    price: 24900,

    oldPrice: 29900,

    sold: 4281,

    stock: 22,

    rating: 4.8,

    reviewCount: 1542,

    tag: "熱門",

    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&q=90",
    ],

    description:
      "高階無線吸塵器，提供居家清潔所需的便利性與強勁吸力。",

    specs: [
      {
        label: "品牌",
        value: "Dyson",
      },
      {
        label: "類型",
        value: "無線吸塵器",
      },
      {
        label: "用途",
        value: "居家清潔",
      },
    ],
  },


  // =====================================================
  // 16 Panasonic 冷氣
  // =====================================================

  {
    id: "panasonic-air-conditioner",

    name: "Panasonic 旗艦冷氣",

    brand: "Panasonic",

    category: "冷氣",

    price: 45900,

    oldPrice: 52900,

    sold: 891,

    stock: 8,

    rating: 4.7,

    reviewCount: 328,

    tag: "家電",

    image:
      "https://images.unsplash.com/photo-1631545806609-3f0c4e8f2f3e?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1631545806609-3f0c4e8f2f3e?w=1200&q=90",
    ],

    description:
      "高階家用冷氣產品，提供舒適的室內溫度控制體驗。",

    specs: [
      {
        label: "品牌",
        value: "Panasonic",
      },
      {
        label: "類型",
        value: "分離式冷氣",
      },
      {
        label: "用途",
        value: "居家空調",
      },
    ],
  },


  // =====================================================
  // 17 LG OLED
  // =====================================================

  {
    id: "lg-oled-77",

    name: "LG OLED evo 77 吋",

    brand: "LG",

    category: "電視",

    price: 119900,

    oldPrice: 139900,

    sold: 1241,

    stock: 6,

    rating: 4.9,

    reviewCount: 487,

    tag: "旗艦",

    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&q=90",
    ],

    description:
      "超大尺寸 OLED 電視，適合家庭劇院與高階影音娛樂。",

    specs: [
      {
        label: "品牌",
        value: "LG",
      },
      {
        label: "尺寸",
        value: "77 吋",
      },
      {
        label: "面板",
        value: "OLED",
      },
      {
        label: "解析度",
        value: "4K",
      },
    ],
  },


  // =====================================================
  // 18 Apple Watch Ultra
  // =====================================================

  {
    id: "apple-watch-ultra",

    name: "Apple Watch Ultra",

    brand: "Apple",

    category: "手機",

    price: 26900,

    oldPrice: 29900,

    sold: 6187,

    stock: 28,

    rating: 4.8,

    reviewCount: 1921,

    tag: "運動",

    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&q=90",
    ],

    description:
      "高階智慧型手錶，適合運動、戶外活動與日常使用。",

    specs: [
      {
        label: "品牌",
        value: "Apple",
      },
      {
        label: "類型",
        value: "智慧型手錶",
      },
      {
        label: "用途",
        value: "運動 / 日常",
      },
    ],
  },


  // =====================================================
  // 19 AirPods Pro
  // =====================================================

  {
    id: "airpods-pro",

    name: "AirPods Pro",

    brand: "Apple",

    category: "耳機",

    price: 7490,

    oldPrice: 8490,

    sold: 12891,

    stock: 52,

    rating: 4.9,

    reviewCount: 5832,

    tag: "熱賣",

    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&q=90",
    ],

    colorImages: {
      "白色": [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&q=90",
      ],

      "黑色": [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=90",
      ],
    },

    description:
      "真無線降噪耳機，適合通勤、運動與日常音樂使用。",

    specs: [
      {
        label: "品牌",
        value: "Apple",
      },
      {
        label: "類型",
        value: "真無線耳機",
      },
      {
        label: "連線",
        value: "Bluetooth",
      },
    ],

    options: [
      {
        name: "顏色",
        values: [
          "白色",
          "黑色",
        ],
      },
    ],
  },


  // =====================================================
  // 20 Air Jordan
  // =====================================================

  {
    id: "air-jordan",

    name: "Nike Air Jordan 經典款",

    brand: "Nike",

    category: "球鞋",

    price: 6990,

    oldPrice: 7990,

    sold: 9182,

    stock: 35,

    rating: 4.8,

    reviewCount: 2148,

    tag: "潮流",

    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=90",
    ],

    colorImages: {
      "黑色": [
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=90",
      ],

      "白色": [
        "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=1200&q=90",
      ],
    },

    description:
      "經典籃球鞋款，結合街頭風格與日常穿搭。",

    specs: [
      {
        label: "品牌",
        value: "Nike",
      },
      {
        label: "類型",
        value: "球鞋",
      },
      {
        label: "用途",
        value: "休閒 / 運動",
      },
    ],

    options: [
      {
        name: "顏色",
        values: [
          "黑色",
          "白色",
        ],
      },
      {
        name: "尺寸",
        values: [
          "US 8",
          "US 9",
          "US 10",
          "US 11",
        ],
      },
    ],
  },


  // =====================================================
  // 21 Supreme
  // =====================================================

  {
    id: "supreme-jacket",

    name: "Supreme 經典外套",

    brand: "Supreme",

    category: "服飾",

    price: 18900,

    oldPrice: 22900,

    sold: 1842,

    stock: 9,

    rating: 4.7,

    reviewCount: 321,

    tag: "街頭",

    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=90",
    ],

    colorImages: {
      "黑色": [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=90",
      ],

      "灰色": [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=90",
      ],
    },

    description:
      "街頭潮流風格外套，適合日常穿搭。",

    specs: [
      {
        label: "品牌",
        value: "Supreme",
      },
      {
        label: "類型",
        value: "外套",
      },
    ],

    options: [
      {
        name: "顏色",
        values: [
          "黑色",
          "灰色",
        ],
      },
      {
        name: "尺寸",
        values: [
          "S",
          "M",
          "L",
          "XL",
        ],
      },
    ],
  },


  // =====================================================
  // 22 Louis Vuitton
  // =====================================================

  {
    id: "louis-vuitton-bag",

    name: "Louis Vuitton 經典包款",

    brand: "Louis Vuitton",

    category: "精品",

    price: 68900,

    oldPrice: 75900,

    sold: 924,

    stock: 5,

    rating: 4.9,

    reviewCount: 187,

    tag: "精品",

    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=90",
    ],

    description:
      "經典精品包款，適合作為日常穿搭與收藏使用。",

    specs: [
      {
        label: "品牌",
        value: "Louis Vuitton",
      },
      {
        label: "類型",
        value: "精品包款",
      },
    ],
  },


  // =====================================================
  // 23 Gucci
  // =====================================================

  {
    id: "gucci-bag",

    name: "Gucci 經典包款",

    brand: "Gucci",

    category: "精品",

    price: 59900,

    oldPrice: 69900,

    sold: 781,

    stock: 6,

    rating: 4.8,

    reviewCount: 142,

    tag: "精品",

    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=90",
    ],

    description:
      "經典精品包款，呈現品牌代表性的時尚設計。",

    specs: [
      {
        label: "品牌",
        value: "Gucci",
      },
      {
        label: "類型",
        value: "精品包款",
      },
    ],
  },


  // =====================================================
  // 24 Rolex
  // =====================================================

  {
    id: "rolex-submariner",

    name: "Rolex Submariner",

    brand: "Rolex",

    category: "名錶",

    price: 398000,

    oldPrice: 428000,

    sold: 182,

    stock: 2,

    rating: 4.9,

    reviewCount: 94,

    tag: "奢華",

    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=90",
    ],

    description:
      "經典高級腕錶風格展示商品。",

    specs: [
      {
        label: "品牌",
        value: "Rolex",
      },
      {
        label: "類型",
        value: "機械腕錶",
      },
      {
        label: "定位",
        value: "Luxury",
      },
    ],
  },


  // =====================================================
  // 25 Omega
  // =====================================================

  {
    id: "omega-speedmaster",

    name: "Omega Speedmaster",

    brand: "Omega",

    category: "名錶",

    price: 198000,

    oldPrice: 218000,

    sold: 326,

    stock: 3,

    rating: 4.9,

    reviewCount: 118,

    tag: "經典",

    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=90",
    ],

    description:
      "經典計時腕錶風格展示商品。",

    specs: [
      {
        label: "品牌",
        value: "Omega",
      },
      {
        label: "類型",
        value: "機械腕錶",
      },
    ],
  },


  // =====================================================
  // 26 Tesla Model 3
  // =====================================================

  {
    id: "tesla-model-3",

    name: "Tesla Model 3",

    brand: "Tesla",

    category: "汽車",

    price: 1599000,

    oldPrice: 1699000,

    sold: 482,

    stock: 8,

    rating: 4.8,

    reviewCount: 236,

    tag: "電動",

    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=90",
    ],

    description:
      "電動車展示商品，呈現現代電動車的產品資訊與規格。",

    specs: [
      {
        label: "品牌",
        value: "Tesla",
      },
      {
        label: "類型",
        value: "電動車",
      },
      {
        label: "能源",
        value: "Electric",
      },
    ],
  },


  // =====================================================
  // 27 BMW M3
  // =====================================================

  {
    id: "bmw-m3",

    name: "BMW M3 Competition",

    brand: "BMW",

    category: "汽車",

    price: 3980000,

    oldPrice: 4280000,

    sold: 96,

    stock: 2,

    rating: 4.9,

    reviewCount: 71,

    tag: "性能",

    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=90",
    ],

    description:
      "高性能房車展示商品，提供性能車款的資訊展示。",

    specs: [
      {
        label: "品牌",
        value: "BMW",
      },
      {
        label: "車系",
        value: "M3",
      },
      {
        label: "定位",
        value: "Performance",
      },
    ],
  },


  // =====================================================
  // 28 Porsche 911
  // =====================================================

  {
    id: "porsche-911",

    name: "Porsche 911 Carrera",

    brand: "Porsche",

    category: "汽車",

    price: 5680000,

    oldPrice: 5980000,

    sold: 73,

    stock: 1,

    rating: 4.9,

    reviewCount: 48,

    tag: "跑車",

    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90",
    ],

    description:
      "經典跑車展示商品，呈現高性能跑車的產品資訊。",

    specs: [
      {
        label: "品牌",
        value: "Porsche",
      },
      {
        label: "車系",
        value: "911 Carrera",
      },
      {
        label: "類型",
        value: "跑車",
      },
    ],
  },


  // =====================================================
  // 29 DJI
  // =====================================================

  {
    id: "dji-drone",

    name: "DJI 旗艦空拍機",

    brand: "DJI",

    category: "相機",

    price: 45900,

    oldPrice: 49900,

    sold: 2871,

    stock: 13,

    rating: 4.8,

    reviewCount: 917,

    tag: "空拍",

    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=90",
    ],

    description:
      "高階空拍機展示商品，適合航拍與影像創作。",

    specs: [
      {
        label: "品牌",
        value: "DJI",
      },
      {
        label: "類型",
        value: "空拍機",
      },
      {
        label: "用途",
        value: "航拍 / 影像",
      },
    ],
  },


  // =====================================================
  // 30 PS5 Pro 組合
  // =====================================================

  {
    id: "ps5-pro-bundle",

    name: "PS5 Pro 遊戲組合包",

    brand: "PlayStation",

    category: "電玩",

    price: 28900,

    oldPrice: 32900,

    sold: 3921,

    stock: 17,

    rating: 4.9,

    reviewCount: 1642,

    tag: "組合",

    image:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=90",

    images: [
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=90",
    ],

    description:
      "PlayStation 遊戲主機組合展示商品。",

    specs: [
      {
        label: "品牌",
        value: "PlayStation",
      },
      {
        label: "類型",
        value: "遊戲主機組合",
      },
    ],
  },

];


export function getProductById(
  id: string
) {
  return products.find(
    (product) =>
      product.id === id
  );
}