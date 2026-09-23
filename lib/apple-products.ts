import type { Product } from "./products";

const img = {
  phone: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=90",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=90",
  laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=90",
  desktop: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=90",
  display: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=90",
  watch: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=90",
  audio: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=90",
  vision: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=1200&q=90",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=90",
  accessory: "https://images.unsplash.com/photo-1603539947678-cd3954ed515e?w=1200&q=90",
};

function product(
  id: string,
  name: string,
  category: string,
  price: number,
  image: string,
  tag = "Apple",
  options?: Product["options"],
): Product {
  const oldPrice = Math.round((price * 1.14) / 100) * 100;
  return {
    id,
    name,
    brand: "Apple",
    category,
    price,
    oldPrice,
    sold: 1200 + id.length * 317,
    stock: 8 + (id.length % 28),
    rating: 4.8,
    reviewCount: 280 + id.length * 41,
    tag,
    image,
    images: [image],
    description: `${name}。RETROMART 虛擬展示商品；機型、產品線與起售價格依 Apple 台灣官方網站目前資料整理。`,
    specs: [
      { label: "品牌", value: "Apple" },
      { label: "產品", value: name },
      { label: "用途", value: "Apple 生態系產品" },
    ],
    options,
  };
}

export const appleProducts: Product[] = [
  // iPhone — Apple 台灣目前產品線
  product("apple-iphone-duo", "iPhone Duo", "手機", 74900, img.phone, "NEW", [
    { name: "容量", values: ["256GB", "512GB", "1TB"] },
    { name: "顏色", values: ["夜空色", "星光白色"] },
  ]),
  product("apple-iphone-18-pro", "iPhone 18 Pro", "手機", 44900, img.phone, "NEW", [
    { name: "容量", values: ["256GB", "512GB", "1TB", "2TB"] },
    { name: "顏色", values: ["勃根地紅色", "冰川藍色", "銀色", "黑色"] },
  ]),
  product("apple-iphone-18-pro-max", "iPhone 18 Pro Max", "手機", 49900, img.phone, "旗艦", [
    { name: "容量", values: ["256GB", "512GB", "1TB", "2TB"] },
    { name: "顏色", values: ["勃根地紅色", "冰川藍色", "銀色", "黑色"] },
  ]),
  product("apple-iphone-air", "iPhone Air", "手機", 39900, img.phone, "NEW", [
    { name: "容量", values: ["256GB", "512GB", "1TB"] },
    { name: "顏色", values: ["天藍色", "淺金色", "雲白色", "太空黑色"] },
  ]),
  product("apple-iphone-17", "iPhone 17", "手機", 32900, img.phone, "熱門", [
    { name: "容量", values: ["256GB", "512GB"] },
    { name: "顏色", values: ["霧藍色", "薰衣草紫色", "黑色", "白色", "鼠尾草綠色"] },
  ]),
  product("apple-iphone-17e", "iPhone 17e", "手機", 25900, img.phone, "超值", [
    { name: "容量", values: ["256GB", "512GB"] },
    { name: "顏色", values: ["黑色", "白色"] },
  ]),
  product("apple-iphone-16", "iPhone 16", "手機", 29900, img.phone, "熱門", [
    { name: "容量", values: ["128GB", "256GB", "512GB"] },
    { name: "顏色", values: ["黑色", "白色", "粉紅色", "藍色", "湖水綠色"] },
  ]),

  // iPad — 11 / 13 吋完整產品線
  product("apple-ipad-pro-11-m5", "11 吋 iPad Pro (M5)", "平板", 39900, img.tablet, "旗艦", [
    { name: "容量", values: ["256GB", "512GB", "1TB", "2TB"] },
    { name: "連線", values: ["Wi-Fi", "Wi-Fi + 行動網路"] },
    { name: "顏色", values: ["太空黑色", "銀色"] },
  ]),
  product("apple-ipad-pro-13-m5", "13 吋 iPad Pro (M5)", "平板", 54900, img.tablet, "旗艦", [
    { name: "容量", values: ["256GB", "512GB", "1TB", "2TB"] },
    { name: "連線", values: ["Wi-Fi", "Wi-Fi + 行動網路"] },
    { name: "顏色", values: ["太空黑色", "銀色"] },
  ]),
  product("apple-ipad-air-11-m4", "11 吋 iPad Air (M4)", "平板", 19900, img.tablet, "NEW", [
    { name: "容量", values: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "連線", values: ["Wi-Fi", "Wi-Fi + 行動網路"] },
    { name: "顏色", values: ["藍色", "紫色", "星光色", "太空灰色"] },
  ]),
  product("apple-ipad-air-13-m4", "13 吋 iPad Air (M4)", "平板", 26900, img.tablet, "NEW", [
    { name: "容量", values: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "連線", values: ["Wi-Fi", "Wi-Fi + 行動網路"] },
    { name: "顏色", values: ["藍色", "紫色", "星光色", "太空灰色"] },
  ]),
  product("apple-ipad-a16", "iPad 11 吋 (A16)", "平板", 14900, img.tablet, "熱門", [
    { name: "容量", values: ["128GB", "256GB", "512GB"] },
    { name: "連線", values: ["Wi-Fi", "Wi-Fi + 行動網路"] },
    { name: "顏色", values: ["藍色", "粉紅色", "黃色", "銀色"] },
  ]),
  product("apple-ipad-mini-a17-pro", "iPad mini (A17 Pro)", "平板", 19900, img.tablet, "熱門", [
    { name: "容量", values: ["128GB", "256GB", "512GB"] },
    { name: "連線", values: ["Wi-Fi", "Wi-Fi + 行動網路"] },
    { name: "顏色", values: ["太空灰色", "藍色", "紫色", "星光色"] },
  ]),

  // Mac — MacBook Neo / Air / Pro / 桌上型 Mac / 顯示器
  product("apple-macbook-neo", "MacBook Neo", "筆電", 22900, img.laptop, "NEW", [
    { name: "顏色", values: ["銀色", "胭粉色", "青橘黃色", "靛青色"] },
    { name: "儲存", values: ["256GB", "512GB"] },
  ]),
  product("apple-macbook-air-13-m5", "MacBook Air 13 吋 (M5)", "筆電", 42900, img.laptop, "熱門", [
    { name: "顏色", values: ["天藍色", "銀色", "星光色", "午夜色"] },
    { name: "儲存", values: ["512GB", "1TB", "2TB", "4TB"] },
  ]),
  product("apple-macbook-air-15-m5", "MacBook Air 15 吋 (M5)", "筆電", 49900, img.laptop, "熱門", [
    { name: "顏色", values: ["天藍色", "銀色", "星光色", "午夜色"] },
    { name: "儲存", values: ["512GB", "1TB", "2TB", "4TB"] },
  ]),
  product("apple-macbook-pro-14-m5", "MacBook Pro 14 吋", "筆電", 64900, img.laptop, "旗艦", [
    { name: "晶片", values: ["M5", "M5 Pro", "M5 Max"] },
    { name: "顏色", values: ["太空黑色", "銀色"] },
    { name: "儲存", values: ["512GB", "1TB", "2TB", "4TB"] },
  ]),
  product("apple-macbook-pro-16-m5", "MacBook Pro 16 吋", "筆電", 99900, img.laptop, "旗艦", [
    { name: "晶片", values: ["M5 Pro", "M5 Max"] },
    { name: "顏色", values: ["太空黑色", "銀色"] },
    { name: "儲存", values: ["512GB", "1TB", "2TB", "4TB", "8TB"] },
  ]),
  product("apple-imac-24", "iMac 24 吋", "電腦", 49900, img.desktop, "熱門", [
    { name: "顏色", values: ["藍色", "紫色", "粉紅色", "橙色", "黃色", "綠色", "銀色"] },
    { name: "儲存", values: ["256GB", "512GB", "1TB"] },
  ]),
  product("apple-mac-mini", "Mac mini", "電腦", 29900, img.desktop, "NEW", [
    { name: "晶片", values: ["M6", "M5 Pro"] },
    { name: "記憶體", values: ["16GB", "24GB", "32GB", "64GB"] },
    { name: "儲存", values: ["256GB", "512GB", "1TB"] },
  ]),
  product("apple-mac-studio", "Mac Studio", "電腦", 84900, img.desktop, "NEW", [
    { name: "晶片", values: ["M5 Max", "M5 Ultra"] },
    { name: "記憶體", values: ["64GB", "128GB", "256GB"] },
  ]),
  product("apple-mac-pro", "Mac Pro", "電腦", 229900, img.desktop, "頂級", [
    { name: "晶片", values: ["Apple Silicon"] },
    { name: "儲存", values: ["1TB", "2TB", "4TB", "8TB"] },
  ]),
  product("apple-studio-display", "Studio Display", "顯示器", 52900, img.display, "熱門", [
    { name: "玻璃", values: ["標準玻璃", "奈米紋理玻璃"] },
    { name: "支架", values: ["可調整斜度", "可調整斜度與高度", "VESA"] },
  ]),
  product("apple-studio-display-xdr", "Studio Display XDR", "顯示器", 109900, img.display, "頂級", [
    { name: "玻璃", values: ["標準玻璃", "奈米紋理玻璃"] },
    { name: "支架", values: ["可調整斜度與高度", "VESA"] },
  ]),

  // Apple Watch
  product("apple-watch-series-11", "Apple Watch Series 11", "智慧手錶", 12900, img.watch, "NEW", [
    { name: "尺寸", values: ["42 公釐", "46 公釐"] },
    { name: "材質", values: ["鋁金屬", "鈦金屬"] },
    { name: "連線", values: ["GPS", "GPS + 行動網路"] },
  ]),
  product("apple-watch-ultra-3", "Apple Watch Ultra 3", "智慧手錶", 26900, img.watch, "旗艦", [
    { name: "顏色", values: ["原色鈦金屬", "黑色鈦金屬"] },
    { name: "連線", values: ["GPS + 行動網路"] },
  ]),
  product("apple-watch-se-3", "Apple Watch SE 3", "智慧手錶", 7900, img.watch, "超值", [
    { name: "尺寸", values: ["40 公釐", "44 公釐"] },
    { name: "連線", values: ["GPS", "GPS + 行動網路"] },
  ]),

  // AirPods / Vision Pro / TV / HomePod
  product("apple-airpods-5", "AirPods 5", "耳機", 4490, img.audio, "NEW"),
  product("apple-airpods-5-wireless", "AirPods 5 配備無線充電盒", "耳機", 5190, img.audio, "熱門"),
  product("apple-airpods-pro-3", "AirPods Pro 3", "耳機", 7490, img.audio, "旗艦"),
  product("apple-airpods-max-2", "AirPods Max 2", "耳機", 17990, img.audio, "旗艦", [
    { name: "顏色", values: ["午夜色", "星光色", "藍色", "紫色", "橙色"] },
  ]),
  product("apple-vision-pro", "Apple Vision Pro", "精品", 119900, img.vision, "頂級", [
    { name: "儲存", values: ["256GB", "512GB", "1TB"] },
  ]),
  product("apple-tv-4k-wifi", "Apple TV 4K Wi-Fi", "家電", 4490, img.tv, "熱門", [
    { name: "容量", values: ["64GB"] },
  ]),
  product("apple-tv-4k-ethernet", "Apple TV 4K Wi-Fi + Ethernet", "家電", 4990, img.tv, "熱門", [
    { name: "容量", values: ["128GB"] },
  ]),
  product("apple-homepod", "HomePod", "音響", 9490, img.audio, "熱門"),
  product("apple-homepod-mini", "HomePod mini", "音響", 2990, img.audio, "超值"),

  // Apple 配件
  product("apple-airtag", "AirTag", "配件", 990, img.accessory, "熱門"),
  product("apple-airtag-4-pack", "AirTag 4 件裝", "配件", 3290, img.accessory, "超值"),
  product("apple-pencil-pro", "Apple Pencil Pro", "配件", 4290, img.accessory, "熱門"),
  product("apple-pencil-usbc", "Apple Pencil (USB-C)", "配件", 2690, img.accessory, "熱門"),
  product("apple-magic-keyboard", "Magic Keyboard", "配件", 5290, img.accessory, "熱門"),
  product("apple-magic-mouse", "Magic Mouse (USB-C)", "配件", 2290, img.accessory, "熱門"),
  product("apple-magic-trackpad", "Magic Trackpad (USB-C)", "配件", 3790, img.accessory, "熱門"),
  product("apple-140w-usbc-adapter", "140W USB-C 電源轉接器", "配件", 2990, img.accessory, "熱門"),
  product("apple-35w-dual-usbc", "35W 雙 USB-C 埠電源轉接器", "配件", 1990, img.accessory, "熱門"),
];
