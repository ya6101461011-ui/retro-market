"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartDisplayItem = {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartDisplayItem[]>([]);
  const [ready, setReady] = useState(false);

  function refreshCart() {
    setCartItems(
      getCart().map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || {},
      }))
    );

    setReady(true);
  }

  useEffect(() => {
    refreshCart();

    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener(
      "cart-updated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );
    };
  }, []);

  function increase(item: CartDisplayItem) {
    const product = getProductById(item.productId);

    if (!product) return;

    if (item.quantity >= product.stock) {
      return;
    }

    updateCartQuantity(
      item.productId,
      item.quantity + 1,
      item.selectedOptions
    );

    refreshCart();
  }

  function decrease(item: CartDisplayItem) {
    updateCartQuantity(
      item.productId,
      item.quantity - 1,
      item.selectedOptions
    );

    refreshCart();
  }

  function remove(item: CartDisplayItem) {
    removeFromCart(
      item.productId,
      item.selectedOptions
    );

    refreshCart();
  }

  function emptyCart() {
    clearCart();
    refreshCart();
  }

  const products = cartItems
    .map((item) => {
      const product = getProductById(item.productId);

      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
      };
    })
    .filter(
      (
        item
      ): item is NonNullable<typeof item> =>
        item !== null
    );

  const total = products.reduce(
    (sum, item) =>
      sum +
      item.product.price *
        item.quantity,
    0
  );

  const totalQuantity = products.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  if (!ready) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        載入購物車中...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f3",
        color: "#111",
        fontFamily:
          'Arial, "Noto Sans TC", sans-serif',
      }}
    >

      {/* HEADER */}

      <header
        style={{
          height: 78,
          padding: "0 6%",
          background: "#fff",
          borderBottom:
            "1px solid #e5e5e5",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#111",
            textDecoration: "none",
            fontSize: 25,
            fontWeight: 900,
          }}
        >
          RETROMART
        </Link>

        <Link
          href="/"
          style={{
            color: "#111",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← 繼續購物
        </Link>
      </header>


      {/* TITLE */}

      <section
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding:
            "60px 30px 30px",
        }}
      >
        <div
          style={{
            color: "#999",
            fontSize: 11,
            letterSpacing: 3,
            fontWeight: 700,
          }}
        >
          SHOPPING CART
        </div>

        <h1
          style={{
            margin: "10px 0 5px",
            fontSize: 48,
          }}
        >
          購物車
        </h1>

        <p
          style={{
            color: "#777",
          }}
        >
          {totalQuantity} 件商品
        </p>
      </section>


      {/* EMPTY */}

      {products.length === 0 ? (

        <section
          style={{
            maxWidth: 700,
            margin: "40px auto 120px",
            padding: 70,
            background: "#fff",
            borderRadius: 18,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 60,
            }}
          >
            🛒
          </div>

          <h2>
            購物車是空的
          </h2>

          <p
            style={{
              color: "#777",
            }}
          >
            還沒有加入任何商品。
          </p>

          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: 15,
              padding:
                "14px 28px",
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            開始購物
          </Link>
        </section>

      ) : (

        <section
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding:
              "10px 30px 80px",
            display: "grid",
            gridTemplateColumns:
              "1fr 360px",
            gap: 30,
            alignItems: "start",
          }}
        >

          {/* 商品 */}

          <div
            style={{
              background: "#fff",
              borderRadius: 15,
              overflow: "hidden",
            }}
          >

            <div
              style={{
                padding:
                  "22px 25px",
                borderBottom:
                  "1px solid #eee",
                display: "flex",
                justifyContent:
                  "space-between",
                fontWeight: 800,
              }}
            >
              <span>
                商品
              </span>

              <button
                onClick={emptyCart}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "#999",
                  cursor: "pointer",
                }}
              >
                清空購物車
              </button>
            </div>


            {products.map((item) => {

              const optionsText =
                Object.entries(
                  item.selectedOptions
                )
                  .map(
                    ([name, value]) =>
                      `${name}：${value}`
                  )
                  .join(" / ");

              const itemTotal =
                item.product.price *
                item.quantity;

              return (
                <div
                  key={
                    item.product.id +
                    JSON.stringify(
                      item.selectedOptions
                    )
                  }
                  style={{
                    padding: 25,
                    display: "grid",
                    gridTemplateColumns:
                      "110px 1fr auto",
                    gap: 20,
                    borderBottom:
                      "1px solid #eee",
                  }}
                >

                  <Link
                    href={`/product/${item.product.id}`}
                  >
                    <img
                      src={
                        item.product.image
                      }
                      alt={
                        item.product.name
                      }
                      style={{
                        width: 110,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 10,
                      }}
                    />
                  </Link>


                  <div>

                    <div
                      style={{
                        color: "#999",
                        fontSize: 11,
                        letterSpacing: 1,
                      }}
                    >
                      {item.product.brand}
                    </div>

                    <Link
                      href={`/product/${item.product.id}`}
                      style={{
                        display: "block",
                        marginTop: 7,
                        color: "#111",
                        textDecoration:
                          "none",
                        fontSize: 18,
                        fontWeight: 800,
                      }}
                    >
                      {item.product.name}
                    </Link>

                    {optionsText && (
                      <div
                        style={{
                          marginTop: 10,
                          color: "#666",
                          fontSize: 13,
                        }}
                      >
                        {optionsText}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: 15,
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 10,
                      }}
                    >

                      <button
                        onClick={() =>
                          decrease(item)
                        }
                        style={{
                          width: 35,
                          height: 35,
                          border:
                            "1px solid #ccc",
                          background: "#fff",
                          cursor:
                            "pointer",
                        }}
                      >
                        −
                      </button>

                      <strong>
                        {item.quantity}
                      </strong>

                      <button
                        onClick={() =>
                          increase(item)
                        }
                        style={{
                          width: 35,
                          height: 35,
                          border:
                            "1px solid #ccc",
                          background: "#fff",
                          cursor:
                            "pointer",
                        }}
                      >
                        ＋
                      </button>

                      <button
                        onClick={() =>
                          remove(item)
                        }
                        style={{
                          marginLeft: 10,
                          border: "none",
                          background:
                            "transparent",
                          color: "#999",
                          cursor:
                            "pointer",
                        }}
                      >
                        刪除
                      </button>

                    </div>

                  </div>


                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: 900,
                      fontSize: 18,
                    }}
                  >
                    NT$
                    {itemTotal.toLocaleString()}
                  </div>

                </div>
              );
            })}

          </div>


          {/* 訂單摘要 */}

          <aside
            style={{
              background: "#fff",
              borderRadius: 15,
              padding: 25,
              position: "sticky",
              top: 20,
            }}
          >

            <h2>
              訂單摘要
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: 25,
              }}
            >
              <span>
                商品小計
              </span>

              <strong>
                NT$
                {total.toLocaleString()}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: 18,
              }}
            >
              <span>
                運費
              </span>

              <strong>
                NT$0
              </strong>
            </div>

            <hr
              style={{
                margin:
                  "25px 0",
                border: "none",
                borderTop:
                  "1px solid #ddd",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <strong>
                總計
              </strong>

              <strong
                style={{
                  fontSize: 25,
                }}
              >
                NT$
                {total.toLocaleString()}
              </strong>
            </div>

            <Link
              href="/checkout"
              style={{
                display: "block",
                marginTop: 25,
                padding: 17,
                background: "#111",
                color: "#fff",
                borderRadius: 9,
                textAlign: "center",
                textDecoration:
                  "none",
                fontWeight: 800,
              }}
            >
              前往結帳 →
            </Link>

          </aside>

        </section>
      )}

    </main>
  );
}