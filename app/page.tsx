"use client"

import styles from "./page.module.css";
import NextLink from 'next/link';

export default function HomePage() {

  const ScanBarcode = async (): Promise<void> => {
    console.log("barcode is scanned");
    const response = await fetch('/api/process_barcode'); // Replace with your API endpoint
    const result = await response.json();
    console.log(result);
  };

  return (
    <div className={styles.page}>
      <h1>Hello</h1>
      <NextLink href="/results"><button onClick={ScanBarcode}>Scan Barcode</button></NextLink>
      <input placeholder="Input something for GPT" /> 
    </div>
  );
}
