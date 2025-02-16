"use client";

import { createContext, useState, useContext } from "react";

const ResponseContext = createContext(null);

export const ResponseProvider = ({ children }) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [promptProp, setPromptProp] = useState("");

  return (
    <ResponseContext.Provider value={{ responseMessage, setResponseMessage, title, setTitle, brand, setBrand, promptProp, setPromptProp }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = () => useContext(ResponseContext);
