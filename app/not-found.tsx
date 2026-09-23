import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f5f5f3",
        color: "#111",
        fontFamily: 'Arial, "Noto Sans TC", "Microsoft JhengHei", sans-serif',
      }}
    >
      <section
        style={{
          width: "min(680px, 100%)",
          padding: "clamp(40px, 8vw, 80px) 30px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(72px, 16vw, 150px)",
            lineHeight: ".85",
            fontWeight: 900,
            letterSpacing: "-8px",
          }}
        >
          404
        </div>
        <div
          style={{
            marginTop: "25px",
            color: "#999",
            fontSize: "11px",
            letterSpacing: "3px",
            fontWeight: 800,
          }}
        >
          PAGE NOT FOUND
        </div>
        <h1
          style={{
            margin: "12px 0 10px",
            fontSize: "clamp(30px, 6vw, 48px)",
            letterSpacing: "-2px",
          }}
        >
          找不到這個頁面
        </h1>
        <p
          style={{
            margin: "0 auto",
            maxWidth: "460px",
            color: "#777",
            lineHeight: 1.8,
          }}
        >
          你要找的商品或頁面可能已不存在，或網址輸入錯誤。
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "13px 20px",
              borderRadius: "9px",
              textDecoration: "none",
              fontWeight: 800,
              background: "#111",
              color: "#fff",
            }}
          >
            回到首頁
          </Link>
          <Link
            href="/cart"
            style={{
              padding: "13px 20px",
              borderRadius: "9px",
              textDecoration: "none",
              fontWeight: 800,
              border: "1px solid #ccc",
              color: "#111",
              background: "#fff",
            }}
          >
            查看購物車
          </Link>
        </div>
      </section>
    </main>
  );
}
