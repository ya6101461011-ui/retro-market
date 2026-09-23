export default function Loading() {
  return (
    <main
      aria-label="載入中"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        alignContent: "center",
        gap: "18px",
        background: "#f5f5f3",
        color: "#111",
        textAlign: "center",
        fontFamily: 'Arial, "Noto Sans TC", "Microsoft JhengHei", sans-serif',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "38px",
          height: "38px",
          border: "3px solid #ddd",
          borderTopColor: "#111",
          borderRadius: "50%",
        }}
      />
      <div>
        <strong style={{ fontSize: "20px", letterSpacing: "1px" }}>
          RETROMART
        </strong>
        <p style={{ margin: "6px 0 0", color: "#888", fontSize: "13px" }}>
          載入購物體驗中...
        </p>
      </div>
    </main>
  );
}
