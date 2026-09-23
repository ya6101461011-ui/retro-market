"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { clearCart, getCart } from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartItem = ReturnType<typeof getCart>[number];
type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  payment: string;
  cardNumber: string;
};
type CelebrationItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  lineTotal: number;
};

const FORM_KEY = "retro-market-checkout-form";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
const initialForm: CheckoutForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  payment: "信用卡",
  cardNumber: "",
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderOriginalTotal, setOrderOriginalTotal] = useState(0);
  const [orderSavings, setOrderSavings] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [orderItems, setOrderItems] = useState<CelebrationItem[]>([]);
  const [form, setForm] = useState<CheckoutForm>(initialForm);

  useEffect(() => {
    const refresh = () => setCartItems(getCart());
    refresh();
    try {
      const saved = window.sessionStorage.getItem(FORM_KEY);
      if (saved) setForm({ ...initialForm, ...(JSON.parse(saved) as Partial<CheckoutForm>) });
    } catch {}
    setLoaded(true);

    const onCartUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key === "retro-market-cart") refresh();
    };
    window.addEventListener("cart-updated", onCartUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart-updated", onCartUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!loaded || orderNumber) return;
    try {
      window.sessionStorage.setItem(FORM_KEY, JSON.stringify(form));
    } catch {}
  }, [form, loaded, orderNumber]);

  const products = useMemo(
    () => cartItems.map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    }).filter((item): item is NonNullable<typeof item> => item !== null),
    [cartItems]
  );

  const total = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
  const originalTotal = products.reduce((sum, item) => sum + item.product.oldPrice * item.quantity, 0);
  const savings = Math.max(0, originalTotal - total);

  function updateField<K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const address = form.address.trim();
    if (!name || !phone || !email || !address) {
      alert("請完整填寫收件資訊。");
      return false;
    }
    if (!/^09\d{8}$/.test(phone)) {
      alert("請輸入正確的台灣手機號碼，例如 0912345678。");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("請輸入正確的 Email。");
      return false;
    }
    return true;
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
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

    const stockProblem = latestProducts.find(
      (item) => item.product.stock <= 0 || item.quantity > item.product.stock
    );
    if (stockProblem) {
      alert(`「${stockProblem.product.name}」庫存不足，請回購物車調整數量。`);
      setCartItems(getCart());
      return;
    }

    const latestTotal = latestProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const latestOriginalTotal = latestProducts.reduce((sum, item) => sum + item.product.oldPrice * item.quantity, 0);
    const latestQuantity = latestProducts.reduce((sum, item) => sum + item.quantity, 0);
    const latestItems: CelebrationItem[] = latestProducts.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      image: item.product.image,
      quantity: item.quantity,
      lineTotal: item.product.price * item.quantity,
    }));

    setSubmitting(true);
    setOrderTotal(latestTotal);
    setOrderOriginalTotal(latestOriginalTotal);
    setOrderSavings(Math.max(0, latestOriginalTotal - latestTotal));
    setOrderQuantity(latestQuantity);
    setOrderItems(latestItems);
    setOrderNumber(`RM${Date.now().toString().slice(-8)}`);
    clearCart();
    setCartItems([]);
    try {
      window.sessionStorage.removeItem(FORM_KEY);
    } catch {}
    setSubmitting(false);
  }

  if (!loaded) return <main className="loading">載入結帳資料中...</main>;

  if (orderNumber) {
    return (
      <main className="celebrationPage">
        <div className="celebrationGlow" aria-hidden="true" />
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 72 }, (_, index) => {
            const style = {
              "--x": `${(index * 47) % 220 - 110}vw`,
              "--y": `${40 + ((index * 31) % 70)}vh`,
              "--r": `${(index * 71) % 720 - 360}deg`,
              "--delay": `${(index % 18) * 0.055}s`,
            } as CSSProperties;
            return <i key={index} style={style} />;
          })}
        </div>

        <header className="successHeader">
          <Link href="/" className="successLogo">RETROMART</Link>
          <span>VIRTUAL CHECKOUT</span>
        </header>

        <section className="celebrationContent" aria-live="polite">
          <div className="approvedPill"><span>✓</span> PAYMENT APPROVED</div>
          <div className="successIconLarge" aria-hidden="true">✓</div>
          <div className="eyebrow successEyebrow">ORDER CREATED</div>
          <h1>🎉 訂單成立！</h1>
          <p className="heroMessage">恭喜！你剛剛完成了一次<br /><strong>完全免費的虛擬購物！</strong></p>

          <div className="savingHero">
            <span>🔥 本次購物幫你省下</span>
            <strong>NT${orderSavings.toLocaleString()}</strong>
            <small>原價 NT${orderOriginalTotal.toLocaleString()} → 虛擬訂單 NT${orderTotal.toLocaleString()}</small>
          </div>

          <div className="celebrationCard">
            <div className="celebrationCardHeader">
              <div>
                <span className="miniLabel">YOUR VIRTUAL HAUL</span>
                <h2>你剛剛買了什麼？</h2>
              </div>
              <strong>{orderQuantity} 件</strong>
            </div>

            <div className="haulList">
              {orderItems.map((item) => (
                <div className="haulItem" key={item.id}>
                  <img src={item.image} alt={item.name} loading="lazy" onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_IMAGE) event.currentTarget.src = FALLBACK_IMAGE;
                  }} />
                  <div className="haulInfo">
                    <strong>{item.name}</strong>
                    <span>數量 × {item.quantity}</span>
                  </div>
                  <strong>NT${item.lineTotal.toLocaleString()}</strong>
                </div>
              ))}
            </div>

            <div className="successStats">
              <div><span>訂單編號</span><strong>{orderNumber}</strong></div>
              <div><span>付款方式</span><strong>{form.payment}</strong></div>
              <div><span>虛擬訂單金額</span><strong>NT${orderTotal.toLocaleString()}</strong></div>
            </div>
          </div>

          <p className="demoNotice">這是一筆展示用虛擬訂單，不會產生真實付款、出貨或商品配送。</p>
          <div className="successActions">
            <Link href="/" className="primaryButton celebrationButton">🛍️ 繼續瘋狂購物</Link>
            <Link href="/cart" className="secondaryButton">查看購物車</Link>
          </div>
        </section>
        <style jsx>{styles}</style>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="page">
        <header className="header"><Link href="/" className="logo">RETROMART</Link><Link href="/cart" className="headerLink">← 回購物車</Link></header>
        <section className="emptyCard"><div className="emptyIcon">🛒</div><h1>購物車是空的</h1><p>請先加入商品再進行結帳。</p><Link href="/" className="primaryButton">開始購物</Link></section>
        <style jsx>{styles}</style>
      </main>
    );
  }

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
          <div className="payments">{["信用卡", "貨到付款", "銀行轉帳"].map((method) => (
            <button type="button" key={method} onClick={() => updateField("payment", method)} className={form.payment === method ? "payment selected" : "payment"} aria-pressed={form.payment === method}>
              {form.payment === method ? "● " : "○ "}{method}
            </button>
          ))}</div>
          {form.payment === "信用卡" && (
            <div className="virtualCard">
              <div className="virtualCardTop"><strong>VIRTUAL CARD</strong><span>RETROMART</span></div>
              <label>虛擬卡號<input value={form.cardNumber} onChange={(e) => updateField("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="8888 8888 8888 8888" inputMode="numeric" aria-label="虛擬信用卡號" /></label>
              <button type="button" className="demoCard" onClick={() => updateField("cardNumber", "8888888888888888")}>一鍵填入虛擬卡 8888-8888-8888-8888</button>
              <small>僅供遊戲體驗，不會送出或扣款。</small>
            </div>
          )}
          <div className="notice">本網站為虛擬購物體驗。<br />不會真的進行信用卡扣款，也不會實際配送商品。</div>
          <button type="submit" className="submit" disabled={submitting}>{submitting ? "建立中..." : "建立虛擬訂單 →"}</button>
        </form>

        <aside className="summary card">
          <h2>訂單摘要</h2>
          <div className="items">{products.map((item) => {
            const optionsText = Object.entries(item.selectedOptions || {}).map(([key, value]) => `${key}：${value}`).join(" / ");
            return <div key={item.product.id + JSON.stringify(item.selectedOptions)} className="item">
              <img src={item.product.image} alt={item.product.name} loading="lazy" onError={(event) => {
                if (event.currentTarget.src !== FALLBACK_IMAGE) event.currentTarget.src = FALLBACK_IMAGE;
              }} />
              <div className="itemInfo"><strong>{item.product.name}</strong>{optionsText && <span>{optionsText}</span>}<small>× {item.quantity}</small></div>
              <strong>NT${(item.product.price * item.quantity).toLocaleString()}</strong>
            </div>;
          })}</div>
          <div className="row"><span>商品數量</span><strong>{totalQuantity} 件</strong></div>
          <div className="row"><span>運費</span><strong>NT$0</strong></div>
          {savings > 0 && <div className="checkoutSaving">🔥 這單幫你省下 NT${savings.toLocaleString()}</div>}
          <hr /><div className="total"><strong>總計</strong><strong>NT${total.toLocaleString()}</strong></div>
        </aside>
      </section>
      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
.page{min-height:100vh;background:#f5f5f3;color:#111;font-family:Arial,"Noto Sans TC",sans-serif}.loading{min-height:100vh;display:grid;place-items:center;background:#f5f5f3;color:#666}.header{height:78px;padding:0 6%;background:#fff;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;justify-content:space-between}.logo,.headerLink{color:#111;text-decoration:none}.logo{font-size:25px;font-weight:900;letter-spacing:-1px}.headerLink{font-weight:700}.title,.content{width:min(1300px,calc(100% - 60px));margin:0 auto}.title{padding:60px 0 35px}.eyebrow{color:#999;font-size:11px;letter-spacing:3px;font-weight:800}.title h1,.emptyCard h1{margin:10px 0;font-size:48px;letter-spacing:-2px}.title p,.emptyCard p{color:#777}.content{padding-bottom:100px;display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:30px;align-items:start}.card,.emptyCard{background:#fff;border-radius:16px}.card{padding:30px}.fields{display:grid;gap:18px;margin-top:25px}label{display:block;font-size:14px;font-weight:700}input{display:block;width:100%;margin-top:8px;padding:14px 15px;border:1px solid #ccc;border-radius:8px;outline:none;font-size:15px;background:#fff}input:focus{border-color:#111;box-shadow:0 0 0 3px rgba(0,0,0,.06)}.paymentTitle{margin-top:45px}.payments{display:grid;gap:10px;margin-top:20px}.payment{padding:18px;text-align:left;border:1px solid #ddd;background:#fff;border-radius:9px;cursor:pointer;font-weight:500}.payment:hover{border-color:#888}.payment.selected{border:2px solid #111;background:#f5f5f3;font-weight:800}.virtualCard{margin-top:22px;padding:18px;border-radius:12px;background:linear-gradient(135deg,#181818,#3b3b3b);color:#fff}.virtualCardTop{display:flex;justify-content:space-between;font-size:11px;letter-spacing:1px;margin-bottom:18px}.virtualCard label{color:#fff}.virtualCard input{background:#fff;color:#111;letter-spacing:2px}.demoCard{width:100%;margin-top:10px;padding:11px;border:1px solid #666;border-radius:8px;background:#fff;color:#111;font-weight:800;cursor:pointer}.virtualCard small{display:block;margin-top:8px;color:#aaa;font-size:10px}.notice{margin-top:30px;padding:18px;background:#fff8eb;border-radius:10px;color:#76551c;font-size:13px;line-height:1.8}.submit,.primaryButton{display:inline-block;background:#111;color:#fff;border:none;border-radius:9px;font-weight:800;text-decoration:none}.submit{width:100%;margin-top:25px;padding:18px;cursor:pointer;font-size:16px}.submit:hover:not(:disabled),.primaryButton:hover{background:#333}.submit:disabled{opacity:.55;cursor:not-allowed}.summary{position:sticky;top:20px}.items{margin-top:20px;border-bottom:1px solid #eee}.item{display:flex;align-items:flex-start;gap:12px;padding:15px 0;border-top:1px solid #eee}.item img{width:70px;height:70px;flex:0 0 70px;object-fit:cover;border-radius:8px;background:#eee}.itemInfo{flex:1;min-width:0}.itemInfo strong,.itemInfo span,.itemInfo small{display:block}.itemInfo strong{font-size:14px}.itemInfo span{font-size:11px;color:#777;margin-top:3px}.itemInfo small{margin-top:5px;color:#777}.row{display:flex;justify-content:space-between;padding-top:18px;color:#666}.row strong{color:#111}.summary hr{border:0;border-top:1px solid #eee;margin:20px 0}.total{display:flex;justify-content:space-between;font-size:22px}.checkoutSaving{margin-top:18px;padding:10px 12px;border-radius:9px;background:#fff3a8;color:#17120a;font-size:13px;font-weight:800}.emptyCard{width:min(700px,calc(100% - 40px));margin:100px auto;padding:60px;text-align:center}.emptyIcon{font-size:60px}.primaryButton{padding:14px 24px;margin-top:20px}.celebrationPage{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% 15%,#fff 0,#f7f7f4 38%,#e9e9e5 100%);color:#111;font-family:Arial,"Noto Sans TC",sans-serif;padding:0 20px 70px}.celebrationGlow{position:absolute;width:900px;height:900px;left:50%;top:4%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,220,65,.18),rgba(255,255,255,0) 65%);pointer-events:none}.successHeader{position:relative;z-index:5;height:78px;max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.07)}.successLogo{color:#111;text-decoration:none;font-size:24px;font-weight:900;letter-spacing:-1px}.successHeader span{font-size:10px;letter-spacing:3px;font-weight:800;color:#999}.celebrationContent{position:relative;z-index:3;width:min(900px,100%);margin:40px auto 0;text-align:center;animation:celebrateIn .7s cubic-bezier(.2,.8,.2,1) both}.approvedPill{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid #d9d9d5;border-radius:999px;background:rgba(255,255,255,.8);color:#555;font-size:10px;font-weight:900;letter-spacing:2px;box-shadow:0 8px 30px rgba(0,0,0,.06)}.approvedPill span{display:grid;place-items:center;width:17px;height:17px;border-radius:50%;background:#111;color:#fff;font-size:11px}.successIconLarge{width:86px;height:86px;margin:18px auto 12px;border-radius:50%;display:grid;place-items:center;background:#111;color:#fff;font-size:47px;font-weight:300;box-shadow:0 15px 45px rgba(0,0,0,.2);animation:iconPop .65s .18s cubic-bezier(.2,1.5,.4,1) both}.successEyebrow{color:#999}.celebrationContent h1{margin:8px 0;font-size:clamp(42px,7vw,72px);letter-spacing:-4px;line-height:1.05}.heroMessage{margin:0;color:#777;font-size:16px;line-height:1.8}.heroMessage strong{color:#111}.savingHero{width:min(560px,100%);margin:25px auto 24px;padding:17px 20px;border-radius:18px;background:#111;color:#fff;box-shadow:0 18px 55px rgba(0,0,0,.18);animation:savingPulse 2.8s .8s ease-in-out infinite}.savingHero span{display:block;font-size:12px;color:#ddd;font-weight:800}.savingHero strong{display:block;margin-top:3px;font-size:35px;letter-spacing:-1px;color:#ffe65b}.savingHero small{display:block;margin-top:3px;color:#aaa;font-size:11px}.celebrationCard{width:min(760px,100%);margin:0 auto;background:rgba(255,255,255,.94);border:1px solid rgba(0,0,0,.08);border-radius:22px;padding:24px;text-align:left;box-shadow:0 25px 80px rgba(0,0,0,.12);backdrop-filter:blur(10px)}.celebrationCardHeader{display:flex;align-items:end;justify-content:space-between;gap:15px;padding-bottom:16px;border-bottom:1px solid #eee}.miniLabel{font-size:9px;color:#aaa;letter-spacing:2px;font-weight:900}.celebrationCardHeader h2{margin:5px 0 0;font-size:22px}.celebrationCardHeader>strong{font-size:14px;color:#777}.haulList{max-height:270px;overflow:auto}.haulItem{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid #f0f0f0}.haulItem img{width:54px;height:54px;object-fit:cover;border-radius:10px;background:#eee}.haulInfo{flex:1;min-width:0}.haulInfo strong{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.haulInfo span{display:block;margin-top:3px;font-size:11px;color:#888}.haulItem>strong{font-size:13px;white-space:nowrap}.successStats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:18px}.successStats div{padding:13px;border-radius:12px;background:#f7f7f5}.successStats span{display:block;font-size:10px;color:#999;margin-bottom:5px}.successStats strong{display:block;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.demoNotice{margin:15px auto 0;color:#999;font-size:11px}.successActions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:15px}.celebrationButton{margin-top:0;padding:15px 22px}.secondaryButton{display:inline-flex;align-items:center;padding:15px 22px;border-radius:9px;background:#fff;border:1px solid #ddd;color:#111;text-decoration:none;font-weight:800}.secondaryButton:hover{background:#f5f5f3}.confetti{position:fixed;inset:0;z-index:2;pointer-events:none;overflow:hidden}.confetti i{position:absolute;left:50%;top:-30px;width:10px;height:17px;border-radius:2px;background:#111;animation:confettiFall 2.8s var(--delay) cubic-bezier(.15,.65,.25,1) forwards;transform:translateX(var(--x)) rotate(var(--r));opacity:0}.confetti i:nth-child(3n){width:7px;height:13px;border-radius:50%}.confetti i:nth-child(4n){width:13px;height:7px}.confetti i:nth-child(5n){border-radius:1px}.confetti i:nth-child(2n){background:#e3bd20}.confetti i:nth-child(3n){background:#d94c5b}.confetti i:nth-child(5n){background:#4e83c4}.confetti i:nth-child(7n){background:#f08a3c}@keyframes celebrateIn{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes iconPop{from{opacity:0;transform:scale(.2) rotate(-20deg)}to{opacity:1;transform:scale(1) rotate(0)}}@keyframes savingPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.018)}}@keyframes confettiFall{0%{opacity:0;transform:translate3d(0,-30px,0) rotate(0deg)}8%{opacity:1}100%{opacity:1;transform:translate3d(var(--x),var(--y),0) rotate(var(--r))}}@media(max-width:800px){.content{grid-template-columns:1fr;width:min(100% - 28px,650px)}.title{width:min(100% - 28px,650px);padding-top:35px}.summary{position:static}.card{padding:22px}.successStats{grid-template-columns:1fr}.celebrationPage{padding:0 14px 45px}.successHeader{height:64px}.successHeader span{display:none}.celebrationContent{margin-top:25px}.celebrationCard{padding:18px;border-radius:18px}.haulList{max-height:none}.successIconLarge{width:72px;height:72px;font-size:38px}.celebrationContent h1{font-size:46px;letter-spacing:-3px}.heroMessage{font-size:14px}.savingHero strong{font-size:30px}.successActions{flex-direction:column}.celebrationButton,.secondaryButton{width:100%;justify-content:center}.emptyCard{padding:40px 22px;margin-top:60px}}@media(prefers-reduced-motion:reduce){.celebrationContent,.successIconLarge,.savingHero,.confetti i{animation:none}.confetti{display:none}}
`;