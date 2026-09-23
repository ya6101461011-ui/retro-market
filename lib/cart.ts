import { Product, getProductById } from "./products";

export type CartItem = {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
};

const CART_KEY = "retro-market-cart";

/* =========================
   取得購物車
========================= */

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(CART_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      productId: String(item.productId),
      quantity: Number(item.quantity) || 1,
      selectedOptions: item.selectedOptions || {},
    }));
  } catch (error) {
    console.error("讀取購物車失敗:", error);
    return [];
  }
}

/* =========================
   儲存購物車
========================= */

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    // 通知網站其他地方購物車更新
    window.dispatchEvent(
      new Event("cart-updated")
    );
  } catch (error) {
    console.error("儲存購物車失敗:", error);
  }
}

/* =========================
   比較商品選項
========================= */

function sameOptions(
  a: Record<string, string> = {},
  b: Record<string, string> = {}
) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(
    (key) => a[key] === b[key]
  );
}

/* =========================
   加入購物車
========================= */

export function addToCart(
  product: Product,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();

  const existingItem = cart.find(
    (item) =>
      item.productId === product.id &&
      sameOptions(
        item.selectedOptions,
        selectedOptions
      )
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      quantity: 1,
      selectedOptions: {
        ...selectedOptions,
      },
    });
  }

  saveCart(cart);

  console.log(
    "已加入購物車:",
    product.name,
    selectedOptions
  );
}

/* =========================
   修改數量
========================= */

export function updateCartQuantity(
  productId: string,
  quantity: number,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();

  const item = cart.find(
    (item) =>
      item.productId === productId &&
      sameOptions(
        item.selectedOptions,
        selectedOptions
      )
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(
      productId,
      selectedOptions
    );
    return;
  }

  item.quantity = quantity;

  saveCart(cart);
}

/* =========================
   移除商品
========================= */

export function removeFromCart(
  productId: string,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();

  const newCart = cart.filter(
    (item) =>
      !(
        item.productId === productId &&
        sameOptions(
          item.selectedOptions,
          selectedOptions
        )
      )
  );

  saveCart(newCart);
}

/* =========================
   清空購物車
========================= */

export function clearCart() {
  saveCart([]);
}

/* =========================
   購物車商品數量
========================= */

export function getCartCount() {
  const cart = getCart();

  return cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

/* =========================
   取得購物車商品
========================= */

export function getCartProducts() {
  const cart = getCart();

  return cart
    .map((item) => {
      const product =
        getProductById(item.productId);

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
}