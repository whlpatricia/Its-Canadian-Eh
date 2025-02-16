"use client";

import { createContext, useState, useContext } from "react";

const ResponseContext = createContext(null);

export const ResponseProvider = ({ children }) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");

  return (
    <ResponseContext.Provider value={{ responseMessage, setResponseMessage, title, setTitle, brand, setBrand }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = () => useContext(ResponseContext);
