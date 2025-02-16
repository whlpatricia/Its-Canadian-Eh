"use client"
interface ProductDetails {
  brand: string;
  title: string;
  images: string[];
}

import React, { useState, useEffect, useRef} from 'react';
import NextLink from "next/link"
import styles from "./page.module.css"
import Modal from "react-modal"

const App: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const closeModal = () => {
    setShowDisclaimer(false);
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

  // Show disclaimer if the brand starts with "F"
  useEffect(() => {
    if (productDetails && productDetails.brand.startsWith("F")) {
      setShowDisclaimer(true);
    } else {
      setShowDisclaimer(false);
    }
  }, [productDetails]);

  // Play the audio when the modal opens
  useEffect(() => {
    if (showDisclaimer && audioRef.current) {
      audioRef.current.play();
    } else{
      audioRef.current?.pause()
    }
  }, [showDisclaimer]);

   // Set the app element for accessibility
   useEffect(() => {
    Modal.setAppElement('.app-container'); // Use the class selector if you don't have an ID
  }, []);

  return (
    <div className={styles.page}>
      <div className="app-container">
        <header className="app-header">
          <NextLink href="/">
            <button className="back-btn"> &#8592; Back </button>
          </NextLink>
          <h1>Its Canadian Eh!</h1>
        </header>
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
          
          {productDetails && (
          <div className="product-details">
            <h2>{productDetails.brand}</h2>
            <h2>{productDetails.title}</h2>
            {/* Display the first image if available */}
            {productDetails.images && productDetails.images.length > 0 && (
              <div className="product-images">
                <img 
                  src={productDetails.images[0]} 
                  alt="Product Image" 
                  style={{ width: '400px', height: 'auto', margin: '5px' }}  
                />
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      <Modal
        isOpen={showDisclaimer}
        onRequestClose={closeModal}
        contentLabel="NON Canadian Product"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          content: {
            width: "400px",
            height: "50vh",
            margin: "auto",
            padding: "0px",
            border: "none",
            overflow: "hidden",
          },
        }}
      >
        <div className="modal-content">
        <h2>Disclaimer</h2>
        <p>This product is NOT Canadian.</p>
        <button onClick={closeModal}>Close</button>

        <audio ref={audioRef} src="/warning.mp3" preload="auto" />
      </div>
      </Modal>
    </div>
  );
};

export default App;
