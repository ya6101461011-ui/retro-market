import { Product, getProductById } from "./products";

export type CartItem = {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
};

const CART_KEY = "retro-market-cart";
const CART_EVENT = "cart-updated";

function normalizeOptions(
  value: unknown,
  product?: Product
): Record<string, string> {
  const rawOptions: Record<string, string> =
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(
          Object.entries(value as Record<string, unknown>)
            .filter(([, optionValue]) => typeof optionValue === "string")
            .map(([key, optionValue]) => [key, optionValue as string])
        )
      : {};

  if (!product?.options?.length) {
    return rawOptions;
  }

  const normalized: Record<string, string> = {};

  for (const option of product.options) {
    const selected = rawOptions[option.name];

    if (selected && option.values.includes(selected)) {
      normalized[option.name] = selected;
    } else if (option.values.length > 0) {
      // 若舊購物車沒有儲存規格，補上商品頁的第一個預設值。
      normalized[option.name] = option.values[0];
    }
  }

  return normalized;
}

function normalizeQuantity(value: unknown): number {
  const quantity = Number(value);

  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

function sameOptions(
  a: Record<string, string> = {},
  b: Record<string, string> = {}
) {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key, index) => {
    const otherKey = keysB[index];
    return key === otherKey && a[key] === b[otherKey];
  });
}

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return null;
  }

  const raw = item as Record<string, unknown>;
  const productId = String(raw.productId ?? "");

  if (!productId) {
    return null;
  }

  const product = getProductById(productId);

  if (!product || product.stock <= 0) {
    return null;
  }

  return {
    productId,
    quantity: Math.min(
      product.stock,
      normalizeQuantity(raw.quantity)
    ),
    selectedOptions: normalizeOptions(
      raw.selectedOptions,
      product
    ),
  };
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = window.localStorage.getItem(CART_KEY);

    if (!data) {
      return [];
    }

    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalized = parsed
      .map(normalizeCartItem)
      .filter((item): item is CartItem => item !== null);

    // 清理過期商品、無效規格與超出庫存的舊資料。
    if (JSON.stringify(normalized) !== JSON.stringify(parsed)) {
      window.localStorage.setItem(
        CART_KEY,
        JSON.stringify(normalized)
      );
    }

    return normalized;
  } catch (error) {
    console.error("讀取購物車失敗:", error);
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const normalizedCart = cart
      .map(normalizeCartItem)
      .filter((item): item is CartItem => item !== null);

    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify(normalizedCart)
    );

    window.dispatchEvent(new Event(CART_EVENT));
  } catch (error) {
    console.error("儲存購物車失敗:", error);
  }
}

export function addToCart(
  product: Product,
  selectedOptions: Record<string, string> = {},
  quantity = 1
) {
  if (product.stock <= 0) {
    return false;
  }

  const cart = getCart();
  const safeOptions = normalizeOptions(
    selectedOptions,
    product
  );
  const safeQuantity = Math.min(
    product.stock,
    normalizeQuantity(quantity)
  );

  if (safeQuantity <= 0) {
    return false;
  }

  const existingItem = cart.find(
    (item) =>
      item.productId === product.id &&
      sameOptions(item.selectedOptions, safeOptions)
  );

  if (existingItem) {
    const nextQuantity = Math.min(
      product.stock,
      existingItem.quantity + safeQuantity
    );

    if (nextQuantity === existingItem.quantity) {
      return false;
    }

    existingItem.quantity = nextQuantity;
  } else {
    cart.push({
      productId: product.id,
      quantity: safeQuantity,
      selectedOptions: safeOptions,
    });
  }

  saveCart(cart);
  return true;
}

export function updateCartQuantity(
  productId: string,
  quantity: number,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();
  const product = getProductById(productId);

  if (!product || product.stock <= 0) {
    removeFromCart(productId, selectedOptions);
    return;
  }

  const normalizedOptions = normalizeOptions(
    selectedOptions,
    product
  );

  const item = cart.find(
    (cartItem) =>
      cartItem.productId === productId &&
      sameOptions(cartItem.selectedOptions, normalizedOptions)
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId, normalizedOptions);
    return;
  }

  item.quantity = Math.min(
    product.stock,
    Math.max(1, Math.floor(quantity))
  );

  saveCart(cart);
}

export function removeFromCart(
  productId: string,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();
  const product = getProductById(productId);
  const normalizedOptions = normalizeOptions(
    selectedOptions,
    product
  );

  const newCart = cart.filter(
    (item) =>
      !(
        item.productId === productId &&
        sameOptions(item.selectedOptions, normalizedOptions)
      )
  );

  saveCart(newCart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getCartProducts() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(
      (item): item is NonNullable<typeof item> => item !== null
    );
}

export const CART_UPDATED_EVENT = CART_EVENT;
