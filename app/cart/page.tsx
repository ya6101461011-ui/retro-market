"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartItem = ReturnType<typeof getCart>[number];
type DisplayItem = CartItem & {
  product: NonNullable<ReturnType<typeof getProductById>>;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(getCart());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();

    const onUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key === "retro-market-cart") refresh();
    };

    window.addEventListener("cart-updated", onUpdate);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart-updated", onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const displayItems = useMemo<DisplayItem[]>(() => {
    return items
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { ...item, product } : null;
      })
      .filter((item): item is DisplayItem => item !== null);
  }, [items]);

  const total = displayItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalQuantity = displayItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function changeQuantity(item: DisplayItem, delta: number) {
    const next = Math.min(
      item.product.stock,
      Math.max(1, item.quantity + delta)
    );

    updateCartQuantity(
      item.productId,
      next,
      item.selectedOptions
    );
  }

  function removeItem(item: DisplayItem) {
    removeFromCart(item.productId, item.selectedOptions);
  }

  function clearAll() {
    if (window.confirm("確定要清空購物車嗎？")) {
      clearCart();
    }
  }

  if (!ready) {
    return <main className="loading">載入購物車中...</main>;
  }

  return (
    <main className="page">
      <header className="header">
        <Link href="/" className="logo">RETROMART</Link>
        <Link href="/" className="continue">← 繼續購物</Link>
      </header>

      <section className="titleWrap">
        <div className="eyebrow">SHOPPING CART</div>
        <h1>購物車</h1>
        <p>{totalQuantity} 件商品</p>
      </section>

      {displayItems.length === 0 ? (
        <section className="empty">
          <div className="emptyIcon">🛒</div>
          <h2>購物車是空的</h2>
          <p>還沒有加入任何商品。</p>
          <Link href="/" className="primary">開始購物</Link>
        </section>
      ) : (
        <section className="content">
          <div className="list card">
            <div className="listHeader">
              <strong>商品</strong>
              <button type="button" onClick={clearAll}>清空購物車</button>
            </div>

            {displayItems.map((item) => {
              const optionsText = Object.entries(item.selectedOptions || {})
                .map(([name, value]) => `${name}：${value}`)
                .join(" / ");
              const atMax = item.quantity >= item.product.stock;
              const itemTotal = item.product.price * item.quantity;

              return (
                <article
                  className="item"
                  key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                >
                  <Link href={`/product/${item.product.id}`} className="imageLink">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      loading="lazy"
                      onError={(event) => {
                        if (event.currentTarget.src !== FALLBACK_IMAGE) {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }
                      }}
                    />
                  </Link>

                  <div className="itemInfo">
                    <span className="brand">{item.product.brand}</span>
                    <Link href={`/product/${item.product.id}`} className="name">
                      {item.product.name}
                    </Link>
                    {optionsText && <span className="options">{optionsText}</span>}
                    <span className="unitPrice">NT${item.product.price.toLocaleString()} / 件</span>

                    <div className="controls">
                      <div className="quantity" aria-label={`${item.product.name} 商品數量`}>
                        <button type="button" onClick={() => changeQuantity(item, -1)} aria-label="減少數量">−</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item, 1)} disabled={atMax} aria-label="增加數量">＋</button>
                      </div>
                      <button type="button" className="remove" onClick={() => removeItem(item)}>刪除</button>
                      {atMax && <span className="stockHint">已達庫存上限</span>}
                    </div>
                  </div>

                  <strong className="itemTotal">NT${itemTotal.toLocaleString()}</strong>
                </article>
              );
            })}
          </div>

          <aside className="summary card">
            <h2>訂單摘要</h2>
            <div className="summaryRow"><span>商品數量</span><strong>{totalQuantity} 件</strong></div>
            <div className="summaryRow"><span>商品小計</span><strong>NT${total.toLocaleString()}</strong></div>
            <div className="summaryRow"><span>運費</span><strong>NT$0</strong></div>
            <hr />
            <div className="grandTotal"><span>總計</span><strong>NT${total.toLocaleString()}</strong></div>
            <Link href="/checkout" className="checkout">前往結帳 →</Link>
            <p className="note">本網站為虛擬購物體驗，不會產生真實付款或配送。</p>
          </aside>
        </section>
      )}

      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height:100vh; background:#f5f5f3; color:#111; font-family:Arial,"Noto Sans TC","Microsoft JhengHei",sans-serif; }
        .loading { min-height:100vh; display:grid; place-items:center; background:#f5f5f3; color:#666; font-family:Arial,"Noto Sans TC",sans-serif; }
        .header { height:78px; padding:0 6%; background:#fff; border-bottom:1px solid #e5e5e5; display:flex; align-items:center; justify-content:space-between; }
        .logo,.continue { color:#111; text-decoration:none; }
        .logo { font-size:25px; font-weight:900; letter-spacing:-1px; }
        .continue { font-weight:700; }
        .titleWrap { width:min(1300px,calc(100% - 60px)); margin:0 auto; padding:60px 0 30px; }
        .eyebrow { color:#999; font-size:11px; letter-spacing:3px; font-weight:800; }
        h1 { margin:10px 0 5px; font-size:48px; letter-spacing:-2px; }
        .titleWrap p { margin:0; color:#777; }
        .content { width:min(1300px,calc(100% - 60px)); margin:0 auto; padding:10px 0 90px; display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:30px; align-items:start; }
        .card,.empty { background:#fff; border-radius:16px; }
        .list { overflow:hidden; }
        .listHeader { min-height:68px; padding:0 25px; border-bottom:1px solid #eee; display:flex; align-items:center; justify-content:space-between; }
        .listHeader button { border:0; background:transparent; color:#888; cursor:pointer; }
        .listHeader button:hover { color:#111; }
        .item { padding:25px; display:grid; grid-template-columns:110px minmax(0,1fr) auto; gap:20px; border-bottom:1px solid #eee; }
        .imageLink { width:110px; height:110px; display:block; }
        .imageLink img { width:100%; height:100%; object-fit:cover; border-radius:10px; background:#eee; display:block; }
        .brand { display:block; color:#999; font-size:11px; letter-spacing:1px; }
        .name { display:block; margin-top:7px; color:#111; text-decoration:none; font-size:18px; line-height:1.4; font-weight:800; }
        .name:hover { text-decoration:underline; }
        .options { display:block; margin-top:8px; color:#666; font-size:13px; }
        .unitPrice { display:block; margin-top:10px; color:#777; font-size:12px; }
        .controls { display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin-top:15px; }
        .quantity { display:flex; align-items:center; width:max-content; border:1px solid #ccc; border-radius:8px; overflow:hidden; background:#fff; }
        .quantity button { width:36px; height:36px; border:0; background:#fff; cursor:pointer; font-size:18px; }
        .quantity button:hover:not(:disabled) { background:#eee; }
        .quantity button:disabled { color:#bbb; cursor:not-allowed; }
        .quantity span { width:38px; text-align:center; font-weight:700; }
        .remove { border:0; background:transparent; color:#999; cursor:pointer; padding:5px; }
        .remove:hover { color:#e11d48; }
        .stockHint { color:#999; font-size:11px; }
        .itemTotal { white-space:nowrap; font-size:18px; }
        .summary { padding:25px; position:sticky; top:20px; }
        .summary h2 { margin:0 0 25px; }
        .summaryRow,.grandTotal { display:flex; align-items:center; justify-content:space-between; gap:15px; }
        .summaryRow { margin-top:15px; color:#666; }
        .summary hr { margin:25px 0; border:0; border-top:1px solid #ddd; }
        .grandTotal strong { font-size:25px; }
        .summary::before { content:"💰 本次虛擬購物完全免費"; display:block; margin-bottom:14px; padding:8px 10px; background:#f6e85f; color:#111; border-radius:7px; font-size:11px; font-weight:900; text-align:center; }
        .checkout,.primary { display:block; padding:17px; background:#111; color:#fff; border-radius:9px; text-align:center; text-decoration:none; font-weight:800; }
        .checkout { margin-top:25px; min-height:66px; padding:18px 20px; font-size:18px; line-height:1.35; letter-spacing:.3px; box-shadow:0 5px 14px rgba(0,0,0,.14); transition:transform .15s ease,background .15s ease,box-shadow .15s ease; }
        .checkout::after { content:"⚡ 虛擬刷卡 0 元"; display:block; margin-top:6px; font-size:11px; font-weight:500; color:#aaa; }
        .checkout:hover { background:#333; transform:translateY(-1px); box-shadow:0 7px 18px rgba(0,0,0,.2); }
        .checkout:focus-visible { outline:3px solid #f6e85f; outline-offset:3px; }
        .primary:hover { background:#333; }
        .note { margin:16px 0 0; color:#999; font-size:12px; line-height:1.6; }
        .empty { width:min(700px,calc(100% - 30px)); margin:40px auto 120px; padding:70px 30px; text-align:center; }
        .emptyIcon { font-size:60px; }
        .empty h2 { margin:15px 0 8px; }
        .empty p { color:#777; }
        .primary { width:max-content; margin:20px auto 0; padding:14px 28px; }
        @media(max-width:900px) { .content { grid-template-columns:1fr; } .summary { position:static; } }
        @media(max-width:600px) { .header { height:68px; padding:0 15px; } .logo { font-size:21px; } .continue { font-size:13px; } .titleWrap,.content { width:calc(100% - 30px); } .titleWrap { padding:40px 0 20px; } h1 { font-size:38px; } .item { grid-template-columns:80px minmax(0,1fr); gap:14px; padding:18px 15px; } .imageLink { width:80px; height:80px; } .itemTotal { grid-column:2; justify-self:start; font-size:16px; margin-top:-5px; } .name { font-size:16px; } .controls { gap:8px; } .listHeader { padding:0 15px; } .summary { padding:20px; } .checkout { min-height:70px; padding:19px 18px; font-size:19px; border-radius:10px; } .checkout::after { font-size:11px; margin-top:6px; } .empty { padding:55px 20px; } }
      `}</style>
    </main>
  );
}
