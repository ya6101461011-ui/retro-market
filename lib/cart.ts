import { Product, getProductById } from "./products";

export type CartItem = {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
};

const CART_KEY = "retro-market-cart";
const CART_EVENT = "cart-updated";

function normalizeOptions(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, optionValue]) => typeof optionValue === "string")
      .map(([key, optionValue]) => [key, optionValue as string])
  );
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

    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          !!item &&
          typeof item === "object" &&
          !Array.isArray(item)
      )
      .map((item) => ({
        productId: String(item.productId ?? ""),
        quantity: normalizeQuantity(item.quantity),
        selectedOptions: normalizeOptions(item.selectedOptions),
      }))
      .filter((item) => item.productId.length > 0);
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
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
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
  const cart = getCart();
  const safeOptions = normalizeOptions(selectedOptions);
  const safeQuantity = Math.min(
    product.stock,
    normalizeQuantity(quantity)
  );

  if (product.stock <= 0 || safeQuantity <= 0) {
    return;
  }

  const existingItem = cart.find(
    (item) =>
      item.productId === product.id &&
      sameOptions(item.selectedOptions, safeOptions)
  );

  if (existingItem) {
    existingItem.quantity = Math.min(
      product.stock,
      existingItem.quantity + safeQuantity
    );
  } else {
    cart.push({
      productId: product.id,
      quantity: safeQuantity,
      selectedOptions: safeOptions,
    });
  }

  saveCart(cart);
}

export function updateCartQuantity(
  productId: string,
  quantity: number,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();
  const item = cart.find(
    (cartItem) =>
      cartItem.productId === productId &&
      sameOptions(cartItem.selectedOptions, selectedOptions)
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId, selectedOptions);
    return;
  }

  const product = getProductById(productId);
  const safeQuantity = Math.floor(quantity);

  item.quantity = product
    ? Math.min(product.stock, safeQuantity)
    : safeQuantity;

  if (item.quantity <= 0) {
    removeFromCart(productId, selectedOptions);
    return;
  }

  saveCart(cart);
}

export function removeFromCart(
  productId: string,
  selectedOptions: Record<string, string> = {}
) {
  const cart = getCart();

  const newCart = cart.filter(
    (item) =>
      !(
        item.productId === productId &&
        sameOptions(item.selectedOptions, selectedOptions)
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
