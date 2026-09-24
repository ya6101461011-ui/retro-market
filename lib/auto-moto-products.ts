import type { Product } from "./products";

export const autoMotoProducts: Product[] = [
  {
    id: "toyota-rav4-hybrid", name: "Toyota RAV4 Hybrid", brand: "Toyota", category: "汽車", price: 1098000, oldPrice: 1168000, sold: 218, stock: 6, rating: 4.8, reviewCount: 126, tag: "熱門",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200&q=90", images: ["https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200&q=90"], description: "休旅車展示商品，適合城市與家庭使用。", specs: [{label:"品牌",value:"Toyota"},{label:"車型",value:"RAV4 Hybrid"},{label:"能源",value:"Hybrid"}]
  },
  {
    id: "honda-civic-type-r", name: "Honda Civic Type R", brand: "Honda", category: "汽車", price: 2198000, oldPrice: 2298000, sold: 94, stock: 3, rating: 4.9, reviewCount: 82, tag: "性能",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90", images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90"], description: "高性能掀背車展示商品。", specs: [{label:"品牌",value:"Honda"},{label:"車系",value:"Civic Type R"},{label:"定位",value:"Performance"}]
  },
  {
    id: "mercedes-amg-gt", name: "Mercedes-AMG GT", brand: "Mercedes-Benz", category: "汽車", price: 6480000, oldPrice: 6880000, sold: 31, stock: 2, rating: 4.9, reviewCount: 29, tag: "旗艦",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=90", images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=90"], description: "豪華性能跑車展示商品。", specs: [{label:"品牌",value:"Mercedes-Benz"},{label:"車系",value:"AMG GT"},{label:"定位",value:"Luxury Performance"}]
  },
  {
    id: "audi-rs6-avant", name: "Audi RS 6 Avant", brand: "Audi", category: "汽車", price: 5480000, oldPrice: 5780000, sold: 42, stock: 2, rating: 4.9, reviewCount: 35, tag: "性能",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90", images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90"], description: "高性能旅行車展示商品。", specs: [{label:"品牌",value:"Audi"},{label:"車系",value:"RS 6 Avant"}]
  },
  {
    id: "lexus-rx", name: "Lexus RX", brand: "Lexus", category: "汽車", price: 2590000, oldPrice: 2690000, sold: 117, stock: 5, rating: 4.8, reviewCount: 64, tag: "豪華",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90", images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90"], description: "豪華休旅車展示商品。", specs: [{label:"品牌",value:"Lexus"},{label:"車系",value:"RX"}]
  },
  {
    id: "ford-mustang", name: "Ford Mustang GT", brand: "Ford", category: "汽車", price: 2380000, oldPrice: 2480000, sold: 76, stock: 4, rating: 4.8, reviewCount: 51, tag: "跑車",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=90", images: ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=90"], description: "經典美式性能跑車展示商品。", specs: [{label:"品牌",value:"Ford"},{label:"車系",value:"Mustang GT"}]
  },
  {
    id: "porsche-cayenne", name: "Porsche Cayenne", brand: "Porsche", category: "汽車", price: 3980000, oldPrice: 4180000, sold: 51, stock: 3, rating: 4.9, reviewCount: 44, tag: "豪華",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=90", images: ["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=90"], description: "豪華性能休旅車展示商品。", specs: [{label:"品牌",value:"Porsche"},{label:"車系",value:"Cayenne"}]
  },
  {
    id: "yamaha-mt09", name: "Yamaha MT-09", brand: "Yamaha", category: "機車", price: 438000, oldPrice: 468000, sold: 183, stock: 7, rating: 4.8, reviewCount: 91, tag: "熱門",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=90", images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=90"], description: "街車展示商品，適合日常與休閒騎乘。", specs: [{label:"品牌",value:"Yamaha"},{label:"車系",value:"MT-09"}]
  },
  {
    id: "kawasaki-ninja-400", name: "Kawasaki Ninja 400", brand: "Kawasaki", category: "機車", price: 298000, oldPrice: 318000, sold: 241, stock: 9, rating: 4.8, reviewCount: 113, tag: "跑車",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=90", images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=90"], description: "輕量級跑車展示商品。", specs: [{label:"品牌",value:"Kawasaki"},{label:"車系",value:"Ninja 400"}]
  },
  {
    id: "honda-cbr650r", name: "Honda CBR650R", brand: "Honda", category: "機車", price: 468000, oldPrice: 498000, sold: 132, stock: 6, rating: 4.8, reviewCount: 76, tag: "跑車",
    image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=1200&q=90", images: ["https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=1200&q=90"], description: "中量級跑車展示商品。", specs: [{label:"品牌",value:"Honda"},{label:"車系",value:"CBR650R"}]
  },
  {
    id: "vespa-gts", name: "Vespa GTS", brand: "Vespa", category: "機車", price: 328000, oldPrice: 348000, sold: 209, stock: 8, rating: 4.7, reviewCount: 88, tag: "經典",
    image: "https://images.unsplash.com/photo-1525160354320-d8e92641c563?w=1200&q=90", images: ["https://images.unsplash.com/photo-1525160354320-d8e92641c563?w=1200&q=90"], description: "經典義式速克達展示商品。", specs: [{label:"品牌",value:"Vespa"},{label:"車系",value:"GTS"}]
  },
  {
    id: "bmw-r1300gs", name: "BMW R 1300 GS", brand: "BMW Motorrad", category: "機車", price: 1180000, oldPrice: 1250000, sold: 48, stock: 3, rating: 4.9, reviewCount: 39, tag: "重機",
    image: "https://images.unsplash.com/photo-1558980664-10ea4b3e9f3d?w=1200&q=90", images: ["https://images.unsplash.com/photo-1558980664-10ea4b3e9f3d?w=1200&q=90"], description: "大型冒險重機展示商品。", specs: [{label:"品牌",value:"BMW Motorrad"},{label:"車系",value:"R 1300 GS"}]
  },
  {
    id: "ktm-890-duke", name: "KTM 890 Duke R", brand: "KTM", category: "機車", price: 698000, oldPrice: 728000, sold: 67, stock: 4, rating: 4.8, reviewCount: 42, tag: "性能",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=90", images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=90"], description: "高性能街車展示商品。", specs: [{label:"品牌",value:"KTM"},{label:"車系",value:"890 Duke R"}]
  },
  {
    id: "agv-pista-helmet", name: "AGV Pista GP RR 安全帽", brand: "AGV", category: "汽機車用品", price: 39800, oldPrice: 42800, sold: 314, stock: 11, rating: 4.9, reviewCount: 156, tag: "重機",
    image: "https://images.unsplash.com/photo-1558980394-0f31c8d3c3a7?w=1200&q=90", images: ["https://images.unsplash.com/photo-1558980394-0f31c8d3c3a7?w=1200&q=90"], description: "重機安全帽展示商品。", specs: [{label:"品牌",value:"AGV"},{label:"類型",value:"全罩式安全帽"}]
  },
  {
    id: "quadlock-phone-mount", name: "Quad Lock 機車手機支架", brand: "Quad Lock", category: "汽機車用品", price: 1990, oldPrice: 2290, sold: 1288, stock: 24, rating: 4.8, reviewCount: 387, tag: "熱賣",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=90", images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=90"], description: "機車手機固定配件展示商品。", specs: [{label:"品牌",value:"Quad Lock"},{label:"用途",value:"手機固定"}]
  },
  {
    id: "thule-roof-box", name: "Thule 車頂行李箱", brand: "Thule", category: "汽機車用品", price: 39800, oldPrice: 43800, sold: 178, stock: 7, rating: 4.8, reviewCount: 82, tag: "旅行",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90", images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90"], description: "車用戶外旅行配件展示商品。", specs: [{label:"品牌",value:"Thule"},{label:"類型",value:"車頂行李箱"}]
  },
];
