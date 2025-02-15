// "use client"



// const App: React.FC = () => {
//   const [barcode, setBarcode] = useState<string>('');

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setBarcode(e.target.value);
//   };

//   const handleScanClick = () => {
//     alert('Scanning barcode: ' + barcode);
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>Its Canadian Eh</h1>
//       </header>
//       <div className="content">
//         <button className="scan-btn" onClick={handleScanClick}>
//           Scan Barcode
//         </button>
//         <input
//           className="barcode-input"
//           type="text"
//           placeholder="Enter barcode"
//           value={barcode}
//           onChange={handleInputChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default App;

"use client"
interface ProductDetails {
  title: string;
  brand: string;
  description: string;
  category: string;
  manufacturer: string;
}

import React, { useState } from 'react';

const App: React.FC = () => {
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
        // Set the product details in state to display them
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
    <div className="app-container">
      <header className="app-header">
        <h1>Its Canadian Eh</h1>
      </header>
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
            <h2>{productDetails.title}</h2>
            <p><strong>Brand:</strong> {productDetails.brand}</p>
            <p><strong>Description:</strong> {productDetails.description}</p>
            <p><strong>Category:</strong> {productDetails.category}</p>
            <p><strong>Manufacturer:</strong> {productDetails.manufacturer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
