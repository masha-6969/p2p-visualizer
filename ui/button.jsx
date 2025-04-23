// src/components/ui/button.jsx
import React from "react";

export function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    >
      {children}
    </button>
  );
}