"use client";

import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export default function Scanner() {
  const cameraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cameraRef.current) return;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: cameraRef.current,
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: "environment", // Use back camera
            aspectRatio: { min: 1 },
          },
        },
        decoder: {
          readers: ["code_128_reader"], // Supports Code 128 barcode
        },
      },
      (err) => {
        if (err) {
          console.error("Quagga initialization failed:", err);
          return;
        }
        Quagga.start();
      }
    );

    // Quagga.onDetected(function (result)){
    //     alert()
    // }

    return () => {
      Quagga.stop(); // Clean up on unmount
    };
  }, []);

  return <div ref={cameraRef} className="w-full h-[480px] bg-gray-200" />;
}
