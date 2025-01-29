import React from "react";

export const Alert = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className={`p-4 rounded-lg ${variants[variant]}`}>{children}</div>
  );
};

export const AlertTitle = ({ children }) => (
  <h5 className="font-medium mb-1">{children}</h5>
);

export const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);
