"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, getCart } from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartItem = ReturnType<typeof getCart>[number];
type CheckoutForm = { name: string; phone: string; email: string; address: string; payment: string };

const FORM_KEY = "retro-market-checkout-form";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
const initialForm: CheckoutForm = { name: "", phone: "", email: "", address: "", payment: "信用卡" };

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [form, setForm] = useState<CheckoutForm>(initialForm);

  useEffect(() => {
    setCartItems(getCart());
    try {
      const saved = window.sessionStorage.getItem(FORM_KEY);
      if (saved) setForm({ ...initialForm, ...(JSON.parse(saved) as Partial<CheckoutForm>) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || orderNumber) return;
    try { window.sessionStorage.setItem(FORM_KEY, JSON.stringify(form)); } catch {}
  }, [form, loaded, orderNumber]);

  const products = useMemo(() => cartItems.map((item) => {
    const product = getProductById(item.productId);
    return product ? { ...item, product } : null;
  }).filter((item): item is NonNullable<typeof item> => item !== null), [cartItems]);

  const total = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);

  function updateField<K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const address = form.address.trim();
    if (!name || !phone || !email || !address) { alert("請完整填寫收件資訊。"); return false; }
    if (!/^09\d{8}$/.test(phone)) { alert("請輸入正確的台灣手機號碼，例如 0912345678。"); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { alert("請輸入正確的 Email。"); return false; }
    return true;
  }

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !validateForm()) return;

    const latestProducts = getCart().map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    if (latestProducts.length === 0) {
      alert("購物車目前沒有商品。");
      setCartItems([]);
      return;
    }

    const stockProblem = latestProducts.find((item) => item.product.stock <= 0 || item.quantity > item.product.stock);
    if (stockProblem) {
      alert(`「${stockProblem.product.name}」庫存不足，請回購物車調整數量。`);
      setCartItems(getCart());
      return;
    }

    const latestTotal = latestProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const latestQuantity = latestProducts.reduce((sum, item) => sum + item.quantity, 0);
    setSubmitting(true);
    setOrderTotal(latestTotal);
    setOrderQuantity(latestQuantity);
    setOrderNumber(`RM${Date.now().toString().slice(-8)}`);
    clearCart();
    setCartItems([]);
    try { window.sessionStorage.removeItem(FORM_KEY); } catch {}
    setSubmitting(false);
  }

  if (!loaded) return <main className="loading">載入結帳資料中...</main>;

  if (orderNumber) return (
    <main className="page">
      <header className="header"><Link href="/" className="logo">RETROMART</Link><Link href="/" className="headerLink">← 回首頁</Link></header>
      <section className="successCard">
        <div className="successIcon">✓</div><div className="eyebrow">ORDER CREATED</div><h1>虛擬訂單已建立</h1>
        <p>這是一筆展示用訂單，不會產生真實付款或商品配送。</p>
        <div className="orderNumber"><span>訂單編號</span><strong>{orderNumber}</strong></div>
        <div className="successGrid">
          <div><span>收件人</span><strong>{form.name}</strong></div><div><span>付款方式</span><strong>{form.payment}</strong></div>
          <div><span>商品數量</span><strong>{orderQuantity} 件</strong></div><div><span>訂單金額</span><strong>NT${orderTotal.toLocaleString()}</strong></div>
        </div>
        <Link href="/" className="primaryButton">繼續逛逛</Link>
      </section>
      <style jsx>{styles}</style>
    </main>
  );

  if (products.length === 0) return (
    <main className="page">
      <header className="header"><Link href="/" className="logo">RETROMART</Link><Link href="/cart" className="headerLink">← 回購物車</Link></header>
      <section className="emptyCard"><div className="emptyIcon">🛒</div><h1>購物車是空的</h1><p>請先加入商品再進行結帳。</p><Link href="/" className="primaryButton">開始購物</Link></section>
      <style jsx>{styles}</style>
    </main>
  );

  return (
    <main className="page">
      <header className="header"><Link href="/" className="logo">RETROMART</Link><Link href="/cart" className="headerLink">← 回購物車</Link></header>
      <section className="title"><div className="eyebrow">CHECKOUT</div><h1>結帳</h1><p>完成以下資料即可建立虛擬展示訂單。</p></section>
      <section className="content">
        <form onSubmit={submitOrder} className="card">
          <h2>收件資訊</h2>
          <div className="fields">
            <label>收件人<input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="請輸入姓名" autoComplete="name" maxLength={40} required /></label>
            <label>電話<input value={form.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="0912345678" inputMode="tel" autoComplete="tel" maxLength={10} required /></label>
            <label>Email<input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="example@email.com" autoComplete="email" maxLength={120} required /></label>
            <label>收件地址<input value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="請輸入收件地址" autoComplete="street-address" maxLength={150} required /></label>
          </div>
          <h2 className="paymentTitle">付款方式</h2>
          <div className="payments">{["信用卡", "貨到付款", "銀行轉帳"].map((method) => <button type="button" key={method} onClick={() => updateField("payment", method)} className={form.payment === method ? "payment selected" : "payment"}>{form.payment === method ? "● " : "○ "}{method}</button>)}</div>
          <div className="notice">本網站為虛擬購物體驗。<br />不會真的進行信用卡扣款，也不會實際配送商品。</div>
          <button type="submit" className="submit" disabled={submitting}>{submitting ? "建立中..." : "建立虛擬訂單 →"}</button>
        </form>

        <aside className="summary card">
          <h2>訂單摘要</h2>
          <div className="items">{products.map((item) => {
            const optionsText = Object.entries(item.selectedOptions || {}).map(([key, value]) => `${key}：${value}`).join(" / ");
            return <div key={item.product.id + JSON.stringify(item.selectedOptions)} className="item">
              <img src={item.product.image} alt={item.product.name} onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE; }} />
              <div className="itemInfo"><strong>{item.product.name}</strong>{optionsText && <span>{optionsText}</span>}<small>× {item.quantity}</small></div>
              <strong>NT${(item.product.price * item.quantity).toLocaleString()}</strong>
            </div>;
          })}</div>
          <div className="row"><span>商品數量</span><strong>{totalQuantity} 件</strong></div>
          <div className="row"><span>運費</span><strong>NT$0</strong></div>
          <hr /><div className="total"><strong>總計</strong><strong>NT${total.toLocaleString()}</strong></div>
        </aside>
      </section>
      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
