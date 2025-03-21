import { createContext, ReactNode, useContext, useState } from "react";

type SymbolContextType = {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
};

const SymbolContext = createContext<SymbolContextType | undefined>(undefined);

export const SymbolProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSymbol, setSelectedSymbol] = useState("");

  return (
    <SymbolContext.Provider value={{ selectedSymbol, setSelectedSymbol }}>
      {children}
    </SymbolContext.Provider>
  );
};

export const useSymbolContext = () => {
  const context = useContext(SymbolContext);
  if (context === undefined) {
    throw new Error("useSymbolContext must be used within a SymbolProvider");
  }
  return context;
};
