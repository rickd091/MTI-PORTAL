import React from "react";

export const ErrorTest = () => {
  const throwError = () => {
    throw new Error("Test error");
  };

  return (
    <div className="p-4">
      <button
        onClick={throwError}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Throw Test Error
      </button>
    </div>
  );
};

export default ErrorTest;
