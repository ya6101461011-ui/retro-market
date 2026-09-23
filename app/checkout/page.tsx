"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCart, getCart } from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartItem = {
  productId: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=1000&q=85";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("信用卡");

  useEffect(() => {
    setCartItems(getCart());
    setLoaded(true);
  }, []);

  const products = cartItems
    .map((item) => {
      const product = getProductById(item.productId);

      if (!product) return null;

      return {
        ...item,
        product,
      };
    })
    .filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

  const total = products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalQuantity = products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function submitOrder(event: React.FormEvent) {
    event.preventDefault();

    if (submitting) return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanAddress = address.trim();

    if (!cleanName || !cleanPhone || !cleanEmail || !cleanAddress) {
      alert("請完整填寫收件資訊。");
      return;
    }

    if (products.length === 0) {
      alert("購物車目前沒有商品。");
      return;
    }

    setSubmitting(true);

    const newOrderNumber = `RM${Date.now().toString().slice(-8)}`;
    setOrderNumber(newOrderNumber);

    // 本網站為虛擬購物體驗，不會產生真實付款或配送。
    clearCart();
    setCartItems([]);
    setSubmitting(false);
  }

  if (!loaded) {
    return (
      <main className="loadingPage">
        載入結帳資料中...
        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f3;
            color: #555;
            font-family: Arial, "Noto Sans TC", sans-serif;
          }
        `}</style>
      </main>
    );
  }

  if (orderNumber) {
    return (
      <main className="successPage">
        <header className="header">
          <Link href="/" className="logo">
            RETROMART
          </Link>
          <Link href="/" className="headerLink">
            ← 回首頁
          </Link>
        </header>

        <section className="successCard">
          <div className="successIcon">✓</div>
          <div className="eyebrow">ORDER CREATED</div>
          <h1>虛擬訂單已建立</h1>
          <p className="successText">
            這是一筆展示用訂單，不會產生真實付款或商品配送。
          </p>

          <div className="orderNumber">
            <span>訂單編號</span>
            <strong>{orderNumber}</strong>
          </div>

          <div className="successSummary">
            <div>
              <span>收件人</span>
              <strong>{name}</strong>
            </div>
            <div>
              <span>付款方式</span>
              <strong>{payment}</strong>
            </div>
            <div>
              <span>商品數量</span>
              <strong>{totalQuantity} 件</strong>
            </div>
            <div>
              <span>訂單金額</span>
              <strong>NT${total.toLocaleString()}</strong>
            </div>
          </div>

          <Link href="/" className="primaryButton">
            繼續逛逛
          </Link>
        </section>

        <style jsx>{`
          .successPage {
            min-height: 100vh;
            background: #f5f5f3;
            color: #111;
            font-family: Arial, "Noto Sans TC", sans-serif;
          }

          .header {
            height: 78px;
            padding: 0 6%;
            background: #fff;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo,
          .headerLink {
            color: #111;
            text-decoration: none;
          }

          .logo {
            font-size: 25px;
            font-weight: 900;
          }

          .headerLink {
            font-weight: 700;
          }

          .successCard {
            width: min(760px, calc(100% - 30px));
            margin: 80px auto;
            padding: 55px;
            background: #fff;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
          }

          .successIcon {
            width: 70px;
            height: 70px;
            margin: 0 auto 25px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: #111;
            color: #fff;
            font-size: 34px;
            font-weight: 900;
          }

          .eyebrow {
            color: #999;
            font-size: 11px;
            letter-spacing: 3px;
            font-weight: 800;
          }

          h1 {
            margin: 10px 0;
            font-size: 42px;
            letter-spacing: -2px;
          }

          .successText {
            color: #777;
            line-height: 1.8;
          }

          .orderNumber {
            margin: 30px auto;
            padding: 18px;
            background: #f5f5f3;
            border-radius: 10px;
          }

          .orderNumber span,
          .successSummary span {
            display: block;
            color: #999;
            font-size: 12px;
          }

          .orderNumber strong {
            display: block;
            margin-top: 6px;
            font-size: 24px;
            letter-spacing: 1px;
          }

          .successSummary {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            text-align: left;
          }

          .successSummary > div {
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 9px;
          }

          .successSummary strong {
            display: block;
            margin-top: 5px;
          }

          .primaryButton {
            display: inline-block;
            margin-top: 28px;
            padding: 15px 28px;
            background: #111;
            color: #fff;
            border-radius: 9px;
            text-decoration: none;
            font-weight: 800;
          }

          @media (max-width: 600px) {
            .header {
              padding: 0 15px;
            }

            .successCard {
              margin: 30px auto;
              padding: 35px 20px;
            }

            h1 {
              font-size: 34px;
            }

            .successSummary {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="emptyPage">
        <header className="header">
          <Link href="/" className="logo">
            RETROMART
          </Link>
          <Link href="/cart" className="headerLink">
            ← 回購物車
          </Link>
        </header>

        <section className="emptyCard">
          <div className="emptyIcon">🛒</div>
          <h1>購物車是空的</h1>
          <p>請先加入商品再進行結帳。</p>
          <Link href="/" className="primaryButton">
            開始購物
          </Link>
        </section>

        <style jsx>{`
          .emptyPage {
            min-height: 100vh;
            background: #f5f5f3;
            color: #111;
            font-family: Arial, "Noto Sans TC", sans-serif;
          }

          .header {
            height: 78px;
            padding: 0 6%;
            background: #fff;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo,
          .headerLink {
            color: #111;
            text-decoration: none;
          }

          .logo {
            font-size: 25px;
            font-weight: 900;
          }

          .headerLink {
            font-weight: 700;
          }

          .emptyCard {
            width: min(700px, calc(100% - 30px));
            margin: 100px auto;
            padding: 60px 30px;
            background: #fff;
            border-radius: 18px;
            text-align: center;
          }

          .emptyIcon {
            font-size: 60px;
          }

          .emptyCard p {
            color: #777;
          }

          .primaryButton {
            display: inline-block;
            margin-top: 20px;
            padding: 14px 28px;
            background: #111;
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <Link href="/" className="logo">
          RETROMART
        </Link>
        <Link href="/cart" className="headerLink">
          ← 回購物車
        </Link>
      </header>

      <section className="titleSection">
        <div className="eyebrow">CHECKOUT</div>
        <h1>結帳</h1>
        <p>完成以下資料即可建立虛擬展示訂單。</p>
      </section>

      <section className="content">
        <form onSubmit={submitOrder} className="formCard">
          <h2>收件資訊</h2>

          <div className="fields">
            <label>
              <span>收件人</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="請輸入姓名"
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>電話</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="請輸入手機號碼"
                inputMode="tel"
                autoComplete="tel"
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>收件地址</span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="請輸入收件地址"
                autoComplete="street-address"
                required
              />
            </label>
          </div>

          <h2 className="paymentTitle">付款方式</h2>

          <div className="payments">
            {["信用卡", "貨到付款", "銀行轉帳"].map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPayment(method)}
                className={payment === method ? "payment selected" : "payment"}
              >
                {payment === method ? "● " : "○ "}
                {method}
              </button>
            ))}
          </div>

          <div className="notice">
            本網站為虛擬購物體驗。<br />
            不會真的進行信用卡扣款，也不會實際配送商品。
          </div>

          <button type="submit" className="submitButton" disabled={submitting}>
            {submitting ? "建立中..." : "建立虛擬訂單 →"}
          </button>
        </form>

        <aside className="summary">
          <h2>訂單摘要</h2>

          <div className="summaryItems">
            {products.map((item) => {
              const optionsText = Object.entries(item.selectedOptions || {})
                .map(([optionName, value]) => `${optionName}：${value}`)
                .join(" / ");

              return (
                <div
                  key={item.product.id + JSON.stringify(item.selectedOptions)}
                  className="summaryItem"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onError={(event) => {
                      if (event.currentTarget.src !== fallbackImage) {
                        event.currentTarget.src = fallbackImage;
                      }
                    }}
                  />

                  <div className="summaryInfo">
                    <strong>{item.product.name}</strong>
                    {optionsText && <span>{optionsText}</span>}
                    <small>× {item.quantity}</small>
                  </div>

                  <strong>
                    NT${(item.product.price * item.quantity).toLocaleString()}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="summaryRow">
            <span>商品數量</span>
            <strong>{totalQuantity} 件</strong>
          </div>

          <div className="summaryRow">
            <span>運費</span>
            <strong>NT$0</strong>
          </div>

          <hr />

          <div className="totalRow">
            <strong>總計</strong>
            <strong>NT${total.toLocaleString()}</strong>
          </div>
        </aside>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f5f3;
          color: #111;
          font-family: Arial, "Noto Sans TC", sans-serif;
        }

        .header {
          height: 78px;
          padding: 0 6%;
          background: #fff;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo,
        .headerLink {
          color: #111;
          text-decoration: none;
        }

        .logo {
          font-size: 25px;
          font-weight: 900;
        }

        .headerLink {
          font-weight: 700;
        }

        .titleSection,
        .content {
          width: min(1300px, calc(100% - 60px));
          margin: 0 auto;
        }

        .titleSection {
          padding: 60px 0 35px;
        }

        .eyebrow {
          color: #999;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: 800;
        }

        .titleSection h1 {
          margin: 10px 0 5px;
          font-size: 48px;
          letter-spacing: -2px;
        }

        .titleSection p {
          margin: 0;
          color: #777;
        }

        .content {
          padding-bottom: 100px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 30px;
          align-items: start;
        }

        .formCard,
        .summary {
          background: #fff;
          border-radius: 15px;
        }

        .formCard {
          padding: 30px;
        }

        .fields {
          display: grid;
          gap: 18px;
          margin-top: 25px;
        }

        label {
          display: block;
        }

        label span {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        input {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          background: #fff;
        }

        input:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
        }

        .paymentTitle {
          margin-top: 45px;
        }

        .payments {
          display: grid;
          gap: 10px;
          margin-top: 20px;
        }

        .payment {
          padding: 18px;
          text-align: left;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 500;
        }

        .payment.selected {
          border: 2px solid #111;
          background: #f5f5f3;
          font-weight: 800;
        }

        .notice {
          margin-top: 30px;
          padding: 18px;
          background: #fff8eb;
          border-radius: 10px;
          color: #76551c;
          font-size: 13px;
          line-height: 1.8;
        }

        .submitButton {
          width: 100%;
          margin-top: 25px;
          padding: 18px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        .submitButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .summary {
          padding: 25px;
          position: sticky;
          top: 20px;
        }

        .summaryItems {
          margin-top: 20px;
          border-bottom: 1px solid #eee;
        }

        .summaryItem {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 15px 0;
          border-top: 1px solid #eee;
        }

        .summaryItem img {
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          object-fit: cover;
          border-radius: 8px;
          background: #eee;
        }

        .summaryInfo {
          min-width: 0;
          flex: 1;
        }

        .summaryInfo strong,
        .summaryInfo span,
        .summaryInfo small {
          display: block;
        }

        .summaryInfo strong {
          font-size: 14px;
          line-height: 1.4;
        }

        .summaryInfo span {
          margin-top: 5px;
          color: #888;
          font-size: 11px;
          line-height: 1.5;
        }

        .summaryInfo small {
          margin-top: 6px;
          color: #777;
          font-size: 12px;
        }

        .summaryRow,
        .totalRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summaryRow {
          margin-top: 15px;
          color: #666;
        }

        .summaryRow:first-of-type {
          margin-top: 20px;
        }

        .summary hr {
          margin: 22px 0;
          border: none;
          border-top: 1px solid #ddd;
        }

        .totalRow strong:last-child {
          font-size: 25px;
        }

        @media (max-width: 900px) {
          .content {
            grid-template-columns: 1fr;
          }

          .summary {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .header {
            padding: 0 15px;
          }

          .titleSection,
          .content {
            width: calc(100% - 30px);
          }

          .titleSection {
            padding: 40px 0 25px;
          }

          .titleSection h1 {
            font-size: 38px;
          }

          .formCard,
          .summary {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}