.page{min-height:100vh;background:#f5f5f3;color:#111;font-family:Arial,"Noto Sans TC",sans-serif}.loading{min-height:100vh;display:grid;place-items:center;background:#f5f5f3;color:#666}.header{height:78px;padding:0 6%;background:#fff;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;justify-content:space-between}.logo,.headerLink{color:#111;text-decoration:none}.logo{font-size:25px;font-weight:900;letter-spacing:-1px}.headerLink{font-weight:700}.title,.content{width:min(1300px,calc(100% - 60px));margin:0 auto}.title{padding:60px 0 35px}.eyebrow{color:#999;font-size:11px;letter-spacing:3px;font-weight:800}.title h1,.successCard h1,.emptyCard h1{margin:10px 0;font-size:48px;letter-spacing:-2px}.title p,.successCard p,.emptyCard p{color:#777}.content{padding-bottom:100px;display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:30px;align-items:start}.card,.successCard,.emptyCard{background:#fff;border-radius:16px}.card{padding:30px}.fields{display:grid;gap:18px;margin-top:25px}label{display:block;font-size:14px;font-weight:700}input{display:block;width:100%;margin-top:8px;padding:14px 15px;border:1px solid #ccc;border-radius:8px;outline:none;font-size:15px;background:#fff}input:focus{border-color:#111;box-shadow:0 0 0 3px rgba(0,0,0,.06)}.paymentTitle{margin-top:45px}.payments{display:grid;gap:10px;margin-top:20px}.payment{padding:18px;text-align:left;border:1px solid #ddd;background:#fff;border-radius:9px;cursor:pointer;font-weight:500}.payment:hover{border-color:#888}.payment.selected{border:2px solid #111;background:#f5f5f3;font-weight:800}.notice{margin-top:30px;padding:18px;background:#fff8eb;border-radius:10px;color:#76551c;font-size:13px;line-height:1.8}.submit,.primaryButton{display:inline-block;background:#111;color:#fff;border:none;border-radius:9px;font-weight:800;text-decoration:none}.submit{width:100%;margin-top:25px;padding:18px;cursor:pointer;font-size:16px}.submit:hover:not(:disabled),.primaryButton:hover{background:#333}.submit:disabled{opacity:.55;cursor:not-allowed}.summary{position:sticky;top:20px}.items{margin-top:20px;border-bottom:1px solid #eee}.item{display:flex;align-items:flex-start;gap:12px;padding:15px 0;border-top:1px solid #eee}.item img{width:70px;height:70px;flex:0 0 70px;object-fit:cover;border-radius:8px;background:#eee}.itemInfo{flex:1;min-width:0}.itemInfo strong,.itemInfo span,.itemInfo small{display:block}.itemInfo strong{font-size:14px;line-height:1.4}.itemInfo span{margin-top:5px;color:#888;font-size:11px;line-height:1.5}.itemInfo small{margin-top:6px;color:#777}.row,.total{display:flex;align-items:center;justify-content:space-between}.row{margin-top:15px;color:#666}.summary hr{margin:22px 0;border:0;border-top:1px solid #ddd}.total strong:last-child{font-size:25px}.successCard,.emptyCard{width:min(760px,calc(100% - 30px));margin:80px auto;padding:55px;text-align:center}.successIcon{width:70px;height:70px;margin:0 auto 25px;display:grid;place-items:center;border-radius:50%;background:#111;color:#fff;font-size:34px;font-weight:900}.orderNumber{margin:30px auto;padding:18px;background:#f5f5f3;border-radius:10px}.orderNumber span,.successGrid span{display:block;color:#999;font-size:12px}.orderNumber strong{display:block;margin-top:6px;font-size:24px}.successGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;text-align:left}.successGrid div{padding:15px;border:1px solid #eee;border-radius:9px}.successGrid strong{display:block;margin-top:5px}.primaryButton{margin-top:28px;padding:15px 28px}.emptyIcon{font-size:60px}@media(max-width:900px){.content{grid-template-columns:1fr}.summary{position:static}}@media(max-width:600px){.header{height:68px;padding:0 15px}.logo{font-size:21px}.headerLink{font-size:13px}.title,.content{width:calc(100% - 30px)}.title{padding:40px 0 20px}.title h1{font-size:38px}.card{padding:20px}.item{gap:9px}.item img{width:60px;height:60px;flex-basis:60px}.successCard,.emptyCard{margin:45px auto;padding:40px 20px}.successCard h1,.emptyCard h1{font-size:36px}.successGrid{grid-template-columns:1fr}}
`;
