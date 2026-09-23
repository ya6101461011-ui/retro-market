"use client";

export default function Loading() {
  return (
    <main className="loading" aria-label="載入中">
      <div className="loader" />
      <div>
        <strong>RETROMART</strong>
        <p>載入購物體驗中...</p>
      </div>
      <style jsx>{`
        .loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 18px;
          background: #f5f5f3;
          color: #111;
          text-align: center;
          font-family: Arial, "Noto Sans TC", "Microsoft JhengHei", sans-serif;
        }
        .loader {
          width: 38px;
          height: 38px;
          border: 3px solid #ddd;
          border-top-color: #111;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }
        strong { font-size: 20px; letter-spacing: 1px; }
        p { margin: 6px 0 0; color: #888; font-size: 13px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .loader { animation: none; } }
      `}</style>
    </main>
  );
}
