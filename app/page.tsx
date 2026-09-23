"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { products } from "../lib/products";
import { addToCart, getCartCount, getCartProducts } from "../lib/cart";

const categories = [
  "全部", "手機", "平板", "筆電", "電腦", "顯示器", "顯卡", "電視", "電玩", "相機", "空拍機",
  "音響", "耳機", "家電", "冷氣", "智慧手錶", "精品", "服飾", "球鞋", "名錶", "汽車",
];

const categoryToParam: Record<string, string> = {
  全部: "all", 手機: "phone", 平板: "tablet", 筆電: "laptop", 電腦: "computer", 顯示器: "display", 顯卡: "gpu", 電視: "tv", 電玩: "gaming",
  相機: "camera", 空拍機: "drone", 音響: "speaker", 耳機: "headphones", 家電: "home-appliance",
  冷氣: "air-conditioner", 智慧手錶: "smartwatch", 精品: "luxury", 服飾: "fashion",
  球鞋: "sneakers", 名錶: "watch", 汽車: "car",
};

const paramToCategory = Object.fromEntries(
  Object.entries(categoryToParam).map(([name, param]) => [param, name])
);

const fallbackImage = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=1000&q=85";

function money(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function displayCategory(product: (typeof products)[number]) {
  if (product.id === "apple-watch-ultra") return "智慧手錶";
  if (product.id === "dji-drone") return "空拍機";
  return product.category;
}

function matchesCategory(product: (typeof products)[number], category: string) {
  return category === "全部" || displayCategory(product) === category;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartPulse, setCartPulse] = useState(false);
  const [toast, setToast] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [purchaseNotice, setPurchaseNotice] = useState("");
  const [seconds, setSeconds] = useState(323);

  const syncCart = () => {
    setCartCount(getCartCount());
    setCartTotal(getCartProducts().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  };

  const updateUrl = (category: string, keyword: string) => {
    const params = new URLSearchParams();
    if (category !== "全部") params.set("category", categoryToParam[category] ?? category);
    if (keyword.trim()) params.set("search", keyword.trim());
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/?${query}` : "/");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search") ?? "";
    const urlCategory = categoryParam ? paramToCategory[categoryParam] ?? "全部" : "全部";
    setSelectedCategory(categories.includes(urlCategory) ? urlCategory : "全部");
    setSearch(searchParam);
    syncCart();

    const onCart = () => syncCart();
    window.addEventListener("cart-updated", onCart);
    window.addEventListener("storage", onCart);
    return () => {
      window.removeEventListener("cart-updated", onCart);
      window.removeEventListener("storage", onCart);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => (value <= 1 ? 323 : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const notices = [
      "來自台北的王先生剛剛加入了 Porsche 911",
      "來自台中的陳小姐剛剛加入了 Apple Watch Ultra",
      "來自高雄的林先生剛剛加入了 Sony BRAVIA",
      "剛剛有使用者收藏了 DJI 旗艦空拍機",
    ];
    let index = 0;
    const timer = window.setInterval(() => {
      setPurchaseNotice(notices[index % notices.length]);
      index += 1;
      window.setTimeout(() => setPurchaseNotice(""), 4200);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    return products.filter((product) => {
      if (!matchesCategory(product, selectedCategory)) return false;
      if (!keyword) return true;
      const category = displayCategory(product).toLowerCase();
      return product.name.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        category.includes(keyword);
    });
  }, [selectedCategory, search]);

  const suggestions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return [];
    return products
      .filter((product) =>
        `${product.name} ${product.brand} ${displayCategory(product)}`.toLowerCase().includes(keyword)
      )
      .slice(0, 5);
  }, [search]);

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    updateUrl(category, search);
    requestAnimationFrame(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateUrl(selectedCategory, value);
    setSuggestionsOpen(true);
  };

  const addProduct = (product: (typeof products)[number]) => {
    const added = addToCart(product);
    syncCart();
    if (added) {
      const saving = Math.max(0, product.oldPrice - product.price);
      setCartPulse(true);
      window.setTimeout(() => setCartPulse(false), 650);
      setToast(`✓ 已成功加入！本次為您省下 NT$${money(saving)}！`);
    } else {
      setToast(product.stock > 0 ? "已達此商品庫存上限" : "此商品目前缺貨");
    }
  };

  const randomBuy = () => {
    const available = products.filter((product) => product.stock > 0);
    const picks = [...available].sort(() => Math.random() - 0.5).slice(0, 5);
    let added = 0;
    picks.forEach((product) => {
      if (addToCart(product)) added += 1;
    });
    syncCart();
    setToast(`🎲 虛擬狂購完成！隨機加入 ${added} 件商品`);
  };

  const clearVirtualCart = () => {
    if (typeof window !== "undefined" && window.confirm("確定要把這次虛擬購物全部重來嗎？")) {
      window.localStorage.removeItem("retro-market-cart");
      window.dispatchEvent(new Event("cart-updated"));
      syncCart();
      setToast("🧹 購物車已清空，重新開始！");
    }
  };

  const timeText = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <main className="site">
      <div className="announcement">🔥 RETROMART 虛擬購物狂歡　｜　每一次點擊都不會真的刷卡</div>

      {purchaseNotice && <div className="purchaseToast" role="status">🛍️ {purchaseNotice}<small>模擬即時活動</small></div>}
      {toast && <div className="actionToast" role="status">{toast}</div>}

      <header className="header">
        <Link href="/" className="logoArea" aria-label="RETROMART 首頁">
          <div className="logo">RETROMART</div>
          <div className="logoSub">EVERYTHING YOU WANT</div>
        </Link>

        <div className="searchWrap">
          <label className="searchBox" aria-label="搜尋商品">
            <span aria-hidden="true">🔎</span>
            <input
              value={search}
              onFocus={() => setSuggestionsOpen(true)}
              onChange={(event) => handleSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setSuggestionsOpen(false);
                if (event.key === "Escape") setSuggestionsOpen(false);
              }}
              placeholder="搜尋手機、電視、顯卡、精品、汽車..."
              type="search"
            />
            {search && <button type="button" className="clearSearch" onClick={() => { handleSearch(""); setSuggestionsOpen(false); }} aria-label="清除搜尋">×</button>}
          </label>
          {suggestionsOpen && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="suggestion"
                  onClick={() => setSuggestionsOpen(false)}
                >
                  <img src={product.image} alt="" />
                  <span><strong>{product.name}</strong><small>{product.brand} · {displayCategory(product)}</small></span>
                  <b>NT${money(product.price)}</b>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/cart" className={cartPulse ? "cartButton cartPulse" : "cartButton"} aria-label={`購物車，共 ${cartCount} 件商品`}>
          🛒 購物車 <b>{cartCount}</b>
          {cartTotal > 0 && <small>NT${money(cartTotal)}</small>}
        </Link>
      </header>

      <section className="hero">
        <div className="heroContent">
          <div className="eyebrow">THE INTERNET&apos;S SHOPPING PLAYGROUND</div>
          <h1>你想買的<br /><span>這裡都有。</span></h1>
          <p>從最新手機、電玩、顯卡，到精品、名錶、汽車。<br />找一些你原本不知道自己想要的東西。</p>
          <div className="heroActions">
            <button className="heroButton" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>開始逛逛 →</button>
            <button className="randomButton" onClick={randomBuy}>🎲 隨機狂購 5 件</button>
          </div>
          <div className="savingLine">💸 今日虛擬使用者已省下 <strong>NT$12,680,000</strong></div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="floatingCard card1">📱</div><div className="floatingCard card2">🎮</div>
          <div className="floatingCard card3">⌚</div><div className="floatingCard card4">🚗</div>
        </div>
      </section>

      <section className="categorySection">
        <div className="sectionHeader"><div><div className="smallTitle">EXPLORE</div><h2>探索分類</h2></div><div className="count" aria-live="polite">{filteredProducts.length} 個商品</div></div>
        <div className="categoryList" role="tablist" aria-label="商品分類">
          {categories.map((category) => <button type="button" key={category} className={selectedCategory === category ? "category active" : "category"} aria-selected={selectedCategory === category} onClick={() => handleCategory(category)}>{category}</button>)}
        </div>
      </section>

      <section id="products" className="productsSection">
        <div className="sectionHeader"><div><div className="smallTitle">TRENDING NOW</div><h2>{selectedCategory === "全部" ? "最近熱門" : selectedCategory}</h2></div></div>
        {filteredProducts.length === 0 ? (
          <div className="empty"><div className="emptyIcon">🔎</div><strong>找不到符合的商品</strong><p>試試其他關鍵字或切換商品分類。</p><button type="button" onClick={() => { setSearch(""); setSelectedCategory("全部"); updateUrl("全部", ""); }}>清除篩選</button></div>
        ) : (
          <div className="productGrid">
            {filteredProducts.map((product) => {
              const discount = Math.max(0, Math.round((1 - product.price / product.oldPrice) * 100));
              const saving = Math.max(0, product.oldPrice - product.price);
              const category = displayCategory(product);
              const viewerCount = 8 + (product.sold % 23);
              return (
                <article key={product.id} className="productCard">
                  <Link href={`/product/${product.id}`} className="productLink">
                    <div className="imageArea">
                      <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { if (event.currentTarget.src !== fallbackImage) event.currentTarget.src = fallbackImage; }} />
                      <div className="badges"><span className="tag">{product.tag}</span>{discount > 0 && <span className="discount">-{discount}%</span>}</div>
                      <span className="viewers">👀 {viewerCount} 人觀看</span>
                    </div>
                    <div className="productInfo">
                      <div className="brand">{product.brand}</div>
                      <h3>{product.name}</h3>
                      <div className="productCategory">{category}</div>
                      <div className="price"><strong>NT${money(product.price)}</strong><span>NT${money(product.oldPrice)}</span></div>
                      {saving > 0 && <div className="saving">💰 立省 NT${money(saving)}</div>}
                      <div className="sold">🔥 已售 {money(product.sold)} 件</div>
                      <div className="urgency"><span>⚡ 限時 {timeText}</span><span>{product.stock <= 5 ? `🔥 剩餘 ${product.stock} 件` : "🔥 熱門搶購中"}</span></div>
                      <div className="stockBar"><i style={{ width: `${Math.min(92, Math.max(18, 100 - product.stock / 2))}%` }} /></div>
                    </div>
                  </Link>
                  <button type="button" className="addCart" disabled={product.stock <= 0} onClick={() => addProduct(product)}>{product.stock > 0 ? "＋ 加入購物車" : "暫時缺貨"}</button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="comfortSection">
        <div><div className="smallTitle">ZERO RISK SHOPPING</div><h2>想買就買，反正不會真的刷卡。</h2><p>這裡是 RETROMART 的虛擬購物遊樂場。你可以瘋狂加購、清空、重新開始。</p></div>
        <div className="comfortActions"><button type="button" onClick={randomBuy}>🎲 隨機加入 5 件</button><button type="button" onClick={clearVirtualCart}>🧹 全部重來</button><Link href="/cart">查看購物車 →</Link></div>
      </section>

      <section className="brandSection">
        <div className="sectionHeader"><div><div className="smallTitle">BRANDS</div><h2>熱門品牌</h2></div></div>
        <div className="brandGrid">
          {["Apple", "Sony", "Samsung", "Nintendo", "PlayStation", "NVIDIA", "ASUS", "JBL", "Bose", "Nike", "Louis Vuitton", "Rolex", "BMW", "Porsche", "Tesla", "Dyson", "Leica", "DJI"].map((brand) => (
            <button type="button" key={brand} className="brandButton" onClick={() => { handleSearch(brand); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>{brand}</button>
          ))}
        </div>
      </section>

      <footer className="footer"><div><div className="footerLogo">RETROMART</div><p>EVERYTHING YOU WANT.</p></div><div className="footerInfo"><strong>虛擬購物體驗</strong><p>本網站為虛擬購物體驗。商品、價格、銷售數字、庫存與評論僅供展示。</p><p>不會產生真實訂單、付款或商品配送。</p></div></footer>

      <style jsx>{`
        *{box-sizing:border-box}.site{min-height:100vh;background:#f5f5f3;color:#111;font-family:Arial,"Noto Sans TC","Microsoft JhengHei",sans-serif}.announcement{background:#111;color:#fff;text-align:center;padding:10px;font-size:12px;letter-spacing:.5px}.header{height:82px;padding:0 5%;background:#fff;border-bottom:1px solid #ddd;display:flex;align-items:center;gap:25px;position:sticky;top:0;z-index:50}.logoArea{min-width:210px;color:#111;text-decoration:none}.logo{font-size:25px;font-weight:900;letter-spacing:-1px}.logoSub{font-size:9px;letter-spacing:2px;color:#999}.searchWrap{position:relative;flex:1;max-width:680px;margin:auto}.searchBox{height:46px;display:flex;align-items:center;gap:9px;padding:0 15px;background:#f5f5f5;border:1px solid #ddd;border-radius:30px}.searchBox input{width:100%;border:0;outline:0;background:transparent;font-size:14px}.clearSearch{border:0;background:transparent;color:#888;font-size:22px;cursor:pointer}.suggestions{position:absolute;top:54px;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:14px;box-shadow:0 18px 45px rgba(0,0,0,.14);overflow:hidden;z-index:100}.suggestion{display:grid;grid-template-columns:45px 1fr auto;gap:12px;align-items:center;padding:10px 13px;color:#111;text-decoration:none}.suggestion:hover{background:#f5f5f3}.suggestion img{width:45px;height:45px;border-radius:7px;object-fit:cover;background:#eee}.suggestion span{min-width:0}.suggestion strong,.suggestion small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.suggestion small{margin-top:3px;color:#888}.suggestion>b{font-size:13px;white-space:nowrap}.cartButton{padding:12px 15px;background:#111;color:#fff;border-radius:9px;text-decoration:none;font-weight:800;white-space:nowrap;display:flex;align-items:center;gap:5px}.cartButton b{background:#fff;color:#111;border-radius:20px;padding:2px 7px}.cartButton small{margin-left:5px;color:#bbb}.purchaseToast,.actionToast{position:fixed;right:22px;z-index:200;background:#111;color:#fff;border-radius:12px;box-shadow:0 15px 40px rgba(0,0,0,.25);padding:13px 17px;font-size:13px;animation:slideIn .3s ease}.purchaseToast{left:22px;bottom:22px;right:auto;animation:toastPop .35s ease}.purchaseToast small{display:block;color:#999;margin-top:4px}.actionToast{top:100px;right:50%;transform:translateX(50%);background:#fff;color:#111;border:1px solid #ddd}@keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes toastPop{0%{opacity:0;transform:translateY(12px) scale(.94)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes cartBounce{0%,100%{transform:scale(1)}35%{transform:scale(1.16) rotate(-2deg)}65%{transform:scale(.96) rotate(2deg)}}.cartPulse{animation:cartBounce .65s ease;transform-origin:center}.hero{min-height:540px;padding:75px 8%;display:grid;grid-template-columns:1fr 1fr;align-items:center;background:radial-gradient(circle at 75% 40%,#ddd,#f5f5f3 45%)}.eyebrow{color:#888;font-size:11px;letter-spacing:2px;margin-bottom:20px}.hero h1{margin:0;font-size:clamp(55px,7vw,90px);line-height:.95;letter-spacing:-5px}.hero h1 span{color:#888}.hero p{color:#555;line-height:1.8;margin-top:28px}.heroActions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.heroButton,.randomButton{padding:14px 21px;border-radius:8px;font-weight:800;cursor:pointer}.heroButton{background:#111;color:#fff;border:1px solid #111}.randomButton{background:#fff;border:1px solid #111}.savingLine{margin-top:18px;color:#777;font-size:12px}.savingLine strong{color:#111}.heroVisual{height:330px;position:relative}.floatingCard{position:absolute;width:150px;height:190px;border-radius:18px;background:#fff;box-shadow:0 25px 55px rgba(0,0,0,.12);display:grid;place-items:center;font-size:70px}.card1{left:20%;top:15%;transform:rotate(-9deg)}.card2{right:12%;top:3%;transform:rotate(10deg)}.card3{left:40%;bottom:0;transform:rotate(5deg)}.card4{right:1%;bottom:3%;transform:rotate(-7deg)}.categorySection,.productsSection,.brandSection{max-width:1300px;margin:auto;padding:55px 30px}.sectionHeader{display:flex;align-items:end;justify-content:space-between;gap:20px}.smallTitle{color:#999;font-size:10px;letter-spacing:2px}.sectionHeader h2{margin:7px 0 20px;font-size:32px;letter-spacing:-1px}.count{color:#888;font-size:13px}.categorySection{position:relative}.categoryList{display:flex;gap:8px;overflow-x:auto;padding:4px 28px 10px 2px;scrollbar-width:none;-ms-overflow-style:none;scroll-behavior:smooth;overscroll-behavior-inline:contain;mask-image:linear-gradient(to right,transparent 0,#000 28px,#000 calc(100% - 28px),transparent 100%)}.categoryList::-webkit-scrollbar{display:none}.category{flex:0 0 auto;border:1px solid #ddd;background:#fff;border-radius:999px;padding:10px 16px;cursor:pointer}.category.active{background:#111;color:#fff;border-color:#111}.productGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.productCard{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 3px 15px rgba(0,0,0,.03);transition:.2s}.productCard:hover{transform:translateY(-4px);box-shadow:0 15px 35px rgba(0,0,0,.1)}.productLink{display:block;color:inherit;text-decoration:none}.imageArea{height:255px;background:#eee;position:relative;overflow:hidden}.imageArea img{width:100%;height:100%;object-fit:cover;display:block}.badges{position:absolute;top:14px;left:14px;right:14px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none}.badges .tag{margin-right:auto}.badges .discount{margin-left:auto}.tag,.discount,.viewers{border-radius:5px;font-size:10px;font-weight:800;padding:6px 8px}.tag{background:#111;color:#fff}.discount{background:#e11d48;color:#fff}.viewers{position:absolute;bottom:12px;right:12px;background:rgba(255,255,255,.92);color:#444}.productInfo{padding:16px}.brand,.productCategory{color:#999;font-size:10px;letter-spacing:1px}.productInfo h3{margin:7px 0 7px;font-size:16px;line-height:1.4}.productCategory{display:inline-block;background:#f1f1ef;border-radius:4px;padding:4px 6px;letter-spacing:0}.price{display:flex;align-items:baseline;gap:8px;margin-top:13px}.price strong{font-size:24px;font-weight:900;letter-spacing:-.5px}.price span{text-decoration:line-through;color:#aaa;font-size:11px}.saving{display:inline-flex;align-items:center;margin-top:7px;padding:5px 8px;background:#f6e85f;color:#111;border-radius:5px;font-size:11px;font-weight:900}.sold{margin-top:9px;color:#777;font-size:11px}.urgency{display:flex;justify-content:space-between;gap:6px;margin-top:12px;color:#a15a00;font-size:10px}.stockBar{height:4px;background:#eee;border-radius:5px;margin-top:6px;overflow:hidden}.stockBar i{display:block;height:100%;background:#111;border-radius:5px}.addCart{width:calc(100% - 28px);margin:0 14px 14px;padding:12px;border:1px solid #111;background:#111;color:#fff;border-radius:8px;font-weight:800;cursor:pointer}.addCart:hover{background:#333}.addCart:disabled{background:#ddd;border-color:#ddd;color:#888;cursor:not-allowed}.empty{padding:70px 20px;background:#fff;text-align:center;border-radius:15px}.emptyIcon{font-size:45px}.empty strong{display:block;margin-top:10px}.empty p{color:#777}.empty button{padding:11px 18px;border:1px solid #111;background:#111;color:#fff;border-radius:7px;cursor:pointer}.comfortSection{margin:20px auto 0;max-width:1300px;padding:40px 30px;border:1px solid #ddd;border-radius:16px;background:#fff;display:flex;justify-content:space-between;gap:30px;align-items:center}.comfortSection h2{margin:8px 0;font-size:28px}.comfortSection p{color:#666}.comfortActions{display:flex;gap:8px;flex-wrap:wrap}.comfortActions button,.comfortActions a{padding:12px 15px;border-radius:8px;border:1px solid #111;background:#111;color:#fff;text-decoration:none;font-weight:700;cursor:pointer}.comfortActions button:nth-child(2){background:#fff;color:#111}.brandGrid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.brandButton{padding:15px 8px;background:#fff;border:1px solid #ddd;border-radius:8px;cursor:pointer}.brandButton:hover{border-color:#111;background:#111;color:#fff}.footer{margin-top:50px;padding:60px 8%;background:#111;color:#fff;display:flex;justify-content:space-between;gap:50px}.footerLogo{font-size:28px;font-weight:900}.footer p{color:#999;line-height:1.7;max-width:500px}@media(max-width:1000px){.header{gap:12px}.logoArea{min-width:160px}.productGrid{grid-template-columns:repeat(3,1fr)}.hero{grid-template-columns:1fr}.heroVisual{display:none}.brandGrid{grid-template-columns:repeat(4,1fr)}.comfortSection{flex-direction:column;align-items:flex-start}}@media(max-width:700px){.header{height:auto;padding:12px 15px;flex-wrap:wrap}.logoArea{min-width:auto}.searchWrap{order:3;flex-basis:100%;max-width:none}.cartButton{margin-left:auto}.cartButton small{display:none}.hero{padding:55px 20px}.hero h1{font-size:55px}.categorySection,.productsSection,.brandSection{padding:40px 15px}.productGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.imageArea{height:190px}.productInfo{padding:12px}.productInfo h3{font-size:14px}.price strong{font-size:16px}.urgency{display:block;line-height:1.6}.comfortSection{margin:10px 15px;padding:25px 20px}.comfortSection h2{font-size:23px}.brandGrid{grid-template-columns:repeat(3,1fr)}.footer{flex-direction:column;padding:45px 20px}.purchaseToast{left:15px;right:15px;bottom:15px}.actionToast{right:15px;left:15px;transform:none;text-align:center;top:90px}}
      `}</style>
    </main>
  );
}
