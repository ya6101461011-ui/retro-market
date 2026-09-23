    "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartItem = {
  productId: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [payment, setPayment] =
    useState("信用卡");

  useEffect(() => {
    setCartItems(getCart());
    setLoaded(true);
  }, []);

  const products = cartItems
    .map((item) => {
      const product = getProductById(
        item.productId
      );

      if (!product) return null;

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

  function submitOrder(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!name || !phone || !email || !address) {
      alert("請完整填寫收件資訊。");
      return;
    }

    if (products.length === 0) {
      alert("購物車目前沒有商品。");
      return;
    }

    alert(
      `訂單已建立！\n\n` +
      `收件人：${name}\n` +
      `電話：${phone}\n` +
      `Email：${email}\n\n` +
      `付款方式：${payment}\n` +
      `訂單金額：NT$${total.toLocaleString()}`
    );
  }

  if (!loaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        載入結帳資料中...
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f5f3",
          paddingBottom: 100,
        }}
      >

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
            href="/cart"
            style={{
              color: "#111",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← 回購物車
          </Link>

        </header>

        <section
          style={{
            maxWidth: 700,
            margin: "100px auto",
            padding: 60,
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

          <h1>
            購物車是空的
          </h1>

          <p
            style={{
              color: "#777",
            }}
          >
            請先加入商品再進行結帳。
          </p>

          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: 20,
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
          href="/cart"
          style={{
            color: "#111",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← 回購物車
        </Link>

      </header>


      {/* TITLE */}

      <section
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding:
            "60px 30px 35px",
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
          CHECKOUT
        </div>

        <h1
          style={{
            margin: "10px 0 0",
            fontSize: 48,
            letterSpacing: -2,
          }}
        >
          結帳
        </h1>

      </section>


      {/* CONTENT */}

      <section
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding:
            "10px 30px 100px",

          display: "grid",

          gridTemplateColumns:
            "1fr 380px",

          gap: 30,

          alignItems: "start",
        }}
      >

        {/* LEFT */}

        <form
          onSubmit={submitOrder}
          style={{
            background: "#fff",
            borderRadius: 15,
            padding: 30,
          }}
        >

          {/* CUSTOMER */}

          <h2>
            收件資訊
          </h2>

          <div
            style={{
              display: "grid",
              gap: 18,
              marginTop: 25,
            }}
          >

            <label>
              <span>
                收件人
              </span>

              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="請輸入姓名"
              />
            </label>


            <label>
              <span>
                電話
              </span>

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="請輸入手機號碼"
              />
            </label>


            <label>
              <span>
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="example@email.com"
              />
            </label>


            <label>
              <span>
                收件地址
              </span>

              <input
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                placeholder="請輸入收件地址"
              />
            </label>

          </div>


          {/* PAYMENT */}

          <h2
            style={{
              marginTop: 45,
            }}
          >
            付款方式
          </h2>


          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 20,
            }}
          >

            {[
              "信用卡",
              "貨到付款",
              "銀行轉帳",
            ].map((method) => (

              <button
                type="button"
                key={method}
                onClick={() =>
                  setPayment(method)
                }
                style={{
                  padding: 18,

                  textAlign: "left",

                  border:
                    payment === method
                      ? "2px solid #111"
                      : "1px solid #ddd",

                  background:
                    payment === method
                      ? "#f5f5f3"
                      : "#fff",

                  borderRadius: 9,

                  cursor: "pointer",

                  fontWeight:
                    payment === method
                      ? 800
                      : 500,
                }}
              >

                {payment === method
                  ? "● "
                  : "○ "}

                {method}

              </button>

            ))}

          </div>


          {/* NOTICE */}

          <div
            style={{
              marginTop: 30,
              padding: 18,
              background: "#fff8eb",
              borderRadius: 10,
              color: "#76551c",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >

            本網站為虛擬購物體驗。
            <br />

            不會真的進行信用卡扣款，
            也不會實際配送商品。

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 25,
              padding: 18,

              background: "#111",
              color: "#fff",

              border: "none",
              borderRadius: 9,

              fontSize: 16,
              fontWeight: 800,

              cursor: "pointer",
            }}
          >
            建立虛擬訂單 →
          </button>

        </form>


        {/* RIGHT */}

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
              marginTop: 20,
              borderBottom:
                "1px solid #eee",
            }}
          >

            {products.map((item) => {

              const optionsText =
                Object.entries(
                  item.selectedOptions || {}
                )
                  .map(
                    ([name, value]) =>
                      `${name}：${value}`
                  )
                  .join(" / ");

              return (
                <div
                  key={
                    item.product.id +
                    JSON.stringify(
                      item.selectedOptions
                    )
                  }
                  style={{
                    display: "flex",
                    gap: 12,
                    padding:
                      "15px 0",
                    borderTop:
                      "1px solid #eee",
                  }}
                >

                  <img
                    src={
                      item.product.image
                    }
                    alt={
                      item.product.name
                    }
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.product.name}
                    </div>

                    {optionsText && (
                      <div
                        style={{
                          marginTop: 5,
                          color: "#888",
                          fontSize: 11,
                        }}
                      >
                        {optionsText}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: 6,
                        color: "#777",
                        fontSize: 12,
                      }}
                    >
                      × {item.quantity}
                    </div>

                  </div>

                  <strong>
                    NT$
                    {(
                      item.product.price *
                      item.quantity
                    ).toLocaleString()}
                  </strong>

                </div>
              );
            })}

          </div>


          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginTop: 20,
              color: "#666",
            }}
          >
            <span>
              商品數量
            </span>

            <strong>
              {totalQuantity} 件
            </strong>
          </div>


          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginTop: 15,
              color: "#666",
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
                "22px 0",
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

        </aside>

      </section>


      {/* CSS */}

      <style jsx>{`

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
        }

        input:focus {
          border-color: #111;
        }

        @media (max-width: 900px) {
          section {
            grid-template-columns: 1fr !important;
          }

          aside {
            position: static !important;
          }
        }

        @media (max-width: 600px) {
          section {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
        }

      `}</style>

    </main>
  );
}