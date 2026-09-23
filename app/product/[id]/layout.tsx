"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addToCart, getCartCount } from "../../../lib/cart";
import { getProductById } from "../../../lib/products";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [purchase, setPurchase] = useState<{
    productId: string;
    quantity: number;
    options: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    setOpen(false);
    setPurchase(null);
    setBusy(false);
  }, [pathname]);

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const buyButton = target?.closest(".buyButton");

    if (!buyButton) return;

    // 攔截商品頁原本的瀏覽器 alert，改成 RETROMART 自己的確認視窗。
    event.preventDefault();
    event.stopPropagation();

    const productId = pathname.split("/").filter(Boolean).pop();
    if (!productId) return;

    const product = getProductById(productId);
    if (!product) return;

    const quantityText = document
      .querySelector(".quantity span")
      ?.textContent
      ?.trim();
    const quantity = Math.max(1, Number.parseInt(quantityText || "1", 10) || 1);

    const options: Record<string, string> = {};
    document.querySelectorAll(".optionGroup").forEach((group) => {
      const title = group.querySelector(".optionTitle");
      const selected = group.querySelector(".option.selected");
      const optionName = title?.firstChild?.textContent?.trim();
      const value = selected?.textContent?.trim();

      if (optionName && value) {
        options[optionName] = value;
      }
    });

    setPurchase({ productId, quantity, options });
    setOpen(true);
  }

  function confirmPurchase() {
    if (!purchase || busy) return;

    const product = getProductById(purchase.productId);
    if (!product) return;

    setBusy(true);

    addToCart(product, purchase.options, purchase.quantity);
    getCartCount();

    // 先讓 localStorage / cart event 完成，再進入結帳頁。
    window.setTimeout(() => {
      router.push("/checkout");
    }, 80);
  }

  return (
    <div onClickCapture={handleClickCapture}>
      {children}

      {open && purchase && (() => {
        const product = getProductById(purchase.productId);
        if (!product) return null;

        const total = product.price * purchase.quantity;
        const savings = Math.max(
          0,
          (product.oldPrice - product.price) * purchase.quantity
        );

        return (
          <div
            className="quickBuyOverlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-buy-title"
            onClick={() => !busy && setOpen(false)}
          >
            <div
              className="quickBuyModal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="quickBuyIcon">⚡</div>
              <div className="quickBuyEyebrow">QUICK CHECKOUT</div>
              <h2 id="quick-buy-title">準備立即購買</h2>
              <p className="quickBuyProduct">{product.name}</p>

              <div className="quickBuyInfo">
                <div>
                  <span>數量</span>
                  <strong>{purchase.quantity} 件</strong>
                </div>
                <div>
                  <span>虛擬訂單</span>
                  <strong>NT${total.toLocaleString()}</strong>
                </div>
                {savings > 0 && (
                  <div className="quickBuySaving">
                    <span>本次立省</span>
                    <strong>NT${savings.toLocaleString()}</strong>
                  </div>
                )}
              </div>

              <p className="quickBuyNotice">
                這是虛擬購物體驗，不會產生真實付款或商品配送。
              </p>

              <div className="quickBuyActions">
                <button
                  type="button"
                  className="quickBuyCancel"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  再看看
                </button>
                <button
                  type="button"
                  className="quickBuyConfirm"
                  onClick={confirmPurchase}
                  disabled={busy}
                >
                  {busy ? "正在前往結帳…" : "確認購買 → 前往結帳"}
                </button>
              </div>
            </div>

            <style jsx>{`
              .quickBuyOverlay {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(0, 0, 0, 0.55);
                backdrop-filter: blur(8px);
                animation: quickBuyFade .18s ease-out;
              }

              .quickBuyModal {
                width: min(480px, 100%);
                padding: 32px;
                border-radius: 24px;
                background: #fff;
                color: #111;
                box-shadow: 0 30px 90px rgba(0, 0, 0, .28);
                animation: quickBuyPop .22s ease-out;
              }

              .quickBuyIcon {
                width: 54px;
                height: 54px;
                display: grid;
                place-items: center;
                margin-bottom: 16px;
                border-radius: 16px;
                background: #111;
                color: #fff;
                font-size: 25px;
              }

              .quickBuyEyebrow {
                color: #999;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 2px;
              }

              .quickBuyModal h2 {
                margin: 7px 0 6px;
                font-size: 30px;
                line-height: 1.2;
              }

              .quickBuyProduct {
                margin: 0 0 22px;
                color: #555;
                font-size: 16px;
                font-weight: 700;
              }

              .quickBuyInfo {
                overflow: hidden;
                border: 1px solid #e8e8e8;
                border-radius: 15px;
              }

              .quickBuyInfo > div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                padding: 15px 17px;
                border-bottom: 1px solid #eee;
              }

              .quickBuyInfo > div:last-child {
                border-bottom: 0;
              }

              .quickBuyInfo span {
                color: #888;
                font-size: 13px;
              }

              .quickBuyInfo strong {
                font-size: 17px;
              }

              .quickBuyInfo .quickBuySaving {
                background: #f2ffd9;
              }

              .quickBuySaving strong {
                color: #287a19;
              }

              .quickBuyNotice {
                margin: 17px 0 22px;
                color: #888;
                font-size: 12px;
                line-height: 1.7;
              }

              .quickBuyActions {
                display: grid;
                grid-template-columns: .8fr 1.6fr;
                gap: 10px;
              }

              .quickBuyActions button {
                min-height: 52px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 800;
                cursor: pointer;
              }

              .quickBuyCancel {
                border: 1px solid #d8d8d8;
                background: #fff;
                color: #333;
              }

              .quickBuyConfirm {
                border: 1px solid #111;
                background: #111;
                color: #fff;
              }

              .quickBuyConfirm:hover:not(:disabled) {
                background: #333;
              }

              .quickBuyActions button:disabled {
                cursor: not-allowed;
                opacity: .6;
              }

              @keyframes quickBuyFade {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              @keyframes quickBuyPop {
                from {
                  opacity: 0;
                  transform: translateY(12px) scale(.97);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @media (max-width: 600px) {
                .quickBuyModal {
                  padding: 24px;
                  border-radius: 20px;
                }

                .quickBuyModal h2 {
                  font-size: 25px;
                }

                .quickBuyActions {
                  grid-template-columns: 1fr;
                }
              }
            `}</style>
          </div>
        );
      })()}
    </div>
  );
}
