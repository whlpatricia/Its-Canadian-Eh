"use client"

import styles from "./page.module.css";
// import { Suspense } from "react";
import NextLink from 'next/link';
// import { headers } from "next/headers";
import { useSearchParams } from 'next/navigation'
import Scanner_Modal from "./scanner_modal";

export default function HomePage() {

  const ScanBarcode = async (): Promise<void> => {
    console.log("barcode is scanned");
    const response = await fetch('/api/process_barcode'); // Replace with your API endpoint
    const result = await response.json();
    console.log(result);
  };

  // const headersList = headers();
  // await var fullUrl = headersList.get("referer") || "Unknown URL";
  // const GetSearchParams(): void => {
    
  // }
  // console.log(show);
    const searchParams = useSearchParams();
    const show = searchParams.get('show');

  return (
    <div className=''>
      <h1>Its Canadian Eh?</h1>
      <NextLink href="/?show=true"><button onClick={ScanBarcode}>Scan Barcode</button></NextLink>
      <input placeholder="Input something for GPT" /> 
      {show && <Scanner_Modal />}
    </div>
  );
}
