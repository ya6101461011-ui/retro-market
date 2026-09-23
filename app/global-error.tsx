"use client";

import Link from "next/link";

export default function GlobalError() {
  return (
    <html lang="zh-Hant-TW">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "#f5f5f3",
            color: "#111",
            fontFamily: 'Arial, "Noto Sans TC", "Microsoft JhengHei", sans-serif',
            textAlign: "center",
          }}
        >
          <section style={{ maxWidth: 620 }}>
            <div style={{ fontSize: 72, fontWeight: 900 }}>RETROMART</div>
            <div style={{ marginTop: 16, color: "#999", letterSpacing: 3, fontSize: 11 }}>
              TEMPORARILY UNAVAILABLE
            </div>
            <h1 style={{ fontSize: 40, margin: "12px 0" }}>網站暫時無法使用</h1>
            <p style={{ color: "#777", lineHeight: 1.8 }}>
              網站發生無法恢復的錯誤，請重新整理頁面後再試一次。
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                marginTop: 24,
                padding: "14px 24px",
                borderRadius: 9,
                background: "#111",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              回到首頁
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
