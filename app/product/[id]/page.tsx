"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { products } from "../../../lib/products";
import { addToCart, getCartCount } from "../../../lib/cart";

type Product = (typeof products)[number];

const appleFallbacks: Record<string, string> = {
  手機: "https://www.apple.com/tw/iphone-17/images/overview/welcome/hero_startframe__e9e7pcnguyqi_xlarge.webp",
  平板: "https://www.apple.com/v/ipad-air/ah/images/overview/hero/hero_endframe__6gl84bccyaqi_large.png",
  筆電: "https://www.apple.com/v/macbook-neo/b/images/overview/welcome/hero_endframe__c62q483im5si_xlarge.jpg",
};

function candidates(product: Product) {
  const list: string[] = [];
  if (product.brand === "Apple" && /apple\.com/i.test(product.image)) {
    list.push(`https://wsrv.nl/?url=${encodeURIComponent(product.image)}`);
  }
  list.push(product.image);
  if (product.brand === "Apple" && appleFallbacks[product.category]) list.push(appleFallbacks[product.category]);
  return [...new Set(list)];
}

function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const list = useMemo(() => candidates(product), [product]);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [product.id]);
  if (!list[index]) return <div className={`${className} imageMissing`}>{product.name}</div>;
  return <img className={className} src={list[index]} alt={product.name} onError={() => setIndex((value) => value + 1)} />;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((item) => item.id === id) as Product | undefined;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCartCount(getCartCount());
    const onCart = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", onCart);
    return () => window.removeEventListener("cart-updated", onCart);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!product) {
    return <main className="notFound"><h1>找不到商品</h1><Link href="/">← 回到首頁</Link></main>;
  }

  const discount = product.oldPrice > 0 ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const options = product.options ?? [];
  const images = product.images?.length ? product.images : [product.image];

  const selectOption = (name: string, value: string) => setSelectedOptions((old) => ({ ...old, [name]: value }));
  const addSelected = () => {
    const added = addToCart(product, selectedOptions, quantity);
    setCartCount(getCartCount());
    setMessage(added ? `✓ 已加入 ${product.name}` : "已達庫存上限");
  };
  const buyNow = () => {
    const added = addToCart(product, selectedOptions, quantity);
    if (!added) {
      setMessage("已達庫存上限");
      return;
    }
    router.push("/checkout");
  };

  return (
    <main className="page">
      {message && <div className="toast">{message}</div>}
      <header className="header"><Link href="/" className="logo">RETROMART</Link><div className="headerRight"><Link href="/" className="back">← 繼續逛逛</Link><Link href="/cart" className="cart">🛒 購物車 <b>{cartCount}</b></Link></div></header>

      <div className="breadcrumb"><Link href="/">首頁</Link><span>›</span><span>{product.category}</span><span>›</span><span>{product.name}</span></div>

      <section className="productSection">
        <div className="gallery">
          <div className="mainImage"><ProductImage product={product} /><span className="tag">{product.tag}</span><span className="discount">-{discount}%</span></div>
          <div className="thumbs">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setMessage(`已選擇第 ${index + 1} 張圖片`)}><img src={image} alt={`${product.name} ${index + 1}`} /></button>)}</div>
        </div>

        <div className="information">
          <div className="brand">{product.brand}</div><h1>{product.name}</h1>
          <div className="rating">★★★★★ <b>{product.rating}</b> <span>{product.reviewCount.toLocaleString()} 則評論　已售 {product.sold.toLocaleString()}</span></div>
          <div className="oldPrice">NT${product.oldPrice.toLocaleString()}</div><div className="price">NT${product.price.toLocaleString()} <em>-{discount}%</em></div>
          <div className="activity"><div>🔥 目前 37 人正在查看</div><div>⚡ 最近 1 小時有 12 人查看此商品</div><div>📦 庫存剩餘 {product.stock} 件</div></div>

          {options.map((option) => {
            const selected = selectedOptions[option.name] || option.values[0];
            return <div className="optionGroup" key={option.name}><div className="optionTitle">{option.name}：<b>{selected}</b></div><div className="options">{option.values.map((value) => <button key={value} type="button" className={selected === value ? "option selected" : "option"} onClick={() => selectOption(option.name, value)}>{value}</button>)}</div></div>;
          })}

          <div className="optionTitle">數量</div><div className="quantity"><button type="button" onClick={() => setQuantity((v) => Math.max(1, v - 1))}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity((v) => Math.min(product.stock, v + 1))}>＋</button></div>
          <div className="buttons"><button type="button" className="addButton" onClick={addSelected}>🛒 加入購物車</button><button type="button" className="buyButton" onClick={buyNow}>立即購買</button></div>
          <div className="service">✓ 虛擬商品展示　 ✓ 不會產生真實付款　 ✓ 不會實際出貨</div>
        </div>
      </section>

      <section className="details"><div className="smallTitle">PRODUCT INFORMATION</div><h2>商品詳細資訊</h2><div className="description"><h3>商品介紹</h3><p>{product.description}</p></div><h3>商品規格</h3><div className="specs">{product.specs.map((spec) => <div key={spec.label}><b>{spec.label}</b><span>{spec.value}</span></div>)}</div></section>

      <section className="recommend"><div className="smallTitle">YOU MAY ALSO LIKE</div><h2>你可能也喜歡</h2><div className="recommendGrid">{products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map((item) => <Link href={`/product/${item.id}`} key={item.id} className="recommendCard"><div className="recommendImage"><ProductImage product={item} /></div><b>{item.brand}</b><h3>{item.name}</h3><strong>NT${item.price.toLocaleString()}</strong></Link>)}</div></section>

      <style jsx>{`
        *{box-sizing:border-box}.page{min-height:100vh;background:#f5f5f3;color:#111;font-family:Arial,"Noto Sans TC","Microsoft JhengHei",sans-serif}.header{height:78px;background:#fff;border-bottom:1px solid #ddd;padding:0 6%;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:20}.logo{font-size:25px;font-weight:900;color:#111;text-decoration:none}.headerRight{display:flex;gap:12px;align-items:center}.back{color:#555;text-decoration:none}.cart{background:#111;color:#fff;text-decoration:none;padding:12px 16px;border-radius:9px;font-weight:800}.cart b{background:#fff;color:#111;border-radius:20px;padding:2px 7px}.breadcrumb{max-width:1200px;margin:0 auto;padding:25px 25px;color:#777;display:flex;gap:10px}.breadcrumb a{color:#111;text-decoration:none}.productSection{max-width:1200px;margin:auto;padding:15px 25px 70px;display:grid;grid-template-columns:1.1fr .9fr;gap:65px}.mainImage{height:560px;background:#fff;border-radius:16px;position:relative;overflow:hidden}.mainImage img{width:100%;height:100%;object-fit:contain}.tag,.discount{position:absolute;top:18px;padding:7px 10px;border-radius:6px;font-size:11px;font-weight:900}.tag{left:18px;background:#111;color:#fff}.discount{right:18px;background:#e11d48;color:#fff}.thumbs{display:flex;gap:10px;margin-top:12px;overflow:auto}.thumbs button{width:82px;height:82px;border:1px solid #ddd;background:#fff;border-radius:8px;flex:0 0 auto}.thumbs img{width:100%;height:100%;object-fit:contain}.brand{color:#999;font-size:12px;letter-spacing:2px}.information h1{font-size:44px;line-height:1.05;margin:12px 0 20px}.rating{color:#b47a00}.rating span{color:#777;margin-left:8px}.oldPrice{text-decoration:line-through;color:#999;margin-top:30px}.price{font-size:42px;font-weight:900;margin:5px 0 20px}.price em{font-size:13px;background:#e11d48;color:#fff;padding:6px;border-radius:5px;font-style:normal}.activity{background:#fff3c4;border-radius:10px;padding:15px;line-height:1.9;margin-bottom:25px}.optionGroup{margin:22px 0}.optionTitle{font-weight:800;margin-bottom:10px}.options{display:flex;flex-wrap:wrap;gap:8px}.option{border:1px solid #ccc;background:#fff;border-radius:8px;padding:11px 15px;cursor:pointer}.option.selected{border:2px solid #111;background:#111;color:#fff}.quantity{display:flex;border:1px solid #bbb;border-radius:8px;width:145px;height:45px;overflow:hidden;margin-bottom:22px;background:#fff}.quantity button{width:45px;border:0;background:#fff;font-size:20px;cursor:pointer}.quantity span{flex:1;display:grid;place-items:center}.buttons{display:grid;grid-template-columns:1fr 1fr;gap:10px}.addButton,.buyButton{padding:16px;border-radius:9px;font-weight:900;cursor:pointer}.addButton{background:#fff;border:1px solid #111}.buyButton{background:#111;color:#fff;border:1px solid #111}.service{margin-top:18px;color:#777;font-size:12px;line-height:1.9}.details,.recommend{max-width:1200px;margin:auto;padding:60px 25px}.details{border-top:1px solid #ddd}.smallTitle{font-size:10px;color:#999;letter-spacing:2px}.details h2,.recommend h2{font-size:32px;margin:8px 0 30px}.description{background:#fff;border-radius:12px;padding:25px;margin-bottom:30px}.description p{color:#666;line-height:1.8}.specs{border-top:1px solid #ddd}.specs div{display:grid;grid-template-columns:180px 1fr;padding:16px 0;border-bottom:1px solid #ddd}.specs b{color:#777}.recommendGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.recommendCard{background:#fff;border-radius:12px;padding:12px;color:#111;text-decoration:none}.recommendImage{height:220px;background:#f7f7f7;border-radius:8px;overflow:hidden}.recommendImage img{width:100%;height:100%;object-fit:contain}.recommendCard>b{display:block;color:#999;font-size:10px;margin-top:12px}.recommendCard h3{font-size:15px}.recommendCard strong{font-size:18px}.toast{position:fixed;top:95px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #ddd;box-shadow:0 15px 40px rgba(0,0,0,.2);padding:13px 20px;border-radius:10px;z-index:100;font-weight:800}.notFound{min-height:100vh;display:grid;place-items:center;text-align:center}.notFound a{color:#111}@media(max-width:900px){.productSection{grid-template-columns:1fr;gap:30px}.mainImage{height:480px}.recommendGrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.header{padding:0 15px}.back{display:none}.productSection{padding:10px 15px 50px}.mainImage{height:380px}.information h1{font-size:34px}.price{font-size:34px}.buttons{grid-template-columns:1fr}.details,.recommend{padding:45px 15px}.specs div{grid-template-columns:110px 1fr}.recommendGrid{grid-template-columns:1fr 1fr}.recommendImage{height:160px}}
      `}</style>
    </main>
  );
}
