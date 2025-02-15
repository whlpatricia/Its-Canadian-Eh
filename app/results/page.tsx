"use client"

import React, { useState } from 'react';

const App: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleScanClick = () => {
    alert('Scanning barcode: ' + barcode);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Its Canadian Eh</h1>
      </header>
      <div className="content">
        <button className="scan-btn" onClick={handleScanClick}>
          Scan Barcode
        </button>
        <input
          className="barcode-input"
          type="text"
          placeholder="Enter barcode"
          value={barcode}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default App;
