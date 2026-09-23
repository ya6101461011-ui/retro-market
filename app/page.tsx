"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { products } from "../lib/products";
import { addToCart, getCartCount } from "../lib/cart";

const categories = [
  "全部",
  "手機",
  "筆電",
  "顯卡",
  "電視",
  "電玩",
  "相機",
  "空拍機",
  "音響",
  "耳機",
  "家電",
  "冷氣",
  "智慧手錶",
  "精品",
  "服飾",
  "球鞋",
  "名錶",
  "汽車",
];

const categoryToParam: Record<string, string> = {
  全部: "all",
  手機: "phone",
  筆電: "laptop",
  顯卡: "gpu",
  電視: "tv",
  電玩: "gaming",
  相機: "camera",
  空拍機: "drone",
  音響: "speaker",
  耳機: "headphones",
  家電: "home-appliance",
  冷氣: "air-conditioner",
  智慧手錶: "smartwatch",
  精品: "luxury",
  服飾: "fashion",
  球鞋: "sneakers",
  名錶: "watch",
  汽車: "car",
};

const paramToCategory = Object.fromEntries(
  Object.entries(categoryToParam).map(([category, param]) => [param, category])
);

const fallbackImage =
  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=1000&q=85";

function money(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function displayCategory(product: (typeof products)[number]) {
  if (product.id === "apple-watch-ultra") return "智慧手錶";
  if (product.id === "dji-drone") return "空拍機";
  return product.category;
}

function matchesCategory(
  product: (typeof products)[number],
  category: string
) {
  if (category === "全部") return true;
  return displayCategory(product) === category;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const updateUrl = (category: string, keyword: string) => {
    const params = new URLSearchParams();
    if (category !== "全部") params.set("category", categoryToParam[category] ?? category);
    if (keyword.trim()) params.set("search", keyword.trim());

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `/?${query}` : "/"
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search") ?? "";
    const urlCategory = categoryParam
      ? paramToCategory[categoryParam] ?? "全部"
      : "全部";

    setSelectedCategory(
      categories.includes(urlCategory) ? urlCategory : "全部"
    );
    setSearch(searchParam);

    const updateCart = () => setCartCount(getCartCount());
    updateCart();

    window.addEventListener("cart-updated", updateCart);
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return products.filter((product) => {
      const categoryOK = matchesCategory(product, selectedCategory);
      const display = displayCategory(product).toLowerCase();
      const searchOK =
        keyword === "" ||
        product.name.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        display.includes(keyword);

      return categoryOK && searchOK;
    });
  }, [selectedCategory, search]);

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    updateUrl(category, search);
    requestAnimationFrame(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateUrl(selectedCategory, value);
  };

  return (
    <main className="site">
      <div className="announcement">
        🔥 最新熱門商品持續更新中　｜　虛擬購物體驗
      </div>

      <header className="header">
        <Link href="/" className="logoArea" aria-label="RETROMART 首頁">
          <div className="logo">RETROMART</div>
          <div className="logoSub">EVERYTHING YOU WANT</div>
        </Link>

        <label className="searchBox" aria-label="搜尋商品">
          <span aria-hidden="true">🔎</span>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜尋手機、電視、顯卡、精品、汽車..."
            type="search"
          />
          {search && (
            <button
              type="button"
              className="clearSearch"
              onClick={() => handleSearch("")}
              aria-label="清除搜尋"
            >
              ×
            </button>
          )}
        </label>

        <Link href="/cart" className="cartButton" aria-label={`購物車，共 ${cartCount} 件商品`}>
          🛒 購物車 <b>{cartCount}</b>
        </Link>
      </header>

      <section className="hero">
        <div className="heroContent">
          <div className="eyebrow">THE INTERNET'S SHOPPING PLAYGROUND</div>
          <h1>
            你想買的
            <br />
            <span>這裡都有。</span>
          </h1>
          <p>
            從最新手機、電玩、顯卡，到精品、名錶、汽車。
            <br />
            找一些你原本不知道自己想要的東西。
          </p>
          <button
            className="heroButton"
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            開始逛逛 →
          </button>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="floatingCard card1">📱</div>
          <div className="floatingCard card2">🎮</div>
          <div className="floatingCard card3">⌚</div>
          <div className="floatingCard card4">🚗</div>
        </div>
      </section>

      <section className="categorySection">
        <div className="sectionHeader">
          <div>
            <div className="smallTitle">EXPLORE</div>
            <h2>探索分類</h2>
          </div>
          <div className="count" aria-live="polite">{filteredProducts.length} 個商品</div>
        </div>

        <div className="categoryList" role="tablist" aria-label="商品分類">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={selectedCategory === category ? "category active" : "category"}
              aria-selected={selectedCategory === category}
              onClick={() => handleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section id="products" className="productsSection">
        <div className="sectionHeader">
          <div>
            <div className="smallTitle">TRENDING NOW</div>
            <h2>{selectedCategory === "全部" ? "最近熱門" : selectedCategory}</h2>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty">
            <div className="emptyIcon">🔎</div>
            <strong>找不到符合的商品</strong>
            <p>試試其他關鍵字或切換商品分類。</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("全部");
                updateUrl("全部", "");
              }}
            >
              清除篩選
            </button>
          </div>
        ) : (
          <div className="productGrid">
            {filteredProducts.map((product) => {
              const discount = Math.max(
                0,
                Math.round((1 - product.price / product.oldPrice) * 100)
              );
              const category = displayCategory(product);

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="productCard"
                >
                  <div className="imageArea">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== fallbackImage) img.src = fallbackImage;
                      }}
                    />
                    <div className="badges" aria-label={`${product.tag}，折扣 ${discount}%`}>
                      <span className="tag">{product.tag}</span>
                      {discount > 0 && <span className="discount">-{discount}%</span>}
                    </div>
                  </div>

                  <div className="productInfo">
                    <div className="brand">{product.brand}</div>
                    <h3>{product.name}</h3>
                    <div className="productCategory">{category}</div>
                    <div className="price">
                      <strong>NT${money(product.price)}</strong>
                      <span>NT${money(product.oldPrice)}</span>
                    </div>
                    <div className="sold">🔥 已售 {money(product.sold)} 件</div>
                  </div>

                  <button
                    type="button"
                    className="addCart"
                    disabled={product.stock <= 0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    {product.stock > 0 ? "＋ 加入購物車" : "暫時缺貨"}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="brandSection">
        <div className="sectionHeader">
          <div>
            <div className="smallTitle">BRANDS</div>
            <h2>熱門品牌</h2>
          </div>
        </div>

        <div className="brandGrid">
          {[
            "Apple",
            "Sony",
            "Samsung",
            "Nintendo",
            "PlayStation",
            "NVIDIA",
            "ASUS",
            "JBL",
            "Bose",
            "Nike",
            "Louis Vuitton",
            "Rolex",
            "BMW",
            "Porsche",
            "Tesla",
            "Dyson",
            "Leica",
            "DJI",
          ].map((brand) => (
            <button
              type="button"
              key={brand}
              className="brandButton"
              onClick={() => {
                handleSearch(brand);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <div className="footerLogo">RETROMART</div>
          <p>EVERYTHING YOU WANT.</p>
        </div>
        <div className="footerInfo">
          <strong>虛擬購物體驗</strong>
          <p>本網站為虛擬購物體驗。商品、價格、銷售數字、庫存與評論僅供展示。</p>
          <p>不會產生真實訂單，不會進行實際付款或商品配送。</p>
        </div>
      </footer>

      <style jsx>{`
        * { box-sizing: border-box; }
        .site { min-height:100vh; background:#f5f5f3; color:#111; font-family:Arial,"Noto Sans TC","Microsoft JhengHei",sans-serif; }
        .announcement { background:#111; color:white; text-align:center; padding:11px; font-size:13px; }
        .header { height:82px; padding:0 5%; background:white; border-bottom:1px solid #ddd; display:flex; align-items:center; gap:30px; position:sticky; top:0; z-index:50; }
        .logoArea { min-width:220px; color:#111; text-decoration:none; }
        .logo { font-size:25px; font-weight:900; letter-spacing:-1px; }
        .logoSub { margin-top:2px; font-size:9px; letter-spacing:2px; color:#999; }
        .searchBox { height:45px; max-width:650px; flex:1; display:flex; align-items:center; gap:10px; padding:0 15px; background:#f5f5f5; border:1px solid #ddd; border-radius:30px; }
        .searchBox input { width:100%; border:none; outline:none; background:transparent; font-size:14px; }
        .clearSearch { border:0; background:transparent; color:#888; font-size:22px; line-height:1; cursor:pointer; padding:0 3px; }
        .cartButton { padding:12px 18px; background:white; border:1px solid #111; border-radius:8px; cursor:pointer; font-weight:700; white-space:nowrap; color:#111; text-decoration:none; display:inline-flex; align-items:center; gap:5px; }
        .cartButton:hover { background:#111; color:white; }
        .cartButton b { margin-left:6px; padding:2px 7px; border-radius:20px; background:#111; color:white; }
        .cartButton:hover b { background:white; color:#111; }
        .hero { min-height:540px; padding:80px 8%; display:grid; grid-template-columns:1fr 1fr; align-items:center; background:radial-gradient(circle at 75% 40%,#ddd,#f5f5f3 45%); }
        .eyebrow { color:#888; font-size:11px; letter-spacing:2px; margin-bottom:20px; }
        .hero h1 { margin:0; font-size:clamp(55px,7vw,90px); line-height:.95; letter-spacing:-5px; }
        .hero h1 span { color:#888; }
        .hero p { color:#555; line-height:1.8; margin-top:28px; }
        .heroButton { margin-top:20px; padding:15px 25px; background:#111; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700; }
        .heroButton:hover { opacity:.85; }
        .heroVisual { height:400px; position:relative; }
        .floatingCard { position:absolute; width:180px; height:230px; border-radius:20px; background:white; box-shadow:0 25px 70px rgba(0,0,0,.15); display:flex; align-items:center; justify-content:center; font-size:70px; }
        .card1 { left:15%; top:20px; transform:rotate(-8deg); }
        .card2 { right:5%; top:100px; transform:rotate(8deg); }
        .card3 { left:5%; bottom:0; transform:rotate(5deg); }
        .card4 { right:25%; bottom:30px; transform:rotate(-6deg); }
        .categorySection,.productsSection,.brandSection { padding:70px 6%; }
        .sectionHeader { display:flex; align-items:end; justify-content:space-between; margin-bottom:25px; }
        .smallTitle { color:#999; font-size:10px; letter-spacing:2px; }
        .sectionHeader h2 { margin:7px 0 0; font-size:32px; }
        .count { color:#777; }
        .categoryList { display:flex; gap:9px; overflow-x:auto; padding-bottom:3px; scrollbar-width:thin; }
        .category { flex-shrink:0; padding:11px 18px; border:1px solid #ddd; border-radius:30px; background:white; cursor:pointer; }
        .category.active { background:#111; color:white; border-color:#111; }
        .productGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:22px; }
        .productCard { display:block; color:inherit; text-decoration:none; background:#fff; border-radius:14px; overflow:hidden; transition:transform .2s,box-shadow .2s; }
        .productCard:hover { transform:translateY(-5px); box-shadow:0 15px 40px rgba(0,0,0,.12); }
        .imageArea { height:270px; background:#eee; position:relative; overflow:hidden; }
        .imageArea img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .3s; }
        .productCard:hover .imageArea img { transform:scale(1.04); }
        .badges { position:absolute; top:12px; left:12px; right:12px; display:flex; align-items:flex-start; justify-content:space-between; gap:8px; pointer-events:none; }
        .tag,.discount { position:static; display:inline-flex; align-items:center; max-width:70%; padding:6px 9px; border-radius:6px; font-size:11px; font-weight:700; line-height:1.2; box-shadow:0 2px 8px rgba(0,0,0,.08); }
        .tag { background:#111; color:white; }
        .discount { background:#e11d48; color:white; margin-left:auto; white-space:nowrap; }
        .productInfo { padding:17px 17px 8px; }
        .brand { color:#999; font-size:11px; letter-spacing:1px; }
        .productInfo h3 { margin:7px 0; font-size:17px; line-height:1.4; }
        .productCategory { color:#999; font-size:12px; }
        .price { display:flex; align-items:baseline; gap:9px; margin-top:15px; }
        .price strong { font-size:21px; }
        .price span { color:#aaa; font-size:12px; text-decoration:line-through; }
        .sold { margin-top:9px; color:#888; font-size:11px; }
        .addCart { width:calc(100% - 30px); margin:6px 15px 15px; padding:11px; border:1px solid #ddd; background:white; border-radius:7px; cursor:pointer; font-weight:700; }
        .addCart:hover:not(:disabled) { background:#111; color:white; }
        .addCart:disabled { color:#aaa; background:#f5f5f5; cursor:not-allowed; }
        .empty { padding:80px; background:white; border-radius:14px; text-align:center; color:#777; }
        .emptyIcon { font-size:40px; margin-bottom:10px; }
        .empty strong { display:block; color:#111; font-size:20px; }
        .empty p { margin:8px 0 20px; }
        .empty button { padding:10px 18px; border:1px solid #111; background:#111; color:white; border-radius:7px; cursor:pointer; font-weight:700; }
        .brandSection { background:white; }
        .brandGrid { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }
        .brandButton { padding:20px 10px; background:white; border:1px solid #ddd; border-radius:10px; cursor:pointer; font-weight:700; }
        .brandButton:hover { background:#111; color:white; }
        .footer { padding:60px 8%; background:#111; color:white; display:flex; justify-content:space-between; gap:50px; }
        .footerLogo { font-size:28px; font-weight:900; }
        .footer p { color:#999; line-height:1.7; max-width:500px; }
        @media (max-width:1000px) { .productGrid { grid-template-columns:repeat(3,1fr); } .hero { grid-template-columns:1fr; } .heroVisual { display:none; } .brandGrid { grid-template-columns:repeat(4,1fr); } }
        @media (max-width:700px) { .header { height:auto; padding:15px; flex-wrap:wrap; gap:15px; } .logoArea { min-width:auto; } .searchBox { order:3; flex-basis:100%; } .cartButton { margin-left:auto; } .productGrid { grid-template-columns:repeat(2,1fr); gap:12px; } .imageArea { height:210px; } .categorySection,.productsSection,.brandSection { padding:45px 15px; } .brandGrid { grid-template-columns:repeat(2,1fr); } .footer { flex-direction:column; } .productInfo { padding:14px 12px 6px; } .productInfo h3 { font-size:15px; } .price { flex-direction:column; gap:2px; } .price strong { font-size:18px; } .addCart { width:calc(100% - 24px); margin:6px 12px 12px; } }
      `}</style>
    </main>
  );
}
