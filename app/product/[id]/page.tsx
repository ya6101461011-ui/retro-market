"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { products } from "../../../lib/products";
import { addToCart as saveCartItem, getCartCount } from "../../../lib/cart";

type ProductOption = {
  name: string;
  values: string[];
};

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  sold: number;
  stock: number;
  rating: number;
  reviewCount: number;
  tag: string;
  image: string;
  images: string[];
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  options?: ProductOption[];

  /*
   * 顏色對應圖片
   *
   * 例如：
   *
   * colorImages: {
   *   "鈦原色": [
   *      "圖片1",
   *      "圖片2"
   *   ],
   *   "黑色": [
   *      "圖片1",
   *      "圖片2"
   *   ]
   * }
   */
  colorImages?: Record<string, string[]>;
};

export default function ProductPage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const product = products.find(
    (item) => item.id === id
  ) as Product | undefined;

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>({});

  const [imageIndex, setImageIndex] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [cartCount, setCartCount] =
    useState(0);

  /*
   * =====================================================
   * 找出目前選擇的顏色
   * =====================================================
   */

  const colorOption = product?.options?.find(
    (option) =>
      option.name === "顏色" ||
      option.name === "颜色" ||
      option.name.toLowerCase() === "color"
  );

  const selectedColor =
    colorOption
      ? selectedOptions["顏色"] ||
        selectedOptions["颜色"] ||
        selectedOptions["Color"] ||
        colorOption.values[0]
      : undefined;

  /*
   * =====================================================
   * 找目前顏色的圖片
   * =====================================================
   */

  const currentImages = useMemo(() => {
    if (!product) {
      return [];
    }

    /*
     * 如果有設定 colorImages
     * 就使用該顏色的圖片
     */

    if (
      selectedColor &&
      product.colorImages &&
      product.colorImages[selectedColor] &&
      product.colorImages[selectedColor].length > 0
    ) {
      return product.colorImages[selectedColor];
    }

    /*
     * 沒有顏色圖片時
     * 使用原本 images
     */

    return product.images?.length
      ? product.images
      : [product.image];
  }, [
    product,
    selectedColor,
  ]);

  /*
   * =====================================================
   * 顏色改變後
   * 自動回到第一張圖片
   * =====================================================
   */

  useEffect(() => {
    setImageIndex(0);
  }, [selectedColor]);

  useEffect(() => {
    const updateCart = () => setCartCount(getCartCount());

    updateCart();

    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  /*
   * =====================================================
   * 找不到商品
   * =====================================================
   */

  if (!product) {
    return (
      <main className="notFound">

        <div>

          <div className="notFoundIcon">
            🔍
          </div>

          <h1>
            找不到商品
          </h1>

          <p>
            這個商品可能不存在，
            或網址輸入錯誤。
          </p>

          <Link href="/">
            ← 回到首頁
          </Link>

        </div>

      </main>
    );
  }

  /*
   * =====================================================
   * 目前主圖
   * =====================================================
   */

  const currentImage =
    currentImages[imageIndex] ||
    currentImages[0] ||
    product.image;

  /*
   * =====================================================
   * 折扣
   * =====================================================
   */

  const discount = Math.round(
    (1 -
      product.price /
        product.oldPrice) *
      100
  );

  /*
   * =====================================================
   * 推薦商品
   * =====================================================
   */

  const recommendedProducts = [
    ...products.filter(
      (item) =>
        item.id !== product.id &&
        item.category ===
          product.category
    ),

    ...products.filter(
      (item) =>
        item.id !== product.id &&
        item.category !==
          product.category
    ),
  ].slice(0, 4);

  /*
   * =====================================================
   * 選擇商品規格
   * =====================================================
   */

  function selectOption(
    optionName: string,
    value: string
  ) {
    setSelectedOptions(
      (previous) => ({
        ...previous,
        [optionName]: value,
      })
    );
  }

  /*
   * =====================================================
   * 數量
   * =====================================================
   */

  function decreaseQuantity() {
    setQuantity(
      (current) =>
        Math.max(1, current - 1)
    );
  }

  function increaseQuantity() {
    setQuantity(
      (current) =>
        Math.min(
          product.stock,
          current + 1
        )
    );
  }

  /*
   * =====================================================
   * 加入購物車
   * =====================================================
   */

  function addToCart() {
    for (let i = 0; i < quantity; i++) {
      saveCartItem(product, selectedOptions);
    }

    setCartCount(getCartCount());

    alert(
      `已加入購物車\n\n${product.name}\n數量：${quantity}`
    );
  }

  /*
   * =====================================================
   * 立即購買
   * =====================================================
   */

  function buyNow() {
    const optionsText =
      Object.entries(
        selectedOptions
      )
        .map(
          ([name, value]) =>
            `${name}：${value}`
        )
        .join("\n");

    alert(
      `準備購買\n\n${product.name}\n數量：${quantity}${
        optionsText
          ? `\n${optionsText}`
          : ""
      }`
    );
  }

  /*
   * =====================================================
   * 圖片載入錯誤
   * =====================================================
   */

  function handleMainImageError(
    event: React.SyntheticEvent<HTMLImageElement>
  ) {
    const img =
      event.currentTarget;

    /*
     * 如果目前不是商品主圖
     * 嘗試改回主圖
     */

    if (
      img.src !==
      product.image
    ) {
      img.src =
        product.image;
      return;
    }

    /*
     * 最後直接隱藏破圖
     */

    img.style.opacity = "0";
  }

  return (
    <main className="page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <Link
          href="/"
          className="logo"
        >
          RETROMART
        </Link>

        <div className="headerRight">

          <Link
            href="/"
            className="backButton"
          >
            ← 繼續逛逛
          </Link>

          <Link
            href="/cart"
            className="cartButton"
          >
            🛒 購物車

            <span>
              {cartCount}
            </span>
          </Link>

        </div>

      </header>


      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="breadcrumb">

        <Link href="/">
          首頁
        </Link>

        <span>›</span>

        <span>
          {product.category}
        </span>

        <span>›</span>

        <span>
          {product.name}
        </span>

      </div>


      {/* =================================================
          PRODUCT
      ================================================= */}

      <section className="productSection">

        {/* =================================================
            GALLERY
        ================================================= */}

        <div className="gallery">

          <div className="mainImage">

            <img
              key={currentImage}
              src={currentImage}
              alt={product.name}
              onError={
                handleMainImageError
              }
            />

            <div className="imageTag">
              {product.tag}
            </div>

            <div className="imageDiscount">
              -{discount}%
            </div>

          </div>


          {/* =================================================
              THUMBNAILS
          ================================================= */}

          <div className="thumbnails">

            {currentImages.map(
              (image, index) => (

                <button
                  key={`${image}-${index}`}
                  className={
                    imageIndex === index
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() =>
                    setImageIndex(index)
                  }
                >

                  <img
                    src={image}
                    alt={`${product.name} ${
                      index + 1
                    }`}
                    onError={(
                      event
                    ) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                </button>

              )
            )}

          </div>


          {/* =================================================
              COLOR PREVIEW
          ================================================= */}

          {selectedColor && (
            <div className="selectedColorInfo">

              <span>
                目前顏色
              </span>

              <strong>
                {selectedColor}
              </strong>

            </div>
          )}

        </div>


        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="information">

          <div className="brand">
            {product.brand}
          </div>

          <h1>
            {product.name}
          </h1>


          {/* =================================================
              RATING
          ================================================= */}

          <div className="ratingRow">

            <span className="stars">
              ★★★★★
            </span>

            <strong>
              {product.rating}
            </strong>

            <span className="reviews">
              {product.reviewCount.toLocaleString()}
              {" "}則評論
            </span>

            <span className="soldText">
              已售{" "}
              {product.sold.toLocaleString()}
            </span>

          </div>


          {/* =================================================
              PRICE
          ================================================= */}

          <div className="priceBox">

            <div className="oldPrice">
              NT$
              {product.oldPrice.toLocaleString()}
            </div>

            <div className="price">
              NT$
              {product.price.toLocaleString()}
            </div>

            <span className="discountBadge">
              -{discount}%
            </span>

          </div>


          {/* =================================================
              ACTIVITY
          ================================================= */}

          <div className="activityBox">

            <div>
              🔥 目前 37 人正在查看
            </div>

            <div>
              ⚡ 最近 1 小時有 12 人查看此商品
            </div>

            <div>
              📦 庫存剩餘 {product.stock} 件
            </div>

          </div>


          {/* =================================================
              OPTIONS
          ================================================= */}

          {product.options?.map(
            (option) => {

              const optionSelected =
                selectedOptions[
                  option.name
                ] ||
                option.values[0];

              return (

                <div
                  className="optionGroup"
                  key={option.name}
                >

                  <div className="optionTitle">

                    {option.name}

                    <span>
                      ：
                      {
                        optionSelected
                      }
                    </span>

                  </div>


                  <div className="options">

                    {option.values.map(
                      (value) => {

                        const isSelected =
                          optionSelected ===
                          value;

                        const isColor =
                          option.name ===
                            "顏色" ||
                          option.name ===
                            "颜色" ||
                          option.name.toLowerCase() ===
                            "color";

                        return (

                          <button
                            key={value}
                            className={
                              isSelected
                                ? "option selected"
                                : "option"
                            }
                            onClick={() =>
                              selectOption(
                                option.name,
                                value
                              )
                            }
                          >

                            {isColor && (
                              <span
                                className={
                                  "colorDot " +
                                  value
                                }
                              />
                            )}

                            {value}

                          </button>

                        );

                      }
                    )}

                  </div>

                </div>

              );

            }
          )}


          {/* =================================================
              QUANTITY
          ================================================= */}

          <div className="quantityArea">

            <div className="optionTitle">
              數量
            </div>

            <div className="quantity">

              <button
                onClick={
                  decreaseQuantity
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={
                  increaseQuantity
                }
              >
                ＋
              </button>

            </div>

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="buttons">

            <button
              className="addButton"
              onClick={addToCart}
            >
              🛒 加入購物車
            </button>

            <button
              className="buyButton"
              onClick={buyNow}
            >
              立即購買
            </button>

          </div>


          {/* =================================================
              SERVICE
          ================================================= */}

          <div className="serviceBox">

            <div>
              ✓ 虛擬商品展示
            </div>

            <div>
              ✓ 不會產生真實付款
            </div>

            <div>
              ✓ 不會實際出貨
            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      <section className="details">

        <div className="detailsHeader">

          <span>
            PRODUCT INFORMATION
          </span>

          <h2>
            商品詳細資訊
          </h2>

        </div>


        <div className="description">

          <h3>
            商品介紹
          </h3>

          <p>
            {product.description}
          </p>

        </div>


        <div className="specSection">

          <h3>
            商品規格
          </h3>

          <div className="specTable">

            {product.specs.map(
              (spec) => (

                <div
                  className="specRow"
                  key={spec.label}
                >

                  <div className="specLabel">
                    {spec.label}
                  </div>

                  <div className="specValue">
                    {spec.value}
                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          REVIEWS
      ================================================= */}

      <section className="reviewsSection">

        <div className="detailsHeader">

          <span>
            REVIEWS
          </span>

          <h2>
            買家評論
          </h2>

        </div>


        <div className="reviewSummary">

          <div className="bigRating">
            {product.rating}

            <span>
              / 5
            </span>
          </div>

          <div>

            <div className="stars">
              ★★★★★
            </div>

            <p>
              根據{" "}
              {product.reviewCount.toLocaleString()}
              {" "}則評論
            </p>

          </div>

        </div>


        <div className="reviewGrid">

          <div className="review">

            <div className="reviewTop">

              <strong>
                王先生
              </strong>

              <span className="stars">
                ★★★★★
              </span>

            </div>

            <p>
              商品資訊整理得很完整，
              整體瀏覽體驗很好。
            </p>

          </div>


          <div className="review">

            <div className="reviewTop">

              <strong>
                陳小姐
              </strong>

              <span className="stars">
                ★★★★★
              </span>

            </div>

            <p>
              商品規格跟圖片都很清楚，
              很方便比較。
            </p>

          </div>


          <div className="review">

            <div className="reviewTop">

              <strong>
                林先生
              </strong>

              <span className="stars">
                ★★★★☆
              </span>

            </div>

            <p>
              整體商品頁做得很像真正的電商網站。
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          RECOMMEND
      ================================================= */}

      <section className="recommendSection">

        <div className="detailsHeader">

          <span>
            YOU MAY ALSO LIKE
          </span>

          <h2>
            你可能也喜歡
          </h2>

        </div>


        <div className="recommendGrid">

          {recommendedProducts.map(
            (item) => {

              const itemDiscount =
                Math.round(
                  (1 -
                    item.price /
                      item.oldPrice) *
                    100
                );

              return (

                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="recommendCard"
                >

                  <div className="recommendImage">

                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <span className="recommendTag">
                      {item.tag}
                    </span>

                  </div>


                  <div className="recommendInfo">

                    <div className="recommendBrand">
                      {item.brand}
                    </div>

                    <h3>
                      {item.name}
                    </h3>

                    <div className="recommendPrice">

                      <strong>
                        NT$
                        {item.price.toLocaleString()}
                      </strong>

                      <span>
                        -{itemDiscount}%
                      </span>

                    </div>

                  </div>

                </Link>

              );

            }
          )}

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div>

          <div className="footerLogo">
            RETROMART
          </div>

          <p>
            EVERYTHING YOU WANT.
          </p>

        </div>


        <div className="footerText">

          <strong>
            虛擬購物體驗
          </strong>

          <p>
            本網站為虛擬購物體驗。
            商品、價格、銷售數字、
            庫存與評論皆為展示用途。
          </p>

          <p>
            不會產生真實訂單、
            付款或商品配送。
          </p>

        </div>

      </footer>


      {/* =================================================
          CSS
      ================================================= */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f5f5f3;
          color: #111;
          font-family:
            Arial,
            "Noto Sans TC",
            "Microsoft JhengHei",
            sans-serif;
        }


        /* HEADER */

        .header {
          height: 78px;
          padding: 0 6%;

          background: white;

          border-bottom:
            1px solid #e5e5e5;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          color: #111;
          text-decoration: none;

          font-size: 25px;
          font-weight: 900;

          letter-spacing: -1px;
        }

        .headerRight {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .backButton {
          padding: 11px 17px;

          color: #111;
          text-decoration: none;

          font-weight: 600;
        }

        .cartButton {
          padding: 11px 17px;

          background: #111;
          color: white;

          border: none;
          border-radius: 8px;

          cursor: pointer;

          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .cartButton span {
          display: inline-block;

          margin-left: 7px;
          padding: 2px 7px;

          background: white;
          color: #111;

          border-radius: 20px;
        }


        /* BREADCRUMB */

        .breadcrumb {
          max-width: 1300px;
          margin: 0 auto;

          padding: 25px 30px;

          display: flex;

          gap: 10px;

          color: #999;

          font-size: 13px;
        }

        .breadcrumb a {
          color: #555;
          text-decoration: none;
        }


        /* PRODUCT */

        .productSection {
          max-width: 1300px;
          margin: 0 auto;

          padding:
            10px 30px 70px;

          display: grid;

          grid-template-columns:
            1.05fr .95fr;

          gap: 70px;
        }


        /* GALLERY */

        .mainImage {
          height: 600px;

          background: #eaeae8;

          border-radius: 18px;

          overflow: hidden;

          position: relative;
        }

        .mainImage img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            opacity .2s,
            transform .3s;
        }

        .imageTag,
        .imageDiscount {
          position: absolute;

          top: 18px;

          padding: 7px 11px;

          border-radius: 6px;

          color: white;

          font-size: 12px;

          font-weight: 700;
        }

        .imageTag {
          left: 18px;

          background: #111;
        }

        .imageDiscount {
          right: 18px;

          background: #e11d48;
        }


        /* THUMBNAILS */

        .thumbnails {
          display: flex;

          gap: 12px;

          margin-top: 12px;

          overflow-x: auto;

          padding-bottom: 4px;
        }

        .thumbnail {
          flex-shrink: 0;

          width: 82px;
          height: 82px;

          padding: 0;

          border-radius: 9px;

          overflow: hidden;

          background: #eee;

          border:
            2px solid transparent;

          cursor: pointer;

          transition: .15s;
        }

        .thumbnail.active {
          border-color: #111;
        }

        .thumbnail:hover {
          border-color: #777;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;
        }


        /* SELECTED COLOR */

        .selectedColorInfo {
          margin-top: 15px;

          padding: 13px 16px;

          background: white;

          border-radius: 8px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          font-size: 13px;
        }

        .selectedColorInfo span {
          color: #999;
        }


        /* INFORMATION */

        .brand {
          margin-top: 10px;

          color: #999;

          font-size: 12px;

          letter-spacing: 2px;
        }

        .information h1 {
          margin:
            12px 0 18px;

          font-size: 46px;

          line-height: 1.1;

          letter-spacing: -2px;
        }

        .ratingRow {
          display: flex;

          align-items: center;

          gap: 12px;

          flex-wrap: wrap;

          font-size: 14px;
        }

        .stars {
          color: #f59e0b;

          letter-spacing: 2px;
        }

        .reviews,
        .soldText {
          color: #777;
        }


        /* PRICE */

        .priceBox {
          margin-top: 30px;

          padding: 24px;

          background: white;

          border-radius: 12px;
        }

        .oldPrice {
          color: #999;

          font-size: 17px;

          text-decoration:
            line-through;
        }

        .price {
          margin-top: 5px;

          font-size: 43px;

          font-weight: 900;

          letter-spacing: -1px;
        }

        .discountBadge {
          display: inline-block;

          margin-top: 8px;

          padding: 5px 8px;

          background: #e11d48;

          color: white;

          border-radius: 5px;

          font-size: 12px;

          font-weight: 700;
        }


        /* ACTIVITY */

        .activityBox {
          margin-top: 15px;

          padding: 17px;

          background: #fff8eb;

          border-radius: 10px;

          color: #6b4d18;

          line-height: 2;

          font-size: 13px;
        }


        /* OPTIONS */

        .optionGroup {
          margin-top: 25px;
        }

        .optionTitle {
          margin-bottom: 10px;

          font-size: 14px;

          font-weight: 700;
        }

        .optionTitle span {
          color: #777;

          font-weight: 400;
        }

        .options {
          display: flex;

          flex-wrap: wrap;

          gap: 9px;
        }

        .option {
          min-height: 44px;

          padding:
            10px 17px;

          border:
            1px solid #ccc;

          background: white;

          border-radius: 7px;

          cursor: pointer;

          display: flex;

          align-items: center;

          gap: 8px;

          transition: .15s;
        }

        .option:hover {
          border-color: #111;
        }

        .option.selected {
          padding:
            9px 16px;

          border:
            2px solid #111;

          background: #111;

          color: white;

          font-weight: 700;
        }


        /* COLOR DOT */

        .colorDot {
          width: 17px;
          height: 17px;

          border-radius: 50%;

          display: inline-block;

          border:
            1px solid #aaa;
        }

        .colorDot.鈦原色 {
          background:
            linear-gradient(
              135deg,
              #b9b9b9,
              #eeeeee,
              #777
            );
        }

        .colorDot.黑色 {
          background: #111;
        }

        .colorDot.銀色 {
          background:
            linear-gradient(
              135deg,
              #eee,
              #999,
              #fff
            );
        }

        .colorDot.白色 {
          background: white;
        }

        .colorDot.藍色 {
          background: #2454a6;
        }

        .colorDot.紫色 {
          background: #7c4d9e;
        }

        .colorDot.紅色 {
          background: #c62828;
        }

        .colorDot.綠色 {
          background: #47795a;
        }


        /* QUANTITY */

        .quantityArea {
          margin-top: 25px;
        }

        .quantity {
          width: fit-content;

          display: flex;

          align-items: center;

          border:
            1px solid #ccc;

          background: white;

          border-radius: 8px;

          overflow: hidden;
        }

        .quantity button {
          width: 44px;
          height: 44px;

          border: none;

          background: white;

          font-size: 20px;

          cursor: pointer;
        }

        .quantity button:hover {
          background: #eee;
        }

        .quantity span {
          width: 45px;

          text-align: center;

          font-weight: 600;
        }


        /* BUTTONS */

        .buttons {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;

          margin-top: 25px;
        }

        .addButton,
        .buyButton {
          padding: 17px;

          border-radius: 9px;

          font-size: 16px;

          font-weight: 800;

          cursor: pointer;
        }

        .addButton {
          background: white;

          border:
            2px solid #111;
        }

        .addButton:hover {
          background: #111;

          color: white;
        }

        .buyButton {
          background: #111;

          color: white;

          border:
            2px solid #111;
        }

        .buyButton:hover {
          background: #333;
        }


        /* SERVICE */

        .serviceBox {
          margin-top: 18px;

          padding-top: 18px;

          border-top:
            1px solid #ddd;

          display: flex;

          flex-direction: column;

          gap: 8px;

          color: #666;

          font-size: 13px;
        }


        /* DETAILS */

        .details,
        .reviewsSection {
          max-width: 1300px;

          margin: 0 auto;

          padding:
            65px 30px;

          border-top:
            1px solid #ddd;
        }

        .detailsHeader span {
          color: #999;

          font-size: 10px;

          letter-spacing: 2px;
        }

        .detailsHeader h2 {
          margin:
            8px 0 30px;

          font-size: 32px;
        }

        .description {
          max-width: 850px;
        }

        .description h3,
        .specSection h3 {
          font-size: 20px;
        }

        .description p {
          color: #555;

          line-height: 1.9;
        }

        .specSection {
          max-width: 900px;

          margin-top: 40px;
        }

        .specTable {
          border-top:
            1px solid #ddd;
        }

        .specRow {
          display: grid;

          grid-template-columns:
            220px 1fr;
        }

        .specLabel,
        .specValue {
          padding: 16px;

          border-bottom:
            1px solid #ddd;
        }

        .specLabel {
          background: #eee;

          font-weight: 700;
        }

        .specValue {
          background: white;

          color: #555;
        }


        /* REVIEWS */

        .reviewSummary {
          width: fit-content;

          padding: 25px;

          background: white;

          border-radius: 12px;

          display: flex;

          align-items: center;

          gap: 25px;
        }

        .bigRating {
          font-size: 45px;

          font-weight: 900;
        }

        .bigRating span {
          color: #999;

          font-size: 14px;
        }

        .reviewSummary p {
          margin:
            5px 0 0;

          color: #888;
        }

        .reviewGrid {
          margin-top: 25px;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;
        }

        .review {
          padding: 22px;

          background: white;

          border-radius: 12px;
        }

        .reviewTop {
          display: flex;

          justify-content:
            space-between;

          gap: 10px;
        }

        .review p {
          color: #555;

          line-height: 1.7;
        }


        /* RECOMMEND */

        .recommendSection {
          max-width: 1300px;

          margin: 0 auto;

          padding:
            65px 30px;

          border-top:
            1px solid #ddd;
        }

        .recommendGrid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 18px;
        }

        .recommendCard {
          display: block;

          color: inherit;

          text-decoration: none;

          background: white;

          border-radius: 13px;

          overflow: hidden;

          transition:
            transform .2s,
            box-shadow .2s;
        }

        .recommendCard:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 15px 35px
            rgba(0,0,0,.12);
        }

        .recommendImage {
          height: 230px;

          background: #eee;

          position: relative;

          overflow: hidden;
        }

        .recommendImage img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;
        }

        .recommendTag {
          position: absolute;

          top: 12px;
          left: 12px;

          padding:
            5px 8px;

          background: #111;

          color: white;

          border-radius: 5px;

          font-size: 10px;

          font-weight: 700;
        }

        .recommendInfo {
          padding: 17px;
        }

        .recommendBrand {
          color: #999;

          font-size: 10px;

          letter-spacing: 1px;
        }

        .recommendInfo h3 {
          margin:
            7px 0 14px;

          font-size: 16px;

          line-height: 1.4;
        }

        .recommendPrice {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 10px;
        }

        .recommendPrice strong {
          font-size: 18px;
        }

        .recommendPrice span {
          padding:
            4px 6px;

          background: #e11d48;

          color: white;

          border-radius: 4px;

          font-size: 10px;

          font-weight: 700;
        }


        /* FOOTER */

        .footer {
          padding:
            60px 8%;

          background: #111;

          color: white;

          display: flex;

          justify-content:
            space-between;

          gap: 60px;
        }

        .footerLogo {
          font-size: 28px;

          font-weight: 900;
        }

        .footer p {
          max-width: 500px;

          color: #999;

          line-height: 1.7;
        }


        /* NOT FOUND */

        .notFound {
          min-height: 100vh;

          display: flex;

          align-items: center;

          justify-content: center;

          text-align: center;

          background: #f5f5f3;
        }

        .notFoundIcon {
          font-size: 50px;
        }

        .notFound h1 {
          font-size: 40px;
        }

        .notFound p {
          color: #777;

          margin-bottom: 25px;
        }

        .notFound a {
          color: #111;

          font-weight: 700;
        }


        /* TABLET */

        @media (max-width: 1000px) {

          .productSection {
            grid-template-columns: 1fr;

            gap: 35px;
          }

          .recommendGrid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .reviewGrid {
            grid-template-columns: 1fr;
          }

        }


        /* MOBILE */

        @media (max-width: 600px) {

          .header {
            height: auto;

            padding: 15px;
          }

          .backButton {
            display: none;
          }

          .breadcrumb {
            padding:
              20px 15px;

            overflow-x: auto;

            white-space: nowrap;
          }

          .productSection,
          .details,
          .reviewsSection,
          .recommendSection {
            padding-left: 15px;

            padding-right: 15px;
          }

          .mainImage {
            height: 400px;
          }

          .information h1 {
            font-size: 34px;
          }

          .price {
            font-size: 35px;
          }

          .buttons {
            grid-template-columns:
              1fr;
          }

          .specRow {
            grid-template-columns:
              120px 1fr;
          }

          .recommendGrid {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 10px;
          }

          .recommendImage {
            height: 180px;
          }

          .recommendInfo {
            padding: 12px;
          }

          .recommendInfo h3 {
            font-size: 14px;
          }

          .recommendPrice {
            flex-direction: column;

            align-items:
              flex-start;
          }

          .footer {
            flex-direction: column;

            padding:
              45px 20px;
          }

        }

      `}</style>

    </main>
  );
}