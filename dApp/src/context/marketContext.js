import React, { createContext, useContext, useState } from "react";

const MarketContext = createContext();

export function useMarket() {
  return useContext(MarketContext);
}

export function MarketProvider({ children }) {
  const [market, setMarket] = useState(2); //default BTC

  const setMarketData = (newMarket) => {
    setMarket(newMarket);
  };

  return (
    <MarketContext.Provider value={{ market, setMarketData }}>
      {children}
    </MarketContext.Provider>
  );
}
