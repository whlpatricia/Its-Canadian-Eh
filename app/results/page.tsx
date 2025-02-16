"use client";
interface ProductDetails {
  brand: string;
  title: string;
  images: string[];
}

import React, { useState } from 'react';
import NextLink from "next/link";
import styles from "./page.module.css";
import { useResponse } from "../contexts/ResponseContext";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect"; 

export default function Results() {
  const { responseMessage, title, brand } = useResponse();
  const [barcode, setBarcode] = useState<string>('');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [words, setWords] = useState<{ text: string; className?: string }[]>([]);
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

        // Populate words for TypewriterEffect only after the product details are fetched
        setWords([
          { text: `Brand: ${data.brand}`, className: "text-blue-500" },
          { text: `Product: ${data.title}`, className: "text-green-500" },
        ]);
      } else {
        alert(data.message || "Product not found");
        setWords([
          { text: "Product not found. Please try another barcode." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details");
      setWords([
        { text: "Error fetching product details. Please try again later." },
      ]);
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
        <div>
          <p>Gemini Response: {responseMessage || "No response received"}</p>
          <p>Title: {title || "No title received"}</p>
          <p>Brand: {brand || "No brand received"}</p>
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
              {/* Display only the first image if available */}
              {productDetails.images && productDetails.images.length > 0 && (
                <div className="product-image">
                  <img
                    src={productDetails.images[0]}
                    alt={`Product Image 1`}
                    style={{ width: '400px', height: 'auto', margin: '5px' }}  // Set image size
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Display TypewriterEffect only after button click */}
        {words.length > 0 && <TypewriterEffect words={words} />}
      </div>
    </div>
  );
};
