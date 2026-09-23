import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RETROMART｜Everything You Want.",
    short_name: "RETROMART",
    description: "RETROMART 虛擬購物體驗。探索 3C、電玩、精品、汽車等熱門商品。",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f3",
    theme_color: "#111111",
    lang: "zh-TW",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
