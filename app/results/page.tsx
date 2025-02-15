"use client"

import React, { useState } from 'react';
import NextLink from "next/link"
import styles from "./page.module.css"

interface ProductDetails {
  brand: string;
  title: string;
  images: string[];
}

export default function Results({ responseData }: { responseData: { message: string } | null }) {
  const [barcode, setBarcode] = useState<string>('');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleScanClick = async () => {
    if (!barcode) {
      alert("Please enter a barcode");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/product-info?barcode=${barcode}`);
      const data = await response.json();

      if (response.ok) {
        setProductDetails(data);
      } else {
        alert(data.message || "Product not found");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="app-container">
        <header className="app-header">
          <NextLink href="/">
            <button className="back-btn"> &#8592; Back </button>
          </NextLink>
          <h1>Its Canadian Eh!</h1>
        </header>
        {responseData && <p>{responseData.message}</p>}
        <div className="chat-container">
          <div className="chat-message left">
            <p>Hello! How can I assist you?</p>
          </div>
          <div className="chat-message right">
            <p>Im looking for product information.</p>
          </div>
        </div>
        <div className="content">
          <button className="scan-btn" onClick={handleScanClick} disabled={loading}>
            {loading ? "Loading..." : "Scan Barcode"}
          </button>
          <input
            className="barcode-input"
            type="text"
            placeholder="Enter barcode"
            value={barcode}
            onChange={handleInputChange}
          />

          {/* Display product details if available */}
          {productDetails && (
            <div className="product-details">
              <h2>{productDetails.brand}</h2>
              <h2>{productDetails.title}</h2>
              {productDetails.images && productDetails.images.length > 0 && (
                <div className="product-images">
                  {productDetails.images.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Product Image ${index + 1}`}
                      style={{ width: '400px', height: 'auto', margin: '5px' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
