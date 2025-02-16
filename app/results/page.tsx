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
        <div className={"result-text"} id="responseBox">
          {responseMessage}
        </div>
      </div>

)};
