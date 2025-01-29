import React, { createContext, useContext, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorContextType {
  setError: (error: string | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const MTIErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ setError, clearError }}>
      {error && (
        <Alert
          variant="destructive"
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within a MTIErrorProvider");
  }
  return context;
};
