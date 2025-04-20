
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

interface AppContextType {
  currency: string;
  exchangeRates: ExchangeRates;
  setCurrency: (currency: string) => void;
  convertPrice: (price: number, targetCurrency?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock exchange rate data (in a real app, would be fetched from an API)
const mockExchangeRates: ExchangeRates = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 150.38,
  INR: 83.36,
  CAD: 1.37,
  AUD: 1.52
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(mockExchangeRates);

  // In a real app, this would fetch from an exchange rate API
  useEffect(() => {
    // Simulating an API call to get the latest exchange rates
    const fetchRates = async () => {
      try {
        // In a real app, this would be a fetch from an API like ExchangeRate-API
        // For now, we're using mock data
        setExchangeRates(mockExchangeRates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchRates();
    // Refresh rates periodically in a real app
    const interval = setInterval(fetchRates, 24 * 60 * 60 * 1000); // once per day
    
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (price: number, targetCurrency?: string): string => {
    const currencyToUse = targetCurrency || currency;
    const rate = exchangeRates[currencyToUse] || 1;
    const convertedPrice = price * rate;
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(convertedPrice);
  };

  return (
    <AppContext.Provider value={{ currency, exchangeRates, setCurrency, convertPrice }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
