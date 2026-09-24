"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { products } from "../lib/products";
import { addToCart, getCartCount, getCartProducts } from "../lib/cart";

type Product = (typeof products)[number];

const categories = [
  "全部", "手機", "平板", "筆電", "電腦", "顯示器", "顯卡", "電視", "電玩", "相機", "空拍機",
  "音響", "耳機", "家電", "冷氣", "智慧手錶", "精品", "服飾", "球鞋", "名錶", "汽車", "機車", "汽機車用品", "美妝", "保養", "香水",
];

const categoryToParam: Record<string, string> = {
  全部: "all", 手機: "phone", 平板: "tablet", 筆電: "laptop", 電腦: "computer", 顯示器: "display", 顯卡: "gpu",
  電視: "tv", 電玩: "gaming", 相機: "camera", 空拍機: "drone", 音響: "speaker", 耳機: "headphones", 家電: "home-appliance",
  冷氣: "air-conditioner", 智慧手錶: "smartwatch", 精品: "luxury", 服飾: "fashion", 球鞋: "sneakers", 名錶: "watch", 汽車: "car", 機車: "motorcycle", "汽機車用品": "auto-moto", 美妝: "beauty", 保養: "skincare", 香水: "fragrance",
};
const paramToCategory = Object.fromEntries(Object.entries(categoryToParam).map(([name, param]) => [param, name]));

const appleFallbacks: Record<string, string> = {
  phone: "https://www.apple.com/tw/iphone-17/images/overview/welcome/hero_startframe__e9e7pcnguyqi_xlarge.webp",
  tablet: "https://www.apple.com/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large.png",
  laptop: "https://www.apple.com/v/macbook-neo/b/images/overview/welcome/hero_endframe__c62q483im5si_xlarge.jpg",
};

function money(value: number) { return new Intl.NumberFormat("zh-TW").format(value); }
function displayCategory(product: Product) {
  if (product.id === "apple-watch-ultra" || product.category === "智慧手錶") return "智慧手錶";
  if (product.id === "dji-drone") return "空拍機";
  return product.category;
}

function imageCandidates(product: Product) {
  const original = product.image;
  const candidates: string[] = [];
  const isApple = product.brand === "Apple";
  if (isApple && /apple\.com/i.test(original)) {
    candidates.push(`https://wsrv.nl/?url=${encodeURIComponent(original)}`);
  }
  candidates.push(original);
  if (isApple) {
    const fallback = appleFallbacks[displayCategory(product) === "手機" ? "phone" : displayCategory(product) === "平板" ? "tablet" : displayCategory(product) === "筆電" ? "laptop" : ""];
    if (fallback) candidates.push(fallback);
  }
  return [...new Set(candidates)];
}

