"use client";

import { createContext, useState, useContext } from "react";

const ResponseContext = createContext(null);

export const ResponseProvider = ({ children }) => {
  const [responseMessage, setResponseMessage] = useState("");

  return (
    <ResponseContext.Provider value={{ responseMessage, setResponseMessage }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = () => useContext(ResponseContext);
