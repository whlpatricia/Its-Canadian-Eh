"use client";

import styles from "./page.module.css";

export default function HomePage() {

  const ScanBarcode = (): void => {
    console.log("barcode is scanned");
    // Navigate to the result page after scanning
  };

  return (
    <div className={styles.page}>
      <h1>Hello</h1>
      <button onClick={ScanBarcode}>Scan Barcode</button>
      <input placeholder="Input something for GPT" />
    </div>
  );
}