function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const candidates = useMemo(() => imageCandidates(product), [product]);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [product.id]);
  const src = candidates[index];
  if (!src) return <div className={`${className} imageMissing`}>{product.name}</div>;
  return (
    <img
      className={className}
      src={src}
      alt={product.name}
      loading="lazy"
      onError={() => setIndex((value) => value + 1)}
    />
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [toast, setToast] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [seconds, setSeconds] = useState(323);

  const syncCart = () => {
    setCartCount(getCartCount());
    setCartTotal(getCartProducts().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    setSelectedCategory(category ? (paramToCategory[category] ?? "全部") : "全部");
    setSearch(params.get("search") ?? "");
    syncCart();
    const onCart = () => syncCart();
    window.addEventListener("cart-updated", onCart);
    window.addEventListener("storage", onCart);
    return () => { window.removeEventListener("cart-updated", onCart); window.removeEventListener("storage", onCart); };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((v) => v <= 1 ? 323 : v - 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateUrl = (category: string, keyword: string) => {
    const params = new URLSearchParams();
    if (category !== "全部") params.set("category", categoryToParam[category] ?? category);
    if (keyword.trim()) params.set("search", keyword.trim());
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/?${query}` : "/");
  };

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((product) => {
      if (selectedCategory !== "全部" && displayCategory(product) !== selectedCategory) return false;
      if (!keyword) return true;
      return `${product.name} ${product.brand} ${product.category} ${displayCategory(product)}`.toLowerCase().includes(keyword);
    });
  }, [selectedCategory, search]);

  const suggestions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return [];
    return products.filter((product) => `${product.name} ${product.brand} ${displayCategory(product)}`.toLowerCase().includes(keyword)).slice(0, 6);
  }, [search]);

  const addProduct = (product: Product) => {
    if (addToCart(product)) {
      syncCart();
      setToast(`✓ 已加入 ${product.name}`);
    } else {
      setToast(product.stock > 0 ? "已達此商品庫存上限" : "此商品目前缺貨");
    }
  };

  const clearCart = () => {
    window.localStorage.removeItem("retro-market-cart");
    window.dispatchEvent(new Event("cart-updated"));
    syncCart();
    setToast("🧹 購物車已清空");
  };

  const timeText = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <main className="site">
      <div className="announcement">🔥 RETROMART 虛擬購物狂歡　｜　每一次點擊都不會真的刷卡</div>
      {toast && <div className="actionToast">{toast}</div>}

      <header className="header">
        <Link href="/" className="logoArea"><div className="logo">RETROMART</div><div className="logoSub">EVERYTHING YOU WANT</div></Link>
        <div className="searchWrap">
          <label className="searchBox">
            <span>🔎</span>
            <input value={search} onFocus={() => setSuggestionsOpen(true)} onChange={(e) => { setSearch(e.target.value); updateUrl(selectedCategory, e.target.value); setSuggestionsOpen(true); }} placeholder="搜尋手機、電視、顯卡、精品、汽車..." />
            {search && <button type="button" className="clearSearch" onClick={() => { setSearch(""); updateUrl(selectedCategory, ""); setSuggestionsOpen(false); }}>×</button>}
          </label>
          {suggestionsOpen && suggestions.length > 0 && <div className="suggestions">{suggestions.map((product) => <Link key={product.id} href={`/product/${product.id}`} className="suggestion" onClick={() => setSuggestionsOpen(false)}><ProductImage product={product} /><span><strong>{product.name}</strong><small>{product.brand} · {displayCategory(product)}</small></span><b>NT${money(product.price)}</b></Link>)}</div>}
        </div>
        <Link href="/cart" className="cartButton">🛒 購物車 <b>{cartCount}</b>{cartTotal > 0 && <small>NT${money(cartTotal)}</small>}</Link>
      </header>

      <section className="hero">
        <div><div className="eyebrow">THE INTERNET&apos;S SHOPPING PLAYGROUND</div><h1>你想買的<br /><span>這裡都有。</span></h1><p>從最新手機、電玩、顯卡，到精品、名錶、汽車。<br />找一些你原本不知道自己想要的東西。</p><button className="heroButton" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>開始逛逛 →</button></div>
        <div className="heroVisual"><div>📱</div><div>💻</div><div>⌚</div><div>🎧</div></div>
      </section>

      <section className="categorySection"><div className="sectionHeader"><div><div className="smallTitle">EXPLORE</div><h2>探索分類</h2></div><span>{filteredProducts.length} 個商品</span></div><div className="categoryList">{categories.map((category) => <button key={category} type="button" className={selectedCategory === category ? "category active" : "category"} onClick={() => { setSelectedCategory(category); updateUrl(category, search); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>{category}</button>)}</div></section>

      <section id="products" className="productsSection"><div className="sectionHeader"><div><div className="smallTitle">TRENDING NOW</div><h2>{selectedCategory === "全部" ? "最近熱門" : selectedCategory}</h2></div></div>
        {filteredProducts.length === 0 ? <div className="empty">找不到符合的商品</div> : <div className="productGrid">{filteredProducts.map((product) => {
          const discount = Math.max(0, Math.round((1 - product.price / product.oldPrice) * 100));
          const saving = Math.max(0, product.oldPrice - product.price);
          return <article key={product.id} className="productCard">
            <Link href={`/product/${product.id}`} className="productLink">
              <div className="imageArea"><ProductImage product={product} /><div className="badges"><span className="tag">{product.tag}</span>{discount > 0 && <span className="discount">-{discount}%</span>}</div><span className="viewers">👀 {8 + (product.sold % 23)} 人觀看</span></div>
              <div className="productInfo"><div className="brand">{product.brand}</div><h3>{product.name}</h3><div className="productCategory">{displayCategory(product)}</div><div className="price"><strong>NT${money(product.price)}</strong><span>NT${money(product.oldPrice)}</span></div>{saving > 0 && <div className="saving">💰 立省 NT${money(saving)}</div>}<div className="sold">🔥 已售 {money(product.sold)} 件</div><div className="urgency"><span>⚡ 限時 {timeText}</span><span>{product.stock <= 5 ? `剩餘 ${product.stock} 件` : "🔥 熱門搶購中"}</span></div><div className="stockBar"><i style={{ width: `${Math.min(92, Math.max(18, 100 - product.stock / 2))}%` }} /></div></div>
            </Link>
            <button type="button" className="addCart" onClick={() => addProduct(product)} disabled={product.stock <= 0}>{product.stock > 0 ? "＋ 加入購物車" : "暫時缺貨"}</button>
          </article>;
        })}</div>}
      </section>

      <section className="comfortSection"><div><div className="smallTitle">ZERO RISK SHOPPING</div><h2>想買就買，反正不會真的刷卡。</h2><p>這裡是 RETROMART 的虛擬購物遊樂場。</p></div><div className="comfortActions"><Link href="/cart">查看購物車 →</Link><button type="button" onClick={clearCart}>🧹 全部重來</button></div></section>
      <footer className="footer"><div><div className="footerLogo">RETROMART</div><p>EVERYTHING YOU WANT.</p></div><p>本網站為虛擬購物體驗。商品、價格、庫存與評論僅供展示，不會產生真實付款或配送。</p></footer>

      <style jsx>{`
        *{box-sizing:border-box}.site{min-height:100vh;background:#f5f5f3;color:#111;font-family:Arial,"Noto Sans TC","Microsoft JhengHei",sans-serif}.announcement{background:#111;color:#fff;text-align:center;padding:10px;font-size:12px}.header{height:82px;padding:0 5%;background:#fff;border-bottom:1px solid #ddd;display:flex;align-items:center;gap:25px;position:sticky;top:0;z-index:50}.logoArea{min-width:210px;color:#111;text-decoration:none}.logo{font-size:25px;font-weight:900}.logoSub{font-size:9px;letter-spacing:2px;color:#999}.searchWrap{position:relative;flex:1;max-width:680px;margin:auto}.searchBox{height:46px;display:flex;align-items:center;gap:9px;padding:0 15px;background:#f5f5f5;border:1px solid #ddd;border-radius:30px}.searchBox input{width:100%;border:0;outline:0;background:transparent;font-size:14px}.clearSearch{border:0;background:none;font-size:22px}.suggestions{position:absolute;top:54px;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:14px;box-shadow:0 18px 45px rgba(0,0,0,.14);overflow:hidden;z-index:100}.suggestion{display:grid;grid-template-columns:55px 1fr auto;gap:12px;align-items:center;padding:10px 13px;color:#111;text-decoration:none}.suggestion img{width:55px;height:55px;object-fit:contain;background:#f5f5f5;border-radius:8px}.suggestion strong,.suggestion small{display:block}.suggestion small{color:#888;margin-top:3px}.cartButton{padding:12px 15px;background:#111;color:#fff;border-radius:9px;text-decoration:none;font-weight:800;white-space:nowrap}.cartButton b{background:#fff;color:#111;border-radius:20px;padding:2px 7px}.cartButton small{color:#bbb;margin-left:5px}.actionToast{position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:200;background:#fff;border:1px solid #ddd;box-shadow:0 15px 40px rgba(0,0,0,.18);padding:13px 20px;border-radius:12px;font-weight:700}.hero{min-height:500px;padding:70px 8%;display:grid;grid-template-columns:1fr 1fr;align-items:center;background:radial-gradient(circle at 75% 40%,#ddd,#f5f5f3 45%)}.eyebrow,.smallTitle{color:#999;font-size:10px;letter-spacing:2px}.hero h1{margin:18px 0;font-size:clamp(55px,7vw,90px);line-height:.95;letter-spacing:-5px}.hero h1 span{color:#888}.hero p{color:#555;line-height:1.8}.heroButton{padding:14px 22px;border:0;border-radius:8px;background:#111;color:#fff;font-weight:800;cursor:pointer}.heroVisual{height:330px;position:relative}.heroVisual div{position:absolute;width:150px;height:190px;background:#fff;border-radius:18px;box-shadow:0 25px 55px rgba(0,0,0,.12);display:grid;place-items:center;font-size:70px}.heroVisual div:nth-child(1){left:20%;top:15%;transform:rotate(-9deg)}.heroVisual div:nth-child(2){right:12%;top:3%;transform:rotate(10deg)}.heroVisual div:nth-child(3){left:40%;bottom:0;transform:rotate(5deg)}.heroVisual div:nth-child(4){right:1%;bottom:3%;transform:rotate(-7deg)}.categorySection,.productsSection{max-width:1300px;margin:auto;padding:55px 30px}.sectionHeader{display:flex;justify-content:space-between;align-items:end;gap:20px}.sectionHeader h2{margin:7px 0 20px;font-size:32px}.categoryList{display:flex;gap:8px;overflow-x:auto;padding:4px 0 10px}.category{flex:0 0 auto;border:1px solid #ddd;background:#fff;border-radius:999px;padding:10px 16px;cursor:pointer}.category.active{background:#111;color:#fff;border-color:#111}.productGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.productCard{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 3px 15px rgba(0,0,0,.03);transition:.2s}.productCard:hover{transform:translateY(-4px);box-shadow:0 15px 35px rgba(0,0,0,.1)}.productLink{display:block;color:inherit;text-decoration:none}.imageArea{height:255px;background:#f7f7f7;position:relative;overflow:hidden}.imageArea img{width:100%;height:100%;object-fit:contain;display:block}.imageMissing{display:grid;place-items:center;height:100%;padding:25px;text-align:center;color:#999;font-weight:700}.badges{position:absolute;top:14px;left:14px;right:14px;display:flex;justify-content:space-between}.tag,.discount,.viewers{border-radius:5px;font-size:10px;font-weight:800;padding:6px 8px}.tag{background:#111;color:#fff}.discount{background:#e11d48;color:#fff}.viewers{position:absolute;bottom:12px;right:12px;background:rgba(255,255,255,.92);color:#444}.productInfo{padding:16px}.brand,.productCategory{color:#999;font-size:10px;letter-spacing:1px}.productInfo h3{margin:7px 0;font-size:16px;line-height:1.4}.productCategory{display:inline-block;background:#f1f1ef;border-radius:4px;padding:4px 6px;letter-spacing:0}.price{display:flex;align-items:baseline;gap:8px;margin-top:13px}.price strong{font-size:24px;font-weight:900}.price span{text-decoration:line-through;color:#aaa;font-size:11px}.saving{display:inline-flex;margin-top:7px;padding:5px 8px;background:#f6e85f;border-radius:5px;font-size:11px;font-weight:900}.sold{margin-top:9px;color:#777;font-size:11px}.urgency{display:flex;justify-content:space-between;gap:6px;margin-top:12px;color:#a15a00;font-size:10px}.stockBar{height:4px;background:#eee;border-radius:5px;margin-top:6px;overflow:hidden}.stockBar i{display:block;height:100%;background:#111}.addCart{width:calc(100% - 28px);margin:0 14px 14px;padding:12px;border:1px solid #111;background:#111;color:#fff;border-radius:8px;font-weight:800;cursor:pointer}.addCart:disabled{background:#ddd;border-color:#ddd;color:#888}.comfortSection{max-width:1300px;margin:20px auto 0;padding:40px 30px;border:1px solid #ddd;border-radius:16px;background:#fff;display:flex;justify-content:space-between;gap:30px;align-items:center}.comfortSection h2{margin:8px 0}.comfortSection p,.footer p{color:#777}.comfortActions{display:flex;gap:8px}.comfortActions a,.comfortActions button{padding:12px 15px;border-radius:8px;border:1px solid #111;background:#111;color:#fff;text-decoration:none;font-weight:700;cursor:pointer}.comfortActions button{background:#fff;color:#111}.footer{margin-top:50px;padding:60px 8%;background:#111;color:#fff;display:flex;justify-content:space-between;gap:50px}.footerLogo{font-size:28px;font-weight:900}.footer p{max-width:600px}.empty{padding:70px 20px;background:#fff;text-align:center;border-radius:15px}.imageArea :global(img),.suggestion :global(img){object-fit:contain}@media(max-width:1000px){.productGrid{grid-template-columns:repeat(3,1fr)}.hero{grid-template-columns:1fr}.heroVisual{display:none}}@media(max-width:700px){.header{height:auto;padding:12px 15px;flex-wrap:wrap}.logoArea{min-width:auto}.searchWrap{order:3;flex-basis:100%;max-width:none}.cartButton{margin-left:auto}.hero{padding:55px 20px}.hero h1{font-size:55px}.categorySection,.productsSection{padding:40px 15px}.productGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.imageArea{height:190px}.productInfo{padding:12px}.productInfo h3{font-size:14px}.price strong{font-size:17px}.comfortSection{margin:10px 15px;flex-direction:column;align-items:flex-start}.footer{flex-direction:column;padding:45px 20px}}
      `}</style>
    </main>
  );
}
