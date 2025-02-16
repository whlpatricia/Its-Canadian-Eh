"use client";

import NextLink from 'next/link';
import "./modal.css"; // Import CSS file
import CameraComponent from './camera_component';

export default function Scanner_Modal() {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3 className="modal-title">Scan barcode!</h3>
        <CameraComponent />
        <NextLink href="/" className="modal-close">
          Close
        </NextLink>
      </div>
    </div>
  );
}
