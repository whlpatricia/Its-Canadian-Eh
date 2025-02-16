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
  const { responseMessage, title, brand, promptProp } = useResponse();

  // const parseMessage = (message) => {
  //   return message
  //     .split('*')
  //     .map((part, index) => {
  //       if (index === 0) {
  //         return part;  // First part doesn't get a line break
  //       }
  //       if (index === 1) {
  //         return `- ${part.trim()}`;
  //       }
  //       return `<br />- ${part.trim()}`;  // Add line break and bullet for others
  //     })
  //     .join('');
  // };

  // const parseMessage = (message) => {
  //   return message
  //     .split(/\n+/)
  //     .map((part, index) => {
  //       if (part.trim().startsWith('*') && index === 0) {
  //         return `- ${part.trim().slice(1).trim()}`;
  //       }
  //       if (part.trim().startsWith('*') && index > 1) {
  //         return `<br />- ${part.trim().slice(1).trim()}`;
  //       }
  //       return `${part.trim()}`;
  //     })
  //     .join('');
  // };

  return (
      <div className="app-container">
        <header className="app-header">
        <div className={"title-box"}>
        <h1 className={"title"}>It's Canadian, Eh?</h1>
      </div>
        <NextLink href="/" className="modal-back">
          Back
        </NextLink>
        </header>
        <div className={"prompt-text"} id="promptBox">
          {promptProp == "nothing" ? "": promptProp}
        </div>
        <div
          className={"result-text"}
          id="responseBox">
          {responseMessage}
        </div>
      </div>
)};
