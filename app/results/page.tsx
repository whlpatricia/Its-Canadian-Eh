"use client";
interface ProductDetails {
  brand: string;
  title: string;
  images: string[];
}

import React, { useState } from 'react';
import NextLink from "next/link";
import "./module.css";
import { useResponse } from "../contexts/ResponseContext";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect"; 

export default function Results() {
  const {responseMessage } = useResponse();
  const [barcode, setBarcode] = useState<string>('');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [words, setWords] = useState<{ text: string; className?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      <div className="app-container">
        <header className="app-header">
        <div className={"title-box"}>
        <h1 className={"title"}>Its Canadian, Eh?</h1>
      </div>
        <NextLink href="/" className="modal-back">
          Back
        </NextLink>
        </header>
        <div className={"prompt-text"}
            id="promptBox"></div>
         <div className={"result-text"}
            id="responseBox">
           </div>
      </div>

)};
