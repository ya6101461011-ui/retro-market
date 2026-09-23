"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("RETROMART runtime error:", error);
  }, [error]);

  return (
    <main className="page">
      <section className="card" role="alert">
        <div className="icon">!</div>
        <div className="eyebrow">SOMETHING WENT WRONG</div>
        <h1>頁面發生了一點問題</h1>
        <p>你可以先重新載入這個頁面；如果問題持續，再回到首頁重新操作。</p>
        <div className="actions">
          <button type="button" className="primary" onClick={() => reset()}>
            重新載入
          </button>
          <a className="secondary" href="/">
            回到首頁
          </a>
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
        .icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 24px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #111;
          color: #fff;
          font-size: 38px;
          font-weight: 900;
        }
        .eyebrow {
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
          max-width: 480px;
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
          min-height: 46px;
          padding: 12px 22px;
          border-radius: 9px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .primary { border: 0; background: #111; color: #fff; }
        .secondary { border: 1px solid #ccc; color: #111; background: #fff; }
        .primary:hover { background: #333; }
        .secondary:hover { border-color: #111; }
      `}</style>
    </main>
  );
}
