"use client"

import { useState } from 'react';
import styles from "./page.module.css";
import NextLink from 'next/link';

export default function HomePage() {
  const ScanBarcode = async (): Promise<void> => {
    console.log("barcode is scanned");
    const response = await fetch('/api/process_barcode');
    const result = await response.json();
    console.log(result);
  };

  const [inputValue, setInputValue] = useState('');

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter was pressed:', inputValue);
      // call Gemini with prompt when Enter is pressed
      sendToGemini(inputValue);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendToGemini = async (prompt): Promise<void> => {
    fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: `${prompt}` })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));
  }

  return (
    <div className={styles.page}>
      <h1>Hello</h1>
      <NextLink href="/results"><button onClick={ScanBarcode}>Scan Barcode</button></NextLink>
      <input 
        placeholder="Ask about food products"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterPress}
      />
    </div>
  );
}
