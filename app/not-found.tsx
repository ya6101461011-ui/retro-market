"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="card">
        <div className="code">404</div>
        <div className="eyebrow">PAGE NOT FOUND</div>
        <h1>找不到這個頁面</h1>
        <p>你要找的商品或頁面可能已不存在，或網址輸入錯誤。</p>
        <div className="actions">
          <Link href="/" className="primary">回到首頁</Link>
          <Link href="/cart" className="secondary">查看購物車</Link>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: #f5f5f3;
          color: #111;
          font-family: Arial, "Noto Sans TC", "Microsoft JhengHei", sans-serif;
        }
        .card {
          width: min(680px, 100%);
          padding: clamp(40px, 8vw, 80px) 30px;
          text-align: center;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,.08);
        }
        .code {
          font-size: clamp(72px, 16vw, 150px);
          line-height: .85;
          font-weight: 900;
          letter-spacing: -8px;
        }
        .eyebrow {
          margin-top: 25px;
          color: #999;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: 800;
        }
        h1 {
          margin: 12px 0 10px;
          font-size: clamp(30px, 6vw, 48px);
          letter-spacing: -2px;
        }
        p {
          margin: 0 auto;
          max-width: 460px;
          color: #777;
          line-height: 1.8;
        }
        .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 30px;
        }
        .primary, .secondary {
          padding: 13px 20px;
          border-radius: 9px;
          text-decoration: none;
          font-weight: 800;
        }
        .primary { background: #111; color: #fff; }
        .secondary { border: 1px solid #ccc; color: #111; background: #fff; }
        .primary:hover { background: #333; }
        .secondary:hover { border-color: #111; }
      `}</style>
    </main>
  );
}
